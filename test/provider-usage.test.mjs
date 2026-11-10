import { test } from "node:test";
import assert from "node:assert/strict";
import { createProviderUsage, normalizeMiniMax } from "../lib/provider-usage.js";
import { callRoute, credentials, jsonResponse, loadHost, makeCtx, usagePayload } from "./support/harness.mjs";

const host = await loadHost();
const miniPayload = { model_remains: [{ model_name: "MiniMax-M2.5", current_interval_remaining_percent: 75, current_weekly_remaining_percent: 90, end_time: 1800000000000 }] };

function boot() {
	const providers = {
		"opencode-go": { apiKeyEnv: "GO", baseURL: "https://opencode.ai/zen/go" },
		"minimax-cn": { apiKeyEnv: "MINI", displayName: "MiniMax" },
		deepseek: { apiKeyEnv: "DEEP" },
		openrouter: { apiKeyEnv: "ROUTER" },
		"moonshot-cn": { apiKeyEnv: "MOON" },
		custom: { apiKeyEnv: "CUSTOM", baseURL: "https://example.com/v1" }
	};
	const map = { GO: "go-test", MINI: "mini-test", DEEP: "deep-test", ROUTER: "router-test", MOON: "moon-test", CUSTOM: "custom-test" };
	const requests = [];
	let fail = false;
	globalThis.fetch = async (url, options) => {
		if (String(url).includes("registry.npmjs.org")) return jsonResponse({ version: "0.0.1" });
		requests.push({ url, auth: new Headers(options.headers).get("authorization") });
		if (fail) return jsonResponse({ error: "private upstream message" }, 401);
		if (String(url).includes("coding_plan/remains")) return jsonResponse(miniPayload);
		if (String(url).includes("opencode.ai")) return jsonResponse(usagePayload());
		if (String(url).includes("deepseek.com")) return jsonResponse({ balance_infos: [{ total_balance: "12.3456", currency: "CNY" }, { total_balance: "0", currency: "USD" }] });
		if (String(url).includes("openrouter.ai")) return jsonResponse({ data: { total_credits: 10, total_usage: 3.5 } });
		if (String(url).includes("moonshot.cn")) return jsonResponse({ data: { available_balance: "0" } });
		throw new Error("Unexpected URL");
	};
	const entry = { options: { id: "llm-pi-ai" }, fiber: { uid: 1, config: { providers: { get: () => providers } } } };
	const harness = makeCtx({ entries: [entry], credentialMap: map });
	const config = { injectSessionHeader: false, updateCheck: false, cacheMs: 30000 };
	host.apply(harness.ctx, config);
	return {
		...harness, providers, map, requests, config,
		fail: (value) => { fail = value; },
		usage: (provider, model = "MiniMax-M2.5") => callRoute(harness.routes, "/opencode-go/usage", {
			url: "/opencode-go/usage?" + new URLSearchParams({ provider, model })
		})
	};
}

test("provider route switches GO, MiniMax and monetary balances with matching credentials", async () => {
	const app = boot();
	assert.equal((await app.usage("opencode-go")).body.usage.monthly.percent, 56);
	const mini = await app.usage("minimax-cn");
	assert.equal(mini.body.provider.id, "minimax-cn");
	assert.equal(mini.body.usage.rolling.percent, 25);
	assert.equal(mini.body.usage.weekly.percent, 10);
	assert.equal(mini.body.usage.monthly, undefined);
	assert.deepEqual((await app.usage("deepseek")).body.balances, [{ amount: 12.3456, currency: "CNY" }, { amount: 0, currency: "USD" }]);
	assert.equal((await app.usage("openrouter")).body.balances[0].amount, 6.5);
	assert.equal((await app.usage("moonshot-cn")).body.balances[0].amount, 0);
	assert.deepEqual(app.requests.map((request) => request.auth), ["Bearer go-test", "Bearer mini-test", "Bearer deep-test", "Bearer router-test", "Bearer moon-test"]);
	assert.ok(!JSON.stringify(mini.body).includes("mini-test"));
});

