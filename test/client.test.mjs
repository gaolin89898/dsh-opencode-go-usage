// Client-bundle contract: module-loader id, Plugins-panel registration key,
// the view boundary, and the exported components. The bundle is a plain
// factory, so a small window/react stub can load it without a browser.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { loadHost } from "./support/harness.mjs";

const host = await loadHost();
const pkg = JSON.parse(readFileSync(path.resolve("package.json"), "utf8"));

// ── browser shell stubs ────────────────────────────────────────────────────
const styleTags = [];
globalThis.document = {
	querySelector: () => null,
	createElement: () => ({ dataset: {}, textContent: "" }),
	head: { appendChild: (tag) => styleTags.push(tag) }
};

let captured = null;
globalThis.window = {
	__ModuleLoader__: {
		load: (entry) => { captured = entry; }
	}
};

/** Minimal hook implementation: enough to construct elements, no effects. */
function installHooks() {
	const states = [];
	let cursor = 0;
	return {
		useState(initial) {
			const index = cursor++;
			if (!(index in states)) states[index] = typeof initial === "function" ? initial() : initial;
			return [states[index], (next) => { states[index] = typeof next === "function" ? next(states[index]) : next; }];
		},
		useEffect() {},
		useRef(initial) { return { current: initial }; },
		useCallback(fn) { return fn; },
		useSyncExternalStore(_subscribe, snapshot) { return snapshot(); },
		Fragment: Symbol("Fragment")
	};
}

const react = installHooks();
const jsxRuntime = {
	jsx: (type, props, key) => ({ type, props: props ?? {}, key }),
	jsxs: (type, props, key) => ({ type, props: props ?? {}, key }),
	Fragment: react.Fragment
};

const code = readFileSync(path.resolve("lib/client.js"), "utf8");
const factory = new Function("window", "document", "require", code);
factory(globalThis.window, globalThis.document, (specifier) => {
	if (specifier === "react") return react;
	if (specifier === "react/jsx-runtime") return jsxRuntime;
	throw new Error(`unexpected require in client bundle: ${specifier}`);
});

test("the bundle registers under the package name", () => {
	assert.ok(captured !== null, "window.__ModuleLoader__.load was called");
	assert.equal(captured.id, pkg.name);
	assert.equal(typeof captured.factory, "function");
	assert.equal(host.name, pkg.name);
	const patch = readFileSync(path.resolve("cordis.patch.yml"), "utf8");
	assert.ok(patch.includes(`name: "${pkg.name}"`), "the profile can resolve the renamed package");
	assert.ok(patch.includes(`id: ${host.namespace}`), "existing settings overrides retain their entry id");
});

test("apply registers the sidebar widget and the Plugins-panel config page", () => {
	const registrations = [];
	const ctx = {
		effect: (fn) => { fn(); return () => {}; },
		locale: { register: () => () => {} },
		slots: {
			inject: (_name, callback) => { callback(); },
			register: (options, component) => {
				registrations.push({ options, component });
				return () => {};
			}
		}
	};
	const exports = captured.factory((specifier) => {
		if (specifier === "react") return react;
		if (specifier === "react/jsx-runtime") return jsxRuntime;
		throw new Error(specifier);
	});
	exports.apply(ctx);

	const widget = registrations.find((entry) => entry.options.name === "sidebar.footer.action");
	assert.ok(widget !== undefined, "sidebar.footer.action registered");
	assert.equal(widget.options.id, pkg.name);

	const config = registrations.find((entry) => entry.options.name === "plugins.bundle.config");
	assert.ok(config !== undefined, "plugins.bundle.config registered");
	assert.equal(config.options.key, pkg.name, "the config cell is keyed by the package name");
	assert.equal(config.options.locale, "dsh-opencode-go-usage");
});

test("summary view is a plain string; page view mounts the settings page", () => {
	const exports = captured.factory((specifier) => {
		if (specifier === "react") return react;
		if (specifier === "react/jsx-runtime") return jsxRuntime;
		throw new Error(specifier);
	});
	const summary = exports.BundleConfig({ view: "summary" });
	assert.equal(typeof summary, "string");
	assert.ok(summary.length > 0);

	const page = exports.BundleConfig({ view: "page" });
	assert.ok(page !== null && typeof page === "object", "page view returns an element");
	assert.equal(page.type, exports.SettingsPage);
});