test("unsupported routes, custom proxies and missing credentials never fall back to GO", async () => {
	const app = boot();
	for (const id of ["custom", "unknown", "__proto__"]) {
		const response = await app.usage(id);
		assert.equal(response.status, 200);
		assert.equal(response.body.kind, "unavailable");
		assert.equal(response.body.reason, "unsupported");
		assert.equal(response.body.usage, undefined);
	}
	delete app.map.MINI;
	assert.equal((await app.usage("minimax-cn")).body.reason, "missing-credential");
	assert.equal(app.requests.length, 0);
});

test("provider cache coalesces reads and isolates models, providers and credential changes", async () => {
	const app = boot();
	await Promise.all([app.usage("minimax-cn"), app.usage("minimax-cn")]);
	assert.equal(app.requests.length, 1);
	await app.usage("deepseek");
	await app.usage("minimax-cn", "MiniMax-M2.7");
	assert.equal(app.requests.length, 3);
	app.map.MINI = "rotated-mini-test";
	await app.usage("minimax-cn");
	assert.equal(app.requests.length, 4);
	assert.equal(app.requests[3].auth, "Bearer rotated-mini-test");
});

test("a provider error is retried and cannot expose the upstream body or previous quota", async () => {
	const app = boot();
	await app.usage("opencode-go");
	app.fail(true);
	const response = await app.usage("minimax-cn");
	assert.equal(response.status, 502);
	assert.equal(response.body.requested, "minimax-cn");
	assert.equal(response.body.usage, undefined);
	assert.match(response.body.error, /401/);
	assert.ok(!response.raw.includes("private upstream"));
	app.fail(false);
	assert.equal((await app.usage("minimax-cn")).body.kind, "quota");
});

test("MiniMax matches the current model rather than taking the first quota row", () => {
	const row = miniPayload.model_remains[0];
	const result = normalizeMiniMax({ model_remains: [{ ...row, model_name: "other", current_interval_remaining_percent: 1 }, row] }, "minimax-m2.5");
	assert.equal(result.usage.rolling.percent, 25);
	assert.equal(result.usage.rolling.resetsAt, new Date(row.end_time).toISOString());
	assert.equal(result.usage.weekly.resetsAt, null);
	assert.equal(normalizeMiniMax({ model_remains: [row, { ...row, model_name: "other" }] }, "unknown").reason, "model-unsupported");
	for (const value of [null, "", -1, 101]) {
		assert.throws(() => normalizeMiniMax({ model_remains: [{ model_name: "test", current_interval_remaining_percent: value }] }, "test"));
	}
	assert.equal(normalizeMiniMax({ ...miniPayload, base_resp: { status_code: "0" } }, "MiniMax-M2.5").kind, "quota");
	assert.throws(() => normalizeMiniMax({ base_resp: { status_code: 1004 } }, "test"), /1004/);
});

test("DeepSeek account uses the native account service and preserves wallet currencies", async () => {
	const harness = makeCtx({ services: { deepseekAccount: {
		async getBalance(client) {
			assert.equal(client.locale, "zh");
			return { status: "ready", value: [{ currency: "CNY", balance: "1.25" }], bonusWallets: [{ currency: "CNY", balance: "2.5" }, { currency: "USD", balance: "4" }] };
		}
	} } });
	const read = createProviderUsage(harness.ctx, { providers: () => ({}), accountClient: () => ({ version: "", locale: "zh", timezoneOffsetSeconds: 28800 }) });
	assert.deepEqual((await read("deepseek-account", "deepseek")).balances, [{ currency: "CNY", amount: 3.75 }, { currency: "USD", amount: 4 }]);
	harness.services.deepseekAccount.getBalance = async () => null;
	assert.equal((await read("deepseek-account", "deepseek")).reason, "sign-in-required");
});

test("provider request rejects an empty provider", async () => {
	const app = boot();
	assert.equal((await app.usage("")).status, 400);
	assert.equal(app.requests.length, 0);
});