test("top-level bundle code does not collide with another plugin's globals", () => {
	// The shell evaluates every client bundle as a classic script in one shared
	// global lexical scope. literature-search (and others) declare a top-level
	// `PACKAGE_NAME`; our bundle must keep its own names factory-local or it
	// makes the whole web boot fail with "Identifier has already been declared".
	const context = vm.createContext({
		window: { __ModuleLoader__: { load() {} } }
	});
	vm.runInContext('var PACKAGE_NAME = "@astervolans/dsh-literature-search"; var CONFIG_KEY = PACKAGE_NAME;', context);
	const code = readFileSync(path.resolve("lib/client.js"), "utf8");
	assert.doesNotThrow(
		() => vm.runInContext(code, context),
		"client bundle must not declare top-level lexical identifiers"
	);
});

test("host and client agree on the quotaSource values", () => {
	const text = readFileSync(path.resolve("lib/client.js"), "utf8");
	for (const source of host.QUOTA_SOURCES) {
		assert.ok(text.includes(`"${source}"`), `client mentions ${source}`);
	}
	assert.ok(text.includes("/opencode-go/settings"), "client calls the settings route");
	assert.ok(text.includes("plugins.bundle.config"), "client uses the official config slot");
});

function renderWidget({ data = null, error = null, wide = true, selection } = {}) {
	let cursor = 0;
	const values = [data, error, 0, false, data ? Date.now() : null];
	const hooks = { ...installHooks(), useState: () => [values[cursor++], () => {}] };
	const client = captured.factory((specifier) => specifier === "react" ? hooks : jsxRuntime);
	const elements = [];
	const visit = (element) => {
		if (element === null || element === undefined || element === false) return;
		if (Array.isArray(element)) return element.forEach(visit);
		if (typeof element !== "object") { elements.push(element); return; }
		if (typeof element.type === "function") return visit(element.type(element.props));
		elements.push(element);
		visit(element.props.children);
	};
	visit(client.Widget({ wide, selection, t: (key, params) => key + (params ? JSON.stringify(params) : "") }));
	return {
		elements,
		find: (className) => elements.filter((el) => el?.props?.className?.split(" ").includes(className)),
		text: elements.filter((el) => typeof el !== "object").join(" ")
	};
}

function widgetData({ monthly = 63, resetsAt = new Date(Date.now() + 10 * 86400e3).toISOString(), ...extra } = {}) {
	return {
		usage: {
			monthly: { percent: monthly, status: "ok", resetsAt },
			rolling: { percent: 0, status: "ok", resetsAt: new Date(Date.now() + 5 * 3600e3).toISOString() },
			weekly: { percent: 8, status: "ok", resetsAt: new Date(Date.now() + 6 * 86400e3).toISOString() }
		},
		source: "opencode-go", account: { name: "astervolans" }, ...extra
	};
}

test("widget promotes monthly quota and renders one accessible meter per window", () => {
	const view = renderWidget({ data: widgetData() });
	assert.equal(view.find("ocg-monthly-value")[0].props.children, "63%");
	assert.equal(view.find("ocg-row").length, 2);
	assert.equal(view.find("ocg-meter").length, 3);
	assert.equal(view.find("ocg-marker").length, 3);
	assert.equal(view.find("ocg-timetrack").length, 0);
	assert.ok(view.find("ocg-meter").every((el) => el.props.role === "progressbar"));
	assert.equal(view.find("ocg-refresh")[0].props["aria-label"], "refresh");
});

test("unknown reset times hide time markers and pace without hiding quota", () => {
	for (const resetsAt of ["invalid", null, ""]) {
		const view = renderWidget({ data: widgetData({ resetsAt }) });
		assert.equal(view.find("ocg-monthly-value")[0].props.children, "63%");
		assert.equal(view.find("ocg-time").length, 0);
		assert.equal(view.find("ocg-pace").length, 0);
		assert.equal(view.find("ocg-marker").length, 2);
		assert.equal(view.find("ocg-countdown")[0].props.children, "");
	}
});

test("pace compares quota with elapsed time and tolerates small estimated differences", () => {
	const resetsAt = new Date(Date.now() + 15 * 86400e3).toISOString();
	for (const [monthly, pace] of [[52, "synced"], [75, "ahead"], [20, "behind"]]) {
		const view = renderWidget({ data: widgetData({ monthly, resetsAt }) });
		assert.equal(view.find("ocg-pace")[0].props["data-pace"], pace);
	}
});

test("quota above 100 stays visible while its meter clamps at 100", () => {
	const view = renderWidget({ data: widgetData({ monthly: 120 }) });
	assert.equal(view.find("ocg-monthly-value")[0].props.children, "120%");
	assert.equal(view.find("ocg-monthly-value")[0].props["data-level"], "error");
	assert.equal(view.find("ocg-meter")[0].props["aria-valuenow"], 100);
	assert.equal(view.find("ocg-fill")[0].props.style.width, "100%");
});

test("loading and failure states offer status and retry without false zeroes", () => {
	const loading = renderWidget();
	assert.equal(loading.find("ocg-skeleton").length, 1);
	assert.equal(loading.find("ocg-monthly-value").length, 0);
	const failed = renderWidget({ data: widgetData(), error: "gateway 502" });
	assert.equal(failed.find("ocg-error")[0].props.role, "alert");
	assert.equal(failed.find("ocg-retry").length, 1);
	assert.equal(failed.find("ocg-meter").length, 0);
	assert.ok(failed.text.includes("gateway 502"));
});

test("fallback and update information fit in dedicated header and footer positions", () => {
	const view = renderWidget({ data: widgetData({
		source: "builtin", fallback: { from: "opencode-go", reason: "not-installed" },
		update: { available: true, latest: "1.7.1" }
	}) });
	assert.equal(view.find("ocg-fallback").length, 1);
	assert.equal(view.find("ocg-source")[0].props.children, "widget.source.builtin");
	assert.equal(view.find("ocg-update")[0].props.children, "v1.7.1");
	assert.equal(view.find("ocg-update")[0].props.href, "https://github.com/gaolin89898/dsh-usage-meter/releases/latest");
	const explicit = renderWidget({ data: widgetData({ source: "builtin", fallback: null }) });
	assert.equal(explicit.find("ocg-fallback").length, 0);
});

test("collapsed sidebar keeps account context in its tooltip and exposes errors", () => {
	const view = renderWidget({ data: widgetData(), wide: false });
	assert.equal(view.find("ocg-widget").length, 0);
	assert.equal(view.find("ocg-rail-value")[0].props.children, "63%");
	assert.ok(view.find("ocg-rail")[0].props.title.includes("astervolans"));
	const failed = renderWidget({ error: "offline", wide: false });
	assert.equal(failed.find("ocg-rail-value")[0].props.children, "!");
});

test("monetary balances and unsupported providers do not render GO quota", () => {
	const view = renderWidget({ data: { kind: "balance", provider: { id: "deepseek", name: "DeepSeek" }, balances: [{ amount: 0, currency: "CNY" }, { amount: -1.25, currency: "USD" }] } });
	assert.equal(view.find("ocg-name")[0].props.children, "DeepSeek");
	assert.notEqual(view.find("ocg-brandmark")[0].props.children, "GO");
	assert.equal(view.find("ocg-balance-value").length, 2);
	assert.equal(view.find("ocg-balance-value")[1].props["data-level"], "error");
	assert.equal(view.find("ocg-meter").length, 0);
	assert.equal(view.find("ocg-skeleton").length, 0);
	const unsupported = renderWidget({ data: { kind: "unavailable", reason: "unsupported", provider: { name: "Custom" } } });
	assert.equal(unsupported.find("ocg-state-title")[0].props.children, "widget.unsupported");
	assert.equal(unsupported.find("ocg-skeleton").length, 0);
	assert.equal(renderWidget({ selection: null }).find("ocg-state-title")[0].props.children, "widget.no-selection");
});

test("MiniMax displays only available windows and identifies the provider in the rail", () => {
	const data = { kind: "quota", provider: { id: "minimax-cn", name: "MiniMax" }, usage: { rolling: { percent: 25 }, weekly: { percent: 10 } } };
	const view = renderWidget({ data });
	assert.equal(view.find("ocg-monthly-value")[0].props.children, "25%");
	assert.equal(view.find("ocg-monthly-label")[0].props.children, "window.rolling");
	assert.equal(view.find("ocg-row").length, 1);
	assert.equal(view.find("ocg-meter").length, 2);
	assert.equal(view.find("ocg-pace").length, 0);
	const rail = renderWidget({ data, selection: { provider: "minimax-cn", name: "MiniMax" }, wide: false });
	assert.match(rail.find("ocg-rail")[0].props.title, /MiniMax/);
	assert.ok(!rail.text.includes("GO"));
});

function snapshotStore(initial) {
	let value = initial;
	const listeners = new Set();
	return {
		getSnapshot: () => value,
		subscribe: (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
		set(next) { value = next; listeners.forEach((fn) => fn()); },
		listeners
	};
}

test("selection subscription follows accepted models and the main session, then disposes", () => {
	const client = captured.factory((specifier) => specifier === "react" ? installHooks() : jsxRuntime);
	const list = snapshotStore({ byId: { a: { id: "a", retainedBy: { mainView: 1 } }, b: { id: "b", retainedBy: {} } } });
	const directory = (provider, model) => ({ store: snapshotStore({ current: { provider, model }, groups: [{ id: provider, name: provider }] }), load: async () => {} });
	const directories = { a: directory("opencode-go", "go-model"), b: directory("deepseek", "ds-model") };
	const store = client.createSelectionStore();
	const dispose = store.connect({ sessions: { list }, modelDirectories: { directoryFor: (id) => directories[id] } });
	assert.equal(store.getSnapshot().provider, "opencode-go");
	directories.a.store.set({ current: { provider: "opencode-go", model: "go-model" }, pending: { provider: "minimax-cn", model: "mini" } });
	assert.equal(store.getSnapshot().provider, "opencode-go");
	directories.a.store.set({ current: { provider: "minimax-cn", model: "mini" } });
	assert.equal(store.getSnapshot().provider, "minimax-cn");
	list.set({ byId: { a: { id: "a", retainedBy: {} }, b: { id: "b", retainedBy: { mainView: 1 } } } });
	assert.equal(store.getSnapshot().provider, "deepseek");
	assert.equal(directories.a.store.listeners.size, 0);
	directories.a.store.set({ current: { provider: "old", model: "old" } });
	assert.equal(store.getSnapshot().provider, "deepseek");
	list.set({ byId: {} });
	assert.equal(store.getSnapshot(), null);
	dispose();
	assert.equal(list.listeners.size, 0);
	assert.equal(directories.b.store.listeners.size, 0);
});

test("registered widget remounts for provider, model and session switches", () => {
	const hooks = installHooks();
	const client = captured.factory((specifier) => specifier === "react" ? hooks : jsxRuntime);
	const list = snapshotStore({ byId: { a: { id: "a", retainedBy: { mainView: 1 } } } });
	const modelStore = snapshotStore({ current: { provider: "opencode-go", model: "one" } });
	let widget;
	client.apply({
		sessions: { list }, modelDirectories: { directoryFor: () => ({ store: modelStore, load: async () => {} }) },
		effect: (fn) => fn(), locale: { register: () => () => {} },
		slots: { register: (options, component) => { if (options.name === "sidebar.footer.action") widget = component; return () => {}; } }
	});
	const original = widget({ wide: true });
	modelStore.set({ current: { provider: "minimax-cn", model: "one" } });
	const provider = widget({ wide: true });
	assert.notEqual(original.key, provider.key);
	modelStore.set({ current: { provider: "minimax-cn", model: "two" } });
	const model = widget({ wide: true });
	assert.notEqual(model.key, provider.key);
	list.set({ byId: { b: { id: "b", retainedBy: { mainView: 1 } } } });
	assert.notEqual(widget({ wide: true }).key, model.key);
});
