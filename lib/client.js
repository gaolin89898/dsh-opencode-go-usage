// dsh-opencode-go-usage — browser half.
//
// Hand-authored client bundle in the DSH module-loader factory format:
// `window.__ModuleLoader__.load({ id, factory })`. The factory receives the
// module-table `require`, so only shell-externalized modules may be imported
// (react / react/jsx-runtime are in the static table). It registers a widget
// into the sidebar's `sidebar.footer.action` list slot and polls the
// same-origin proxy route owned by the host half — the GO API key never
// enters the browser. UI strings are bilingual via the DSH locale service
// (dictionaries registered under the `dsh-opencode-go-usage` namespace).
/**
 * This bundle's npm name is also the module-loader row id and the exact key of
 * the `plugins.bundle.config` cell below (the Plugins panel addresses a
 * bundle's configuration page by package name). Keep it equal to
 * `package.json#name`.
 *
 * It is declared INSIDE the factory on purpose: the shell evaluates every
 * client bundle as a classic script in one shared global lexical scope, so a
 * top-level `const PACKAGE_NAME` collides with any other plugin declaring the
 * same name (for example `@astervolans/dsh-literature-search`), failing the
 * whole web boot.
 */
window.__ModuleLoader__.load({
	id: "@astervolans/dsh-opencode-go-usage",
	factory: (require) => {
		// Kept factory-local (see the comment above): no top-level declaration
		// in this file may enter the shell's shared global lexical scope.
		const PACKAGE_NAME = "@astervolans/dsh-opencode-go-usage";
		const CONFIG_KEY = PACKAGE_NAME;
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");

		// ── styles (injected once, same pattern as built-in client plugins) ──
		const CSS_ID = "dsh-opencode-go-usage/widget.css";
		if (typeof document !== "undefined") {
			const existingTag = document.querySelector("style[data-plugin-css=\"" + CSS_ID + "\"]");
			const tag = existingTag || document.createElement("style");
			tag.dataset.plugin = "dsh-opencode-go-usage";
			tag.dataset.pluginCss = CSS_ID;
			tag.textContent = [
				".ocg-widget,.ocg-rail{--ocg-text:var(--dsw-alias-label-primary,#121620);--ocg-secondary:var(--dsw-alias-label-secondary,#6b7484);--ocg-muted:var(--dsw-alias-label-tertiary,color-mix(in srgb,var(--ocg-secondary) 82%,var(--dsw-alias-bg-layer-1,#fff)));--ocg-border:var(--dsw-alias-border-l2,#e1e5ec);--ocg-success:var(--dsw-alias-state-success-primary,#09a879);--ocg-warn:var(--dsw-alias-state-warn-primary,#a96912);--ocg-error:var(--dsw-alias-state-error-primary,#d94242);--ocg-accent:var(--dsw-static-deepseek-450,#5686fe);font-family:Inter,'Noto Sans SC',system-ui,sans-serif;letter-spacing:0;font-variant-numeric:tabular-nums;color:var(--ocg-text)}",
				".ocg-widget{box-sizing:border-box;width:100%;min-width:0;padding:14px;display:flex;flex-direction:column;gap:12px;border:1px solid var(--ocg-border);border-radius:12px;background:var(--dsw-alias-bg-layer-1,transparent);font-size:11px;line-height:1.4;container-type:inline-size}",
				".ocg-widget *{box-sizing:border-box;letter-spacing:0}",
				".ocg-head,.ocg-headleft,.ocg-actions,.ocg-label-row,.ocg-value-row,.ocg-footer{display:flex;align-items:center;gap:7px;min-width:0}",
				".ocg-head,.ocg-label-row,.ocg-value-row,.ocg-footer{justify-content:space-between}",
				".ocg-head{min-height:20px;gap:6px}",
				".ocg-headleft{flex:1;overflow:hidden}",
				".ocg-brandmark{width:16px;height:16px;flex:none;display:grid;place-items:center;border:1px solid var(--ocg-brand-border,transparent);border-radius:5px;background:var(--ocg-brand-color,var(--ocg-accent));color:#fff;font-size:7px;font-weight:700;line-height:1}.ocg-brand-icon{display:block;width:12px;height:12px;flex:none}",
				".ocg-name{font-size:12px;font-weight:600;white-space:nowrap;min-width:0;overflow:hidden;text-overflow:ellipsis}",
				".ocg-account,.ocg-chip{padding:1px 5px;border-radius:5px;background:var(--dsw-alias-interactive-bg-hover,#edf0f5);color:var(--ocg-muted);font-size:9px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ocg-chip{max-width:45%;flex:0 1 auto}.ocg-headleft>.ocg-name{flex:0 1 auto}",
				".ocg-actions{gap:5px;flex:none}",
				".ocg-fallback{padding:1px 5px;border-radius:4px;font-size:9px;font-weight:600;color:var(--ocg-warn);background:color-mix(in srgb,var(--ocg-warn) 12%,transparent);white-space:nowrap}",
				".ocg-refresh{width:20px;height:20px;flex:none;display:grid;place-items:center;border:0;border-radius:6px;background:var(--dsw-alias-interactive-bg-hover,#edf0f5);padding:0;color:var(--ocg-secondary);cursor:pointer}",
				".ocg-refresh svg{width:11px;height:11px}",
				".ocg-refresh:hover,.ocg-refresh:focus-visible{color:var(--ocg-text);background:color-mix(in srgb,var(--ocg-muted) 18%,transparent)}",
				".ocg-refresh:focus-visible,.ocg-retry:focus-visible,.ocg-update:focus-visible,.ocg-rail:focus-visible{outline:2px solid var(--ocg-accent);outline-offset:3px}",
				".ocg-refresh:disabled{cursor:wait;opacity:.6}.ocg-refresh:disabled svg{animation:ocg-spin 1s linear infinite}",
				".ocg-monthly{display:flex;flex-direction:column;gap:7px;min-width:0}",
				".ocg-monthly-label{font-size:10.5px;font-weight:600;color:var(--ocg-secondary)}.ocg-primary-label{display:flex;align-items:center;gap:5px;min-width:0}.ocg-primary-label .ocg-chip{flex:none;max-width:none}",
				".ocg-countdown{font-size:9.5px;color:var(--ocg-muted);text-align:right;overflow-wrap:anywhere}",
				".ocg-monthly-value{font-size:28px;font-weight:600;line-height:1.1;color:var(--ocg-text)}",
				".ocg-monthly-value[data-level=warn],.ocg-row-percent[data-level=warn]{color:var(--ocg-warn)}",
				".ocg-monthly-value[data-level=error],.ocg-row-percent[data-level=error]{color:var(--ocg-error)}",
				".ocg-pace{max-width:58%;padding:2px 7px;border-radius:6px;font-size:9px;font-weight:600;color:var(--ocg-secondary);background:color-mix(in srgb,var(--ocg-secondary) 12%,transparent);text-align:right;overflow-wrap:anywhere}",
				".ocg-pace[data-pace=ahead]{color:var(--ocg-warn);background:color-mix(in srgb,var(--ocg-warn) 12%,transparent)}",
				".ocg-pace[data-pace=behind]{color:var(--ocg-success);background:color-mix(in srgb,var(--ocg-success) 12%,transparent)}",
				".ocg-pace[data-level=error]{color:var(--ocg-error);background:color-mix(in srgb,var(--ocg-error) 12%,transparent)}",
				".ocg-meter{position:relative;height:14px;flex:none;min-width:0;display:flex;align-items:center}",
				".ocg-meter-large{height:16px}",
				".ocg-track{width:100%;height:6px;border-radius:3px;background:var(--ocg-border);overflow:hidden}",
				".ocg-meter-large .ocg-track{height:8px;border-radius:4px}",
				".ocg-fill{height:100%;border-radius:inherit;background:var(--ocg-usage-color);transition:width .3s ease}",
				".ocg-marker{position:absolute;top:0;bottom:0;width:2px;border-radius:1px;background:var(--ocg-text);box-shadow:0 0 0 1px var(--dsw-alias-bg-layer-1,Canvas)}",
				".ocg-time{display:flex;align-items:center;gap:5px;min-height:14px;font-size:9.5px;color:var(--ocg-muted)}",
				".ocg-time::before{content:'';width:2px;height:8px;border-radius:1px;background:var(--ocg-text);flex:none}",
				".ocg-windows{padding-top:12px;border-top:1px solid var(--ocg-border);display:flex;flex-direction:column;gap:12px;min-width:0}",
				".ocg-row{display:flex;flex-direction:column;gap:6px;min-width:0}",
				".ocg-row-label{display:flex;align-items:center;gap:6px;min-width:0;font-size:11px;font-weight:500}",
				".ocg-window-hint{padding:1px 4px;border-radius:4px;background:var(--dsw-alias-interactive-bg-hover,#edf0f5);color:var(--ocg-muted);font-size:9px;font-weight:400}",
				".ocg-row-values{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0}",
				".ocg-row-percent{min-width:32px;text-align:right;font-size:11px;font-weight:600;flex:none}",
				".ocg-footer{min-height:15px;font-size:9.5px;color:var(--ocg-muted);flex-wrap:wrap;gap:4px 8px}",
				".ocg-source{display:flex;align-items:center;gap:5px;min-width:0;overflow-wrap:anywhere;font-size:9px}",
				".ocg-source::before{content:'';width:4px;height:4px;border-radius:50%;background:var(--ocg-success);flex:none}",
				".ocg-source[data-fallback=true]::before{background:var(--ocg-warn)}",
				".ocg-follow{display:flex;align-items:center;gap:4px;font-size:9px;min-width:0}.ocg-follow svg{width:9px;height:9px;flex:none}",
				".ocg-update{padding:1px 5px;border-radius:4px;color:var(--ocg-accent);background:color-mix(in srgb,var(--ocg-accent) 10%,transparent);font-size:9px;text-decoration:none;overflow-wrap:anywhere}",
				".ocg-update:hover{text-decoration:underline}",
				".ocg-error,.ocg-unavailable{display:flex;align-items:flex-start;gap:8px;min-width:0;padding:2px 0}.ocg-state-icon{width:13px;height:13px;flex:none;margin-top:2px;color:var(--ocg-muted)}.ocg-state-icon svg{display:block;width:100%;height:100%}.ocg-error>.ocg-state-icon{color:var(--ocg-error)}.ocg-state-text{display:flex;flex:1;flex-direction:column;gap:3px;min-width:0}.ocg-state-title{font-size:11.5px;font-weight:500;line-height:1.5;overflow-wrap:anywhere}",
				".ocg-error-heading{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--ocg-error);font-size:11.5px;font-weight:600}",
				".ocg-error-detail{margin:0;color:var(--ocg-muted);font-size:9.5px;line-height:1.6;overflow-wrap:anywhere;max-height:80px;overflow:auto}",
				".ocg-retry{border:0;border-radius:5px;padding:4px 10px;flex:none;background:var(--dsw-alias-interactive-bg-hover,#edf0f5);color:var(--ocg-text);font:inherit;font-size:9.5px;cursor:pointer}",
				".ocg-balance{display:flex;flex-direction:column;gap:5px;min-width:0}.ocg-balance-note{font-size:9px;color:var(--ocg-muted);text-align:right;overflow-wrap:anywhere}.ocg-balance-row{display:flex;align-items:baseline;gap:8px;min-width:0}.ocg-currency{flex:none;color:var(--ocg-muted);font-size:10px;line-height:1.5}.ocg-balance-value{font-size:28px;font-weight:600;line-height:1.15;min-width:0;overflow-wrap:anywhere}.ocg-balance[data-multiple=true] .ocg-balance-value{font-size:21px}.ocg-balance-value[data-level=error]{color:var(--ocg-error)}",
				".ocg-skeleton{display:flex;flex-direction:column;gap:12px;padding:4px 0}",
				".ocg-skeleton span{display:block;height:8px;border-radius:3px;background:var(--ocg-border);animation:ocg-pulse 1.5s ease-in-out infinite}",
				".ocg-skeleton .ocg-skeleton-value{height:28px;width:28%}.ocg-skeleton .ocg-skeleton-label{height:10px;width:35%}.ocg-skeleton .ocg-skeleton-gap{margin-top:12px}",
				".ocg-rail{box-sizing:border-box;width:40px;height:44px;display:flex;flex-direction:column;gap:1px;align-items:center;justify-content:center;border:1px solid var(--ocg-border);border-radius:9px;padding:2px;background:var(--dsw-alias-bg-layer-1,transparent);cursor:pointer}",
				".ocg-rail-brand{display:grid;place-items:center;min-height:12px;font-size:8px;font-weight:700;line-height:12px;color:var(--ocg-brand-rail-color,var(--ocg-muted))}.ocg-rail-value{max-width:100%;font-size:10px;font-weight:600;line-height:13px;white-space:nowrap}",
				".ocg-rail:hover{background:var(--dsw-alias-interactive-bg-hover,#edf0f5)}",
				"@container (max-width:220px){.ocg-account{display:none}.ocg-headleft>.ocg-chip{max-width:36%}.ocg-label-row{flex-wrap:wrap;gap:3px}.ocg-row-values{margin-left:auto}.ocg-monthly-label{flex:1}.ocg-row>.ocg-label-row>.ocg-row-label{flex:1}.ocg-balance-note{margin-left:auto}}",
				"@keyframes ocg-spin{to{transform:rotate(360deg)}}@keyframes ocg-pulse{50%{opacity:.4}}",
				"@media(prefers-reduced-motion:reduce){.ocg-widget *{animation:none!important;transition:none!important}}"
			].join("");
			if (!existingTag) document.head.appendChild(tag);
		}

		// ── locale dictionaries ──
		const NS = "dsh-opencode-go-usage";
		const zh = {
			"window.rolling": "滚动窗口",
			"window.weekly": "周窗口",
			"window.monthly": "月窗口",
			"window.rolling.hint": "5h",
			"time.soon": "即将重置",
			"time.minutes": "{n}分",
			"time.hours": "{n}小时{m}分",
			"time.days": "{n}天{m}小时",
			"time.elapsed.title": "本窗口时间进度:已流逝 {pct}%,剩余 {rest}%",
			"time.progress": "时间进度 {pct}%",
			"time.estimate": "月窗口按 30 天估算;已流逝 {pct}%,剩余 {rest}%",
			"time.reset": "{time}后重置",
			"pace.synced": "与时间同步",
			"pace.ahead": "快于时间 {pct}%",
			"pace.behind": "慢于时间 {pct}%",
			"updated.now": "刚刚更新",
			"updated.minutes": "更新于 {n} 分钟前",
			"updated.hours": "更新于 {n} 小时前",
			"widget.monthly": "本月额度",
			"widget.balance": "可用余额",
			"widget.balance.live": "实时余额",
			"widget.balance.account": "充值 + 赠送合计",
			"widget.balance.openrouter": "总充值 - 已用",
			"widget.account.kind": "账号",
			"widget.follow": "跟随当前会话",
			"widget.provider": "服务额度",
			"widget.no-selection": "未选择服务",
			"widget.unsupported": "该服务暂不支持余额查询",
			"widget.model-unsupported": "当前模型暂无额度数据",
			"widget.missing-credential": "未配置此服务的凭据",
			"widget.sign-in-required": "请先登录此服务",
			"widget.error": "读取额度失败",
			"widget.invalid": "额度数据不完整,请重试。",
			"widget.retry": "重试",
			"widget.source.builtin": "DSH 内置",
			"widget.refreshing": "正在读取额度…",
			"refresh": "刷新",
			"loading": "加载中…",
			"rail.title": "OpenCode GO 月用量 {pct}%",
			"rail.plain": "OpenCode GO",
			"rail.error": "OpenCode GO: {error}",
			"rail.account": "OpenCode GO · {name}",
			"rail.title.account": "OpenCode GO · {name} 月用量 {pct}%",
			"widget.brand": "OpenCode GO",
			"widget.account.title": "当前账号:{name}",
			"widget.fallback": "内置",
			"widget.fallback.title": "实际来源:{source};请求来源:{requested};回退原因:{reason}{message}",
			"source.opencode-go": "dsh-opencode-go 当前账号",
			"source.builtin": "DSH 内置提供商",
			"reason.not-installed": "未安装 dsh-opencode-go",
			"reason.entry-disabled": "dsh-opencode-go 已禁用",
			"reason.service-unavailable": "宿主服务不可用",
			"reason.read-failed": "读取额度失败",
			"reason.invalid-response": "额度数据不合法",
			"reason.unknown": "未知原因",
			"update.available": "新版本 v{v}",
			"update.title": "点击查看升级说明",

			// settings page (Plugins panel)
			"cfg.summary": "OpenCode GO 额度来源:优先 dsh-opencode-go 当前账号(失败时自动回退到 DSH 内置提供商),或固定使用内置提供商。",
			"cfg.title": "额度来源 (quotaSource)",
			"cfg.lead": "侧边栏 widget 与 /opencode-go 命令读取额度时使用的来源。保存后立即生效,无需重启。",
			"cfg.loading": "正在加载额度来源设置…",
			"cfg.save": "保存",
			"cfg.saving": "保存中…",
			"cfg.reload": "重新加载",
			"cfg.reloading": "加载中…",
			"cfg.reloaded": "已重新加载。",
			"cfg.retry": "重试",
			"cfg.saved": "已保存,额度来源已更新。",
			"cfg.noChanges": "没有需要保存的更改。",
			"cfg.unsaved": "未保存",
			"cfg.conflict": "保存冲突:设置已被其他会话修改,请点击「重新加载」后再保存。",
			"cfg.saveFailed": "保存失败:{error}",
			"cfg.loadFailed": "加载设置失败:{error}",
			"cfg.unsupported": "宿主未提供设置描述符(503)。请确认插件以 profile 条目安装,且 schemastery 版本 ≥ 3.18.4。",
			"cfg.revision": "revision {n}",
			"cfg.option.opencode-go": "优先 dsh-opencode-go(当前账号)",
			"cfg.option.opencode-go.desc": "读取 dsh-opencode-go 插件当前生效账号的额度;未安装、被禁用或出错时自动回退到 DSH 内置提供商,并在 widget 上标注。",
			"cfg.option.builtin": "DSH 内置提供商",
			"cfg.option.builtin.desc": "始终使用 baseUrl + /v1/usage(凭据 apiKeyEnv),与 1.5.0 行为一致。",
			"cfg.status.title": "当前状态",
			"cfg.status.mode": "请求来源",
			"cfg.status.effective": "生效来源",
			"cfg.status.package": "dsh-opencode-go",
			"cfg.status.entry": "loader 条目",
			"cfg.status.enabled": "启用状态",
			"cfg.status.service": "宿主服务 (opencodeGoUsage)",
			"cfg.status.compatible": "兼容性",
			"cfg.status.account": "当前账号",
			"cfg.status.fallback": "回退",
			"cfg.status.detected": "已检测到",
			"cfg.status.notDetected": "未检测到",
			"cfg.status.found": "已找到",
			"cfg.status.notFound": "未找到",
			"cfg.status.on": "已启用",
			"cfg.status.off": "已禁用",
			"cfg.status.available": "可用",
			"cfg.status.unavailable": "不可用",
			"cfg.status.compatibleYes": "兼容",
			"cfg.status.compatibleNo": "不兼容",
			"cfg.status.none": "无",
			"cfg.status.unknown": "—",
			"cfg.status.defaultAccount": "默认账号",
			"cfg.status.hint.missing": "未检测到 dsh-opencode-go:额度将使用 DSH 内置提供商。"
		};
		const en = {
			"window.rolling": "Rolling",
			"window.weekly": "Weekly",
			"window.monthly": "Monthly",
			"window.rolling.hint": "5h",
			"time.soon": "resets soon",
			"time.minutes": "{n}m",
			"time.hours": "{n}h{m}m",
			"time.days": "{n}d{m}h",
			"time.elapsed.title": "Window time: {pct}% elapsed, {rest}% left",
			"time.progress": "Time elapsed {pct}%",
			"time.estimate": "Monthly window estimated at 30 days; {pct}% elapsed, {rest}% left",
			"time.reset": "Resets in {time}",
			"pace.synced": "On pace",
			"pace.ahead": "{pct}% ahead of time",
			"pace.behind": "{pct}% behind time",
			"updated.now": "Updated just now",
			"updated.minutes": "Updated {n}m ago",
			"updated.hours": "Updated {n}h ago",
			"widget.monthly": "Monthly quota",
			"widget.balance": "Available balance",
			"widget.balance.live": "Live balance",
			"widget.balance.account": "Recharge + bonus",
			"widget.balance.openrouter": "Credits - usage",
			"widget.account.kind": "Account",
			"widget.follow": "Current session",
			"widget.provider": "Provider usage",
			"widget.no-selection": "No provider selected",
			"widget.unsupported": "Balance lookup unavailable for this provider",
			"widget.model-unsupported": "No quota data for this model",
			"widget.missing-credential": "No credential configured for this provider",
			"widget.sign-in-required": "Sign in to this provider",
			"widget.error": "Could not read quota",
			"widget.invalid": "Incomplete quota data. Try again.",
			"widget.retry": "Retry",
			"widget.source.builtin": "DSH built-in",
			"widget.refreshing": "Reading quota…",
			"refresh": "Refresh",
			"loading": "Loading…",
			"rail.title": "OpenCode GO monthly {pct}%",
			"rail.plain": "OpenCode GO",
			"rail.error": "OpenCode GO: {error}",
			"rail.account": "OpenCode GO · {name}",
			"rail.title.account": "OpenCode GO · {name} monthly {pct}%",
			"widget.brand": "OpenCode GO",
			"widget.account.title": "Active account: {name}",
			"widget.fallback": "Built-in",
			"widget.fallback.title": "Effective source: {source}; requested: {requested}; fallback reason: {reason}{message}",
			"source.opencode-go": "dsh-opencode-go current account",
			"source.builtin": "DSH built-in provider",
			"reason.not-installed": "dsh-opencode-go not installed",
			"reason.entry-disabled": "dsh-opencode-go disabled",
			"reason.service-unavailable": "host service unavailable",
			"reason.read-failed": "quota read failed",
			"reason.invalid-response": "invalid quota response",
			"reason.unknown": "unknown reason",
			"update.available": "v{v} available",
			"update.title": "Click for upgrade instructions",

			// settings page (Plugins panel)
			"cfg.summary": "OpenCode GO quota source: prefer the dsh-opencode-go current account (with automatic fallback to the DSH built-in provider), or always use the built-in provider.",
			"cfg.title": "Quota source (quotaSource)",
			"cfg.lead": "Source used by the sidebar widget and the /opencode-go command. Takes effect immediately on save; no restart needed.",
			"cfg.loading": "Loading quota source settings…",
			"cfg.save": "Save",
			"cfg.saving": "Saving…",
			"cfg.reload": "Reload",
			"cfg.reloading": "Loading…",
			"cfg.reloaded": "Reloaded.",
			"cfg.retry": "Retry",
			"cfg.saved": "Saved — the quota source has been updated.",
			"cfg.noChanges": "Nothing to save.",
			"cfg.unsaved": "unsaved",
			"cfg.conflict": "Save conflict: the settings were changed by another session. Click Reload, then save again.",
			"cfg.saveFailed": "Save failed: {error}",
			"cfg.loadFailed": "Failed to load settings: {error}",
			"cfg.unsupported": "The host exposes no settings descriptor (503). Make sure the plugin is installed as a profile entry and schemastery is ≥ 3.18.4.",
			"cfg.revision": "revision {n}",
			"cfg.option.opencode-go": "Prefer dsh-opencode-go (current account)",
			"cfg.option.opencode-go.desc": "Read the quota of the account dsh-opencode-go currently uses; when it is missing, disabled, or fails, fall back to the DSH built-in provider and label it in the widget.",
			"cfg.option.builtin": "DSH built-in provider",
			"cfg.option.builtin.desc": "Always use baseUrl + /v1/usage (credential apiKeyEnv) — the 1.5.0 behaviour.",
			"cfg.status.title": "Current status",
			"cfg.status.mode": "Requested source",
			"cfg.status.effective": "Effective source",
			"cfg.status.package": "dsh-opencode-go",
			"cfg.status.entry": "Loader entry",
			"cfg.status.enabled": "Enabled",
			"cfg.status.service": "Host service (opencodeGoUsage)",
			"cfg.status.compatible": "Compatibility",
			"cfg.status.account": "Active account",
			"cfg.status.fallback": "Fallback",
			"cfg.status.detected": "detected",
			"cfg.status.notDetected": "not detected",
			"cfg.status.found": "found",
			"cfg.status.notFound": "not found",
			"cfg.status.on": "enabled",
			"cfg.status.off": "disabled",
			"cfg.status.available": "available",
			"cfg.status.unavailable": "unavailable",
			"cfg.status.compatibleYes": "compatible",
			"cfg.status.compatibleNo": "incompatible",
			"cfg.status.none": "none",
			"cfg.status.unknown": "—",
			"cfg.status.defaultAccount": "default account",
			"cfg.status.hint.missing": "dsh-opencode-go was not detected: quota will come from the DSH built-in provider."
		};

		// ── data helpers ──
		/**
		 * The three plan windows. `windowMs` is the window LENGTH and is what the
		 * time-remaining bar is computed from; every entry must have one.
		 *
		 * - rolling: the 5 h window documented by the GO plan (matches the
		 *   `window.rolling.hint` label and observed `resetsAt` spacing).
		 * - weekly: anchored to Monday 00:00 UTC — observed `resetsAt` values are
		 *   exactly 7 d apart (e.g. 2026-09-21T00:00:00Z).
		 * - monthly: ~30 d. The monthly window is anchored to the subscription
		 *   day-of-month, so its real length alternates 30/31 d (or 28/29 d in
		 *   February). 30 d is therefore an approximation: the derived fraction is
		 *   clamped to [0,1], so the bar stays correct at the window boundaries and
		 *   is at most ~3 % off mid-window.
		 */
		const WINDOW_MS = { rolling: 5 * 3600e3, weekly: 7 * 86400e3, monthly: 30 * 86400e3 };
		const WINDOWS = [
			{ key: "rolling", labelKey: "window.rolling", hintKey: "window.rolling.hint", windowMs: WINDOW_MS.rolling },
			{ key: "weekly", labelKey: "window.weekly", hintKey: null, windowMs: WINDOW_MS.weekly },
			{ key: "monthly", labelKey: "window.monthly", hintKey: null, windowMs: WINDOW_MS.monthly }
		];

		/**
		 * Fraction of the window ALREADY elapsed, derived from its reset time:
		 * window start = resetsAt - windowMs. 0 = window just opened (empty bar),
		 * 1 = about to reset (full bar), so the bar grows left-to-right as the
		 * window is consumed. Correlate against the quota bar above it to see
		 * whether quota is burning faster or slower than the clock.
		 * @returns {number|null} null when the window length or reset time is unknown.
		 */
		function timeElapsedFraction(resetsAt, windowMs) {
			if (!resetsAt || !windowMs) return null;
			const reset = new Date(resetsAt).getTime();
			if (!Number.isFinite(reset)) return null;
			const elapsed = (windowMs - (reset - Date.now())) / windowMs;
			return Math.max(0, Math.min(1, elapsed));
		}

		/** Short human relative time until `iso`, localized. */
		function timeUntil(iso, t) {
			if (!iso) return "";
			const target = new Date(iso).getTime();
			if (!Number.isFinite(target)) return "";
			const diff = target - Date.now();
			if (diff <= 0) return t("time.soon");
			const mins = Math.floor(diff / 60000);
			if (mins < 60) return t("time.minutes", { n: mins });
			const hours = Math.floor(mins / 60);
			if (hours < 24) return t("time.hours", { n: hours, m: mins % 60 });
			return t("time.days", { n: Math.floor(hours / 24), m: hours % 24 });
		}

		/** Fill color by usage percent — themed alias tokens (light/dark safe). */
		function fillColor(percent) {
			if (percent >= 90) return "var(--ocg-error)";
			if (percent >= 70) return "var(--ocg-warn)";
			return "var(--ocg-success)";
		}

		function usageLevel(percent) {
			return percent >= 90 ? "error" : percent >= 70 ? "warn" : "normal";
		}

		function validWindow(win) {
			return win && typeof win.percent === "number" && Number.isFinite(win.percent);
		}

		function updatedLabel(at, t) {
			const minutes = Math.max(0, Math.floor((Date.now() - at) / 60000));
			if (minutes === 0) return t("updated.now");
			return minutes < 60 ? t("updated.minutes", { n: minutes }) : t("updated.hours", { n: Math.floor(minutes / 60) });
		}

		// Lucide RotateCw (ISC): https://lucide.dev/icons/rotate-cw.
		function RefreshIcon() {
			return react_jsx_runtime.jsxs("svg", {
				viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5,
				strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
				children: [
					react_jsx_runtime.jsx("path", { d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" }),
					react_jsx_runtime.jsx("path", { d: "M21 3v5h-5" })
				]
			});
		}

		// Lucide (ISC) paths, bundled locally for the shell's React-only module table.
		function StatusIcon({ name }) {
			const paths = {
				follow: ["m7 15 5 5 5-5", "m7 9 5-5 5 5"],
				message: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
				shield: ["M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11", "M12 8v4", "M12 16h.01"],
				alert: ["M12 8v4", "M12 16h.01"],
				info: ["M12 16v-4", "M12 8h.01"]
			};
			return react_jsx_runtime.jsxs("svg", {
				viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5,
				strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
				children: [
					name === "alert" || name === "info" ? react_jsx_runtime.jsx("circle", { cx: 12, cy: 12, r: 10 }) : null,
					...(paths[name] || paths.info).map((d, index) => react_jsx_runtime.jsx("path", { d }, index))
				]
			});
		}

		function QuotaMeter({ win, windowMs, label, large, t }) {
			const elapsed = timeElapsedFraction(win.resetsAt, windowMs);
			const percent = Math.max(0, Math.min(100, win.percent));
			const timeTitle = elapsed === null ? "" : t(large && windowMs === WINDOW_MS.monthly ? "time.estimate" : "time.elapsed.title", {
				pct: Math.round(elapsed * 100), rest: Math.round((1 - elapsed) * 100)
			});
			return react_jsx_runtime.jsxs("div", {
				className: "ocg-meter" + (large ? " ocg-meter-large" : ""),
				role: "progressbar", "aria-label": label, "aria-valuemin": 0, "aria-valuemax": 100,
				"aria-valuenow": percent, "aria-valuetext": win.percent + "%" + (timeTitle ? ", " + timeTitle : ""),
				title: timeTitle, style: { "--ocg-usage-color": fillColor(win.percent) },
				children: [
					react_jsx_runtime.jsx("div", {
						className: "ocg-track",
						children: react_jsx_runtime.jsx("div", { className: "ocg-fill", style: { width: percent + "%" } })
					}),
					elapsed === null ? null : react_jsx_runtime.jsx("span", {
						className: "ocg-marker", "aria-hidden": true,
						style: { left: "clamp(0px, calc(" + (elapsed * 100) + "% - 1px), calc(100% - 2px))" }
					})
				]
			});
		}

		function MonthlyQuota({ win, t, window: quotaWindow = WINDOWS.find((w) => w.key === "monthly") }) {
			const elapsed = timeElapsedFraction(win.resetsAt, quotaWindow.windowMs);
			const difference = elapsed === null ? null : Math.round(win.percent - elapsed * 100);
			const pace = difference === null ? null : Math.abs(difference) <= 3 ? "synced" : difference > 0 ? "ahead" : "behind";
			const countdown = timeUntil(win.resetsAt, t);
			return react_jsx_runtime.jsxs("div", {
				className: "ocg-monthly", children: [
					react_jsx_runtime.jsxs("div", {
						className: "ocg-label-row", children: [
							react_jsx_runtime.jsxs("div", { className: "ocg-primary-label", children: [
								react_jsx_runtime.jsx("span", { className: "ocg-monthly-label", children: t(quotaWindow.key === "monthly" ? "widget.monthly" : quotaWindow.labelKey) }),
								quotaWindow.hintKey ? react_jsx_runtime.jsx("span", { className: "ocg-chip", children: t(quotaWindow.hintKey) }) : null
							] }),
							react_jsx_runtime.jsx("span", { className: "ocg-countdown", children: win.status && win.status !== "ok" ? win.status : countdown && (countdown === t("time.soon") ? countdown : t("time.reset", { time: countdown })) })
						]
					}),
					react_jsx_runtime.jsxs("div", {
						className: "ocg-value-row", children: [
							react_jsx_runtime.jsx("span", { className: "ocg-monthly-value", "data-level": usageLevel(win.percent), children: win.percent + "%" }),
							pace === null ? null : react_jsx_runtime.jsx("span", {
								className: "ocg-pace", "data-pace": pace, "data-level": usageLevel(win.percent),
								children: t("pace." + pace, { pct: Math.abs(difference) })
							})
						]
					}),
					react_jsx_runtime.jsx(QuotaMeter, { win, windowMs: quotaWindow.windowMs, label: t(quotaWindow.key === "monthly" ? "widget.monthly" : quotaWindow.labelKey), large: true, t }),
					elapsed === null ? null : react_jsx_runtime.jsx("div", {
						className: "ocg-time", title: t(quotaWindow.key === "monthly" ? "time.estimate" : "time.elapsed.title", { pct: Math.round(elapsed * 100), rest: Math.round((1 - elapsed) * 100) }),
						children: t("time.progress", { pct: Math.round(elapsed * 100) })
					})
				]
			});
		}

		function QuotaRow({ win, window, t }) {
			if (!validWindow(win)) return null;
			return react_jsx_runtime.jsxs("div", {
				className: "ocg-row", children: [
					react_jsx_runtime.jsxs("div", {
						className: "ocg-label-row", children: [
							react_jsx_runtime.jsxs("div", {
								className: "ocg-row-label", children: [
									t(window.labelKey),
									window.hintKey ? react_jsx_runtime.jsx("span", { className: "ocg-window-hint", children: t(window.hintKey) }) : null
								]
							}),
							react_jsx_runtime.jsxs("div", {
								className: "ocg-row-values", children: [
									react_jsx_runtime.jsx("span", { className: "ocg-countdown", children: win.status && win.status !== "ok" ? win.status : timeUntil(win.resetsAt, t) }),
									react_jsx_runtime.jsx("span", { className: "ocg-row-percent", "data-level": usageLevel(win.percent), children: win.percent + "%" })
								]
							})
						]
					}),
					react_jsx_runtime.jsx(QuotaMeter, { win, windowMs: window.windowMs, label: t(window.labelKey), t })
				]
			});
		}

		function QuotaSkeleton() {
			return react_jsx_runtime.jsx("div", {
				className: "ocg-skeleton", "aria-hidden": true,
				children: ["label", "value", "bar", "label ocg-skeleton-gap", "bar", "label", "bar"].map((part, i) =>
					react_jsx_runtime.jsx("span", { className: "ocg-skeleton-" + part }, i))
			});
		}

		// ── display helpers (defensive: any field of a newer payload may be
		// absent when an older host serves the bundle, and a thrown render would
		// take down the widget or the whole Plugins panel) ──
		function asText(value) {
			if (typeof value === "string") return value;
			if (value === null || value === undefined) return "";
			return String(value);
		}

		/** Localized label of an effective/requested source. */
		function sourceLabel(t, source) {
			return source === "builtin" ? t("source.builtin") : t("source.opencode-go");
		}

		/** Localized label of a fallback reason; unknown reasons fall through. */
		function reasonLabel(t, reason) {
			const key = "reason." + (typeof reason === "string" && reason !== "" ? reason : "unknown");
			const label = t(key);
			return label === key ? t("reason.unknown") : label;
		}

		/**
		 * Tooltip of the "内置 / built-in" badge: effective source, requested
		 * source, fallback reason, and the host's message when it sent one.
		 */
		function fallbackTitle(t, fallback, source) {
			const requested = fallback && (fallback.from === "builtin" || fallback.from === "opencode-go") ? fallback.from : source;
			const reason = reasonLabel(t, fallback && fallback.reason);
			const raw = asText(fallback && fallback.message);
			return t("widget.fallback.title", {
				source: sourceLabel(t, source),
				requested: requested === "builtin" || requested === "opencode-go" ? sourceLabel(t, requested) : sourceLabel(t, source),
				reason: reason,
				message: raw === "" ? "" : " · " + raw
			});
		}

		/**
		 * Collapsed-rail tooltip. Mentions the active account and the source, so
		 * the rail still says whose quota it is showing while collapsed.
		 */
		function railTitle(t, error, pct, accountName, source, fallback) {
			if (error) return t("rail.error", { error: error });
			let title;
			if (pct === null) title = accountName === "" ? t("rail.plain") : t("rail.account", { name: accountName });
			else title = accountName === "" ? t("rail.title", { pct: pct }) : t("rail.title.account", { pct: pct, name: accountName });
			if (source === "opencode-go" || source === "builtin") title += " · " + sourceLabel(t, source);
			if (fallback) title += " · " + reasonLabel(t, fallback.reason);
			return title;
		}

		/**
		 * Translate from the dictionaries above when the slot owner does not hand
		 * a `t` seat to a component (the settings page is also rendered by test
		 * harnesses that call it directly). Mirrors the `{name}` placeholder
		 * syntax the locale service uses.
		 */
		function detectLang() {
			try {
				const lang = (typeof document !== "undefined" && document.documentElement && document.documentElement.lang)
					|| (typeof navigator !== "undefined" && navigator.language)
					|| "";
				return String(lang).toLowerCase();
			} catch (_error) {
				return "";
			}
		}

		function fallbackT(key, params) {
			const table = detectLang().indexOf("zh") === 0 ? zh : en;
			let raw = table[key] !== undefined ? table[key] : zh[key] !== undefined ? zh[key] : key;
			if (params === null || params === undefined) return raw;
			return String(raw).replace(/\{(\w+)\}/g, (match, name) => (params[name] === null || params[name] === undefined ? "" : String(params[name])));
		}

		/** Resolve the page's translator: slot-provided seat first, dictionary last. */
		function translateFor(props) {
			return props && typeof props.t === "function" ? props.t : fallbackT;
		}

		function formatBalance(item) {
			return new Intl.NumberFormat(detectLang() === "zh" ? "zh-CN" : "en-US", {
				style: "currency", currency: item.currency, currencyDisplay: "code", minimumFractionDigits: 2, maximumFractionDigits: 2
			}).format(item.amount);
		}

		function formatAmount(item) {
			return new Intl.NumberFormat(detectLang() === "zh" ? "zh-CN" : "en-US", {
				minimumFractionDigits: 2, maximumFractionDigits: 2
			}).format(item.amount);
		}

		// Vector paths from the Pencil design; keep icons local to this React-only bundle.
		const providerIconPaths = {
			GO: "M22 24h-20v-24h20z m-5-19.2h-10v14.4h10z",
			MM: "M11.43 3.92a0.86 0.86 0 1 0-1.718 0v14.236a1.999 1.999 0 0 1-3.997 0v-9.134a0.86 0.86 0 1 0-1.718 0v3.87a1.999 1.999 0 0 1-3.997 0v-1.402a0.57 0.57 0 0 1 1.139 0v1.404a0.86 0.86 0 0 0 1.719 0v-3.872a1.999 1.999 0 0 1 3.997 0v9.134a0.86 0.86 0 0 0 1.719 0v-14.236a1.998 1.998 0 1 1 3.996 0v11.788a0.57 0.57 0 1 1-1.139 0z m10.572 3.105a2 2 0 0 0-1.999 1.997v7.63a0.86 0.86 0 0 1-1.718 0v-12.729a1.999 1.999 0 0 0-3.997 0v16.16a0.86 0.86 0 0 1-1.719 0v-2.003a0.57 0.57 0 1 0-1.138 0v2a1.998 1.998 0 0 0 3.996 0v-16.16a0.86 0.86 0 0 1 1.719 0v12.73a1.999 1.999 0 0 0 3.996 0v-7.627a0.86 0.86 0 1 1 1.72 0v6.686a0.57 0.57 0 0 0 1.138 0v-6.687a2 2 0 0 0-1.998-1.997",
			DS: "M23.748 4.651c-0.254-0.124-0.364 0.113-0.512 0.233-0.051 0.04-0.094 0.09-0.137 0.137-0.372 0.397-0.806 0.657-1.373 0.626-0.829-0.046-1.537 0.214-2.163 0.848-0.133-0.782-0.575-1.248-1.247-1.548-0.352-0.155-0.708-0.311-0.955-0.65-0.172-0.24-0.219-0.509-0.305-0.774-0.055-0.16-0.11-0.323-0.293-0.35-0.2-0.031-0.278 0.136-0.356 0.276-0.313 0.572-0.434 1.202-0.422 1.84 0.027 1.436 0.633 2.58 1.838 3.393 0.137 0.094 0.172 0.187 0.129 0.323-0.082 0.28-0.18 0.553-0.266 0.833-0.055 0.179-0.137 0.218-0.328 0.14a5.5 5.5 0 0 1-1.737-1.179c-0.857-0.828-1.631-1.743-2.597-2.46a12 12 0 0 0-0.689-0.47c-0.985-0.957 0.13-1.743 0.387-1.836 0.27-0.098 0.094-0.433-0.778-0.428-0.872 0.003-1.67 0.295-2.687 0.685a3 3 0 0 1-0.465 0.136 9.6 9.6 0 0 0-2.883-0.101c-1.885 0.21-3.39 1.1-4.497 2.622-1.33 1.829-1.643 3.907-1.26 6.073 0.403 2.284 1.568 4.175 3.36 5.653 1.857 1.533 3.997 2.284 6.438 2.14 1.482-0.085 3.132-0.284 4.994-1.86 0.47 0.234 0.962 0.328 1.78 0.398 0.629 0.058 1.235-0.031 1.705-0.129 0.735-0.155 0.684-0.836 0.418-0.961-2.155-1.004-1.682-0.595-2.112-0.926 1.095-1.295 2.768-3.598 3.284-6.733 0.05-0.346 0.115-0.834 0.108-1.114-0.004-0.171 0.035-0.238 0.23-0.257a4.2 4.2 0 0 0 1.545-0.475c1.397-0.763 1.96-2.016 2.093-3.517 0.02-0.23-0.004-0.467-0.247-0.588m-12.168 13.517c-2.088-1.642-3.101-2.183-3.52-2.16-0.39 0.024-0.32 0.472-0.234 0.763 0.09 0.288 0.207 0.487 0.371 0.74 0.114 0.167 0.192 0.416-0.113 0.603-0.673 0.416-1.842-0.14-1.897-0.168-1.361-0.801-2.5-1.86-3.301-3.306-0.775-1.393-1.225-2.888-1.299-4.482-0.02-0.385 0.094-0.522 0.477-0.592a4.7 4.7 0 0 1 1.53-0.038c2.131 0.311 3.946 1.264 5.467 2.774 0.868 0.86 1.525 1.887 2.202 2.89 0.72 1.066 1.494 2.082 2.48 2.915 0.348 0.291 0.626 0.513 0.892 0.677-0.802 0.09-2.14 0.109-3.055-0.615z m1.001-6.44a0.306 0.306 0 0 1 0.415-0.287 0.3 0.3 0 0 1 0.113 0.074 0.3 0.3 0 0 1 0.086 0.214c0 0.17-0.136 0.307-0.308 0.307a0.303 0.303 0 0 1-0.306-0.307m3.11 1.596c-0.2 0.081-0.4 0.151-0.591 0.16a1.25 1.25 0 0 1-0.798-0.254c-0.274-0.23-0.47-0.358-0.551-0.758a1.7 1.7 0 0 1 0.015-0.588c0.07-0.327-0.007-0.537-0.238-0.727-0.188-0.156-0.426-0.199-0.689-0.199a0.6 0.6 0 0 1-0.254-0.078 0.253 0.253 0 0 1-0.114-0.358 1 1 0 0 1 0.192-0.21c0.356-0.202 0.767-0.136 1.146 0.016 0.352 0.144 0.618 0.408 1.001 0.782 0.392 0.451 0.462 0.576 0.685 0.915 0.176 0.264 0.336 0.536 0.446 0.848 0.066 0.194-0.02 0.353-0.25 0.45",
			OR: "M16.778 1.844v1.919q-0.569-0.026-1.138-0.032-0.708-0.008-1.415 0.037c-1.93 0.126-4.023 0.728-6.149 2.237-2.911 2.066-2.731 1.95-4.14 2.75-0.396 0.223-1.342 0.574-2.185 0.798-0.841 0.225-1.753 0.333-1.751 0.333v4.229s0.768 0.108 1.61 0.333c0.842 0.224 1.789 0.575 2.185 0.799 1.41 0.798 1.228 0.683 4.14 2.75 2.126 1.509 4.22 2.11 6.148 2.236 0.88 0.058 1.716 0.041 2.555 0.005v1.918l7.222-4.168-7.222-4.17v2.176c-0.86 0.038-1.611 0.065-2.278 0.021-1.364-0.09-2.417-0.357-3.979-1.465-2.244-1.593-2.866-2.027-3.68-2.508 0.889-0.518 1.449-0.906 3.822-2.59 1.56-1.109 2.614-1.377 3.978-1.466 0.667-0.044 1.418-0.017 2.278 0.02v2.176l7.221-4.168z",
			MS: "M21.765 0.351c1.233 0 2.235 1.002 2.235 2.235s-1.002 2.234-2.235 2.234h-1.974c-0.15 0-0.26-0.12-0.26-0.26v-1.974a2.237 2.237 0 0 1 2.234-2.236m-12.355 13.038l8.447-8.377c0.16-0.16 0.07-0.471-0.14-0.471h-4.55s-0.1 0.02-0.14 0.06l-9.099 9.029c-0.14 0.14-0.35 0.02-0.35-0.21v-8.609c0-0.15-0.1-0.27-0.221-0.27h-3.137c-0.12 0-0.22 0.12-0.22 0.27v18.57c0 0.15 0.1 0.27 0.22 0.27h3.137c0.12 0 0.22-0.12 0.22-0.27v-3.79c0-0.08 0.03-0.16 0.08-0.21l2.826-2.796c0.07-0.07 0.16-0.08 0.241-0.03l7.546 5.551a8.9 8.9 0 0 0 4.018 1.493c0.12 0.01 0.23-0.11 0.23-0.27v-3.568c0-0.14-0.08-0.25-0.19-0.26a5.8 5.8 0 0 1-2.355-0.942l-6.533-4.73c-0.14-0.09-0.15-0.32-0.03-0.441"
		};

		function ProviderIcon({ name, fallback }) {
			const d = providerIconPaths[name];
			return d ? react_jsx_runtime.jsx("svg", {
				className: "ocg-brand-icon", viewBox: "0 0 24 24", width: 12, height: 12,
				fill: "currentColor", "aria-hidden": true, focusable: "false",
				children: react_jsx_runtime.jsx("path", { d })
			}) : fallback;
		}

		function providerAppearance(id, name) {
			const providers = [
				{ match: /^(opencode-go|OpenCode GO)$/i, mark: "GO", color: "#1d222c", border: "#333a48", name: "OpenCode GO" },
				{ match: /^minimax(?:-|$)/i, mark: "MM", color: "#e73562", railColor: "light-dark(#e73562,#ff7d95)", name: "MiniMax" },
				{ match: /^deepseek(?:-|$)/i, mark: "DS", color: "#4d6bfe", railColor: "light-dark(#4d6bfe,#93aaff)", name: "DeepSeek" },
				{ match: /^openrouter$/i, mark: "OR", color: "#1d222c", border: "#333a48", name: "OpenRouter" },
				{ match: /^moonshot(?:-|$)/i, mark: "MS", color: "#1d222c", border: "#333a48", name: "Moonshot" }
			];
			return providers.find((provider) => provider.match.test(id || "") || provider.match.test(name))
				|| { mark: name.replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase() || "AI", color: "#6e7787", name };
		}

		function formatRailBalance(item) {
			return new Intl.NumberFormat("en-US", {
				style: "currency", currency: item.currency, currencyDisplay: "narrowSymbol",
				notation: "compact", minimumFractionDigits: 2, maximumFractionDigits: 2
			}).format(item.amount);
		}

		function validPayload(data) {
			return data && (data.kind === "unavailable" || (data.kind === "balance"
				? Array.isArray(data.balances) && data.balances.length > 0 && data.balances.every((item) =>
					typeof item.amount === "number" && Number.isFinite(item.amount) && /^[A-Z]{3}$/.test(item.currency))
				: WINDOWS.some((w) => validWindow(data.usage && data.usage[w.key]))));
		}

		/** Follow the retained main session, then its accepted model selection. */
		function createSelectionStore() {
			let value;
			const listeners = new Set();
			const publish = (next) => {
				if (JSON.stringify(next) === JSON.stringify(value)) return;
				value = next;
				listeners.forEach((listener) => listener());
			};
			return {
				getSnapshot: () => value,
				subscribe: (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
				connect(ctx) {
					let sessionId, directory, unsubscribeDirectory;
					const updateSelection = () => {
						const state = directory?.store.getSnapshot();
						const current = state?.current;
						publish(current ? {
							sessionId, provider: current.provider, model: current.model,
							name: state.groups?.find((group) => group.id === current.provider)?.name || current.provider
						} : null);
					};
					const updateSession = () => {
						const row = Object.values(ctx.sessions.list.getSnapshot().byId).find((item) => (item.retainedBy?.mainView ?? 0) > 0);
						if (row?.id === sessionId && directory) return;
						unsubscribeDirectory?.();
						unsubscribeDirectory = undefined;
						sessionId = row?.id;
						directory = undefined;
						try {
							if (sessionId) {
								directory = ctx.modelDirectories.directoryFor(sessionId);
								unsubscribeDirectory = directory.store.subscribe(updateSelection);
								Promise.resolve(directory.load()).catch(() => {});
							}
						} catch { /* Session scope may be closing during navigation. */ }
						updateSelection();
					};
					const unsubscribe = ctx.sessions.list.subscribe(updateSession);
					updateSession();
					return () => { unsubscribe(); unsubscribeDirectory?.(); publish(undefined); };
				}
			};
		}

		// ── widget component ──
		/**
		 * @param {{ wide?: boolean, t?: Function }} props - owner share from the
		 * sidebar (`sidebar.footer.action` is rendered with `{ wide }`) plus the
		 * locale translate seat declared by this registration.
		 */
		function Widget(props) {
			const t = translateFor(props);
			const selection = props.selection;
			const [data, setData] = react.useState(null);
			const [error, setError] = react.useState(null);
			const [stamp, setStamp] = react.useState(0);
			const [refreshing, setRefreshing] = react.useState(true);
			const [updatedAt, setUpdatedAt] = react.useState(null);
			const tRef = react.useRef(t);
			tRef.current = t;

			react.useEffect(() => {
				if (selection === null) { setRefreshing(false); return; }
				let alive = true;
				let pending = false;
				const controller = new AbortController();
				const load = async () => {
					if (pending) return;
					pending = true;
					setRefreshing(true);
					try {
						const query = selection ? "?" + new URLSearchParams({ provider: selection.provider, model: selection.model }) : "";
						const res = await fetch("/opencode-go/usage" + query, { cache: "no-store", signal: controller.signal });
						const json = await res.json().catch(() => null);
						if (!alive) return;
						if (!res.ok || json === null || json.error) {
							setError(String((json && json.error) || "HTTP " + res.status));
						} else if (!validPayload(json)) {
							setError(tRef.current("widget.invalid"));
						} else {
							setData(json);
							setError(null);
							setUpdatedAt(Date.now());
						}
					} catch (e) {
						if (alive) setError(String((e && e.message) || e));
					} finally {
						pending = false;
						if (alive) setRefreshing(false);
					}
				};
				load();
				const timer = window.setInterval(load, 60000);
				return () => { alive = false; controller.abort(); window.clearInterval(timer); };
			}, [stamp, selection?.provider, selection?.model]);

			// Keep the countdowns and time markers current between network polls.
			const [, setTick] = react.useState(0);
			react.useEffect(() => {
				const timer = window.setInterval(() => setTick((n) => n + 1), 30000);
				return () => window.clearInterval(timer);
			}, []);

			const primaryWindow = ["monthly", "rolling", "weekly"].map((key) => WINDOWS.find((w) => w.key === key)).find((w) => validWindow(data?.usage?.[w.key]));
			const primary = primaryWindow ? data.usage[primaryWindow.key] : null;
			const pct = validWindow(primary) ? primary.percent : null;
			const balances = data?.kind === "balance" ? data.balances : null;
			const providerId = data?.provider?.id || selection?.provider || (selection === undefined && !data?.provider ? "opencode-go" : "");
			const rawBrand = data?.provider?.name || selection?.name || (selection === null ? t("widget.provider") : t("widget.brand"));
			const appearance = selection === null ? { mark: "AI", color: "#6e7787", name: rawBrand } : providerAppearance(providerId, rawBrand);
			const brand = rawBrand === providerId ? appearance.name : rawBrand;
			const mark = appearance.mark;
			const icon = appearance.match ? mark : null;
			const isGo = icon === "GO";
			const unavailable = selection === null ? "no-selection" : data?.kind === "unavailable" ? data.reason : null;
			const accountName = data && data.account && typeof data.account.name === "string" ? data.account.name.trim() : "";
			const chip = accountName || (icon === "MM" ? selection?.model || "" : providerId === "deepseek-account" ? t("widget.account.kind") : ["DS", "OR", "MS"].includes(icon) ? "API" : "");
			const brandStyle = {
				"--ocg-brand-color": appearance.color,
				"--ocg-brand-border": appearance.border || "transparent",
				"--ocg-brand-rail-color": appearance.railColor || (icon ? "var(--ocg-text)" : "var(--ocg-muted)")
			};
			const source = data && typeof data.source === "string" ? data.source : null;
			const fallback = data && data.fallback && typeof data.fallback === "object" ? data.fallback : null;
			const refresh = () => setStamp((n) => n + 1);

			if (!props.wide) {
				const value = error ? "!" : unavailable ? "-" : balances ? formatRailBalance(balances[0]) : pct === null ? "…" : pct + "%";
				const title = isGo ? railTitle(t, error, pct, accountName, source, fallback)
					: brand + ": " + (error || (unavailable ? t("widget." + unavailable) : balances ? balances.map(formatBalance).join(", ") : pct === null ? t("loading") : pct + "%"));
				return react_jsx_runtime.jsxs("button", {
					className: "ocg-rail", style: brandStyle, type: "button", onClick: refresh, disabled: refreshing,
					title,
					"aria-label": title + ". " + t("refresh"),
					children: [
						react_jsx_runtime.jsx("span", { className: "ocg-rail-brand", "aria-hidden": true, children: react_jsx_runtime.jsx(ProviderIcon, { name: icon, fallback: mark }) }),
						react_jsx_runtime.jsx("span", {
							className: "ocg-rail-value", style: {
								color: error || balances?.[0].amount < 0 ? "var(--ocg-error)" : unavailable ? "var(--ocg-muted)" : pct >= 70 ? fillColor(pct) : undefined,
								fontSize: value.length > 5 ? Math.max(7, 50 / value.length) + "px" : undefined
							}, children: value
						})
					]
				});
			}

			return react_jsx_runtime.jsxs("section", {
				className: "ocg-widget", style: brandStyle, "aria-label": brand, "aria-busy": refreshing,
				children: [
					react_jsx_runtime.jsxs("div", {
						className: "ocg-head", children: [
							react_jsx_runtime.jsxs("div", {
								className: "ocg-headleft", children: [
									react_jsx_runtime.jsx("span", { className: "ocg-brandmark", "aria-hidden": true, children: react_jsx_runtime.jsx(ProviderIcon, { name: icon, fallback: mark }) }),
									react_jsx_runtime.jsx("span", { className: "ocg-name", title: brand, children: brand }),
									chip === "" ? null : react_jsx_runtime.jsx("span", {
										className: accountName ? "ocg-account" : "ocg-chip", title: accountName ? t("widget.account.title", { name: accountName }) : chip, children: chip
									})
								]
							}),
							react_jsx_runtime.jsxs("div", {
								className: "ocg-actions", children: [
									fallback === null ? null : react_jsx_runtime.jsx("span", {
										className: "ocg-fallback", title: fallbackTitle(t, fallback, source), children: t("widget.fallback")
									}),
									react_jsx_runtime.jsx("button", {
										className: "ocg-refresh", type: "button", onClick: refresh, disabled: refreshing,
										title: t("refresh"), "aria-label": t("refresh"), children: react_jsx_runtime.jsx(RefreshIcon, {})
									})
								]
							})
						]
					}),
					error ? react_jsx_runtime.jsxs("div", {
						className: "ocg-error", role: "alert", children: [
							react_jsx_runtime.jsx("span", { className: "ocg-state-icon", children: react_jsx_runtime.jsx(StatusIcon, { name: "alert" }) }),
							react_jsx_runtime.jsxs("div", {
								className: "ocg-state-text", children: [
									react_jsx_runtime.jsxs("div", {
										className: "ocg-error-heading", children: [
											t("widget.error"),
											react_jsx_runtime.jsx("button", { className: "ocg-retry", type: "button", onClick: refresh, disabled: refreshing, children: t("widget.retry") })
										]
									}),
									react_jsx_runtime.jsx("p", { className: "ocg-error-detail", children: error })
								]
							})
						]
					}) : unavailable ? react_jsx_runtime.jsxs("div", {
						className: "ocg-unavailable", role: "status", children: [
							react_jsx_runtime.jsx("span", { className: "ocg-state-icon", children: react_jsx_runtime.jsx(StatusIcon, {
								name: unavailable === "no-selection" ? "message" : unavailable === "missing-credential" ? "shield" : unavailable === "model-unsupported" ? "follow" : unavailable === "sign-in-required" ? "alert" : "info"
							}) }),
							react_jsx_runtime.jsx("span", { className: "ocg-state-title", children: t("widget." + unavailable) })
						]
					})
						: balances ? react_jsx_runtime.jsx("div", {
							className: "ocg-balance", "data-multiple": balances.length > 1, children: [
								react_jsx_runtime.jsxs("div", { className: "ocg-label-row", children: [
									react_jsx_runtime.jsx("span", { className: "ocg-monthly-label", children: t("widget.balance") }),
									react_jsx_runtime.jsx("span", { className: "ocg-balance-note", children: t(providerId === "deepseek-account" ? "widget.balance.account" : icon === "OR" ? "widget.balance.openrouter" : "widget.balance.live") })
								] }),
								...balances.map((item, index) => react_jsx_runtime.jsxs("div", {
									className: "ocg-balance-row", children: [
										react_jsx_runtime.jsx("span", { className: "ocg-currency", children: item.currency }),
										react_jsx_runtime.jsx("span", { className: "ocg-balance-value", "data-level": item.amount < 0 ? "error" : "normal", children: formatAmount(item) })
									]
								}, index))
							]
						}) : pct === null ? react_jsx_runtime.jsx(QuotaSkeleton, {}) : react_jsx_runtime.jsxs(react.Fragment, {
						children: [
							react_jsx_runtime.jsx(MonthlyQuota, { win: primary, window: primaryWindow, t }),
							WINDOWS.some((w) => w.key !== primaryWindow.key && validWindow(data.usage[w.key])) ? react_jsx_runtime.jsx("div", {
								className: "ocg-windows",
								children: WINDOWS.filter((w) => w.key !== primaryWindow.key).map((w) => react_jsx_runtime.jsx(QuotaRow, { win: data.usage[w.key], window: w, t }, w.key))
							}) : null
						]
					}),
					unavailable === "no-selection" ? null : react_jsx_runtime.jsxs("div", {
						className: "ocg-footer", children: [
							source === null ? refreshing ? react_jsx_runtime.jsx("span", { role: "status", children: t("widget.refreshing") }) : react_jsx_runtime.jsxs("span", {
								className: "ocg-follow", children: [react_jsx_runtime.jsx(StatusIcon, { name: "follow" }), t("widget.follow")]
							}) : react_jsx_runtime.jsx("span", {
								className: "ocg-source", "data-fallback": fallback !== null,
								title: fallback ? fallbackTitle(t, fallback, source) : sourceLabel(t, source),
								children: source === "builtin" ? t("widget.source.builtin") : "dsh-opencode-go"
							}),
							data && data.update && data.update.available && data.update.latest ? react_jsx_runtime.jsx("a", {
								className: "ocg-update", href: "https://www.npmjs.com/package/@astervolans/dsh-opencode-go-usage", target: "_blank", rel: "noreferrer",
								title: t("update.title"), "aria-label": t("update.available", { v: data.update.latest }), children: "v" + data.update.latest
							}) : updatedAt === null ? null : react_jsx_runtime.jsx("span", { children: updatedLabel(updatedAt, t) })
						]
					})
				]
			});
		}

		// ── settings page (Plugins panel → this bundle) ─────────────────────
		//
		// `plugins.bundle.config` is a KEYED slot: @deepseek-ai/dsh-client-ui-plugin-manager
		// asks a bundle for its configuration page by PACKAGE NAME (not by row
		// id) and renders it above the bundle's rows. The slot component below
		// branches on `props.view` before any hook: `summary` is a plain string
		// and `page` (or a missing view) mounts {@link SettingsPage}. The page
		// reads/writes this plugin's settings namespace through its own routes;
		// a thrown render would take the whole Plugins panel down, so every
		// payload field is read defensively.
		const SETTINGS_PATH = "/opencode-go/settings";
		const SOURCES = ["opencode-go", "builtin"];

		/** The two sources are a closed set; anything else means "prefer opencode-go". */
		function normalizeSource(raw) {
			return raw === "builtin" ? "builtin" : "opencode-go";
		}

		/**
		 * Call one of this plugin's routes.
		 * @returns {Promise<{ status: number, payload: any }>} payload is null when
		 * the body was not JSON (an HTML error page, for instance).
		 */
		async function callApi(method, path, body) {
			const init = { method: method, cache: "no-store", credentials: "same-origin" };
			if (body !== undefined) {
				init.headers = { "content-type": "application/json" };
				init.body = JSON.stringify(body);
			}
			const res = await fetch(path, init);
			let payload = null;
			try {
				payload = await res.json();
			} catch (_error) {
				payload = null;
			}
			return { status: res.status, payload: payload };
		}

		// Inline styles on the DSH design tokens. The reference settings card
		// (dsh-literature-search) uses the same treatment; keeping it inline
		// means the page needs no extra CSS rule to be picked up.
		const PS = {
			wrap: { display: "flex", flexDirection: "column", gap: 12, padding: "4px 0 8px" },
			card: {
				background: "var(--dsw-alias-bg-layer-3, #16181d)",
				border: "1px solid var(--dsw-alias-border-l2, #2a2d34)",
				borderRadius: 10,
				padding: "14px 16px",
				display: "flex",
				flexDirection: "column",
				gap: 10
			},
			title: { fontSize: 13, fontWeight: 600, color: "var(--dsw-alias-label-primary, #e8e8e8)" },
			hint: { margin: 0, fontSize: 12, lineHeight: 1.6, color: "var(--dsw-alias-label-tertiary, #8a8f98)" },
			option: {
				display: "flex",
				gap: 10,
				alignItems: "flex-start",
				padding: "10px 12px",
				borderRadius: 8,
				border: "1px solid var(--dsw-alias-border-l2, #2a2d34)",
				background: "transparent",
				cursor: "pointer"
			},
			optionActive: {
				borderColor: "var(--dsw-static-deepseek-450, #5686fe)",
				background: "var(--dsw-alias-interactive-bg-hover)"
			},
			radio: { margin: "2px 0 0", flex: "none", accentColor: "var(--dsw-static-deepseek-450, #5686fe)" },
			optionBody: { display: "flex", flexDirection: "column", gap: 3, minWidth: 0 },
			optionTitle: { fontSize: 13, fontWeight: 500, color: "var(--dsw-alias-label-primary, #e8e8e8)" },
			optionDesc: { fontSize: 12, lineHeight: 1.55, color: "var(--dsw-alias-label-tertiary, #8a8f98)" },
			row: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
			statusRow: { display: "flex", gap: 10, alignItems: "baseline", minWidth: 0, fontSize: 12, lineHeight: 1.5 },
			statusLabel: { flex: "0 0 150px", color: "var(--dsw-alias-label-tertiary, #8a8f98)" },
			statusValue: { flex: 1, minWidth: 0, color: "var(--dsw-alias-label-primary, #e8e8e8)", overflowWrap: "anywhere" },
			ok: { margin: 0, fontSize: 12, color: "var(--dsw-alias-state-success-primary, #5dbb76)" },
			warn: { margin: 0, fontSize: 12, color: "var(--dsw-alias-state-warn-primary, #d6a64b)" },
			err: { margin: 0, fontSize: 12, color: "var(--dsw-alias-state-error-primary, #e5484d)" },
			info: { margin: 0, fontSize: 12, color: "var(--dsw-alias-label-tertiary, #8a8f98)" },
			button: {
				font: "inherit",
				cursor: "pointer",
				background: "transparent",
				color: "var(--dsw-alias-label-secondary, #a8adb8)",
				border: "1px solid var(--dsw-alias-border-l2, #2a2d34)",
				borderRadius: 8,
				padding: "6px 14px",
				fontSize: 12
			},
			buttonPrimary: {
				font: "inherit",
				cursor: "pointer",
				background: "var(--dsw-alias-label-primary, #0f1115)",
				color: "var(--dsw-alias-bg-layer-3, #ffffff)",
				border: "1px solid transparent",
				borderRadius: 8,
				padding: "7px 16px",
				fontSize: 12,
				fontWeight: 500
			},
			buttonDisabled: { opacity: 0.4, cursor: "not-allowed" }
		};

		/** One label/value line of the detection status panel. */
		function StatusRow(props) {
			return react_jsx_runtime.jsx("div", {
				style: PS.statusRow,
				children: [
					react_jsx_runtime.jsx("span", { style: PS.statusLabel, children: props.label }),
					react_jsx_runtime.jsx("span", { style: PS.statusValue, children: props.value })
				]
			});
		}

		/**
		 * The configuration page itself. Mounted only for `view: "page"`.
		 *
		 * State flow: mount → GET /opencode-go/settings → `phase: "ready"` with
		 * the redacted `value` and the `detection` report; the radio seeds from
		 * `value.quotaSource`. Save POSTs `{ patch: { quotaSource }, expectedRevision }`;
		 * 200 refreshes detection and then reloads the canonical value/revision,
		 * 409 shows a reload hint, 503 explains the missing settings descriptor.
		 */
		function SettingsPage(props) {
			const t = translateFor(props);
			const [state, setState] = react.useState({ phase: "loading", revision: 0, value: {}, detection: null, error: null });
			const [choice, setChoice] = react.useState("opencode-go");
			const [busy, setBusy] = react.useState({ save: false, reload: false });
			const [message, setMessage] = react.useState(null);
			// The reload callback must not re-subscribe when the slot hands a new
			// `t` function on every render, so it reads the current translator from
			// a ref instead of the closure.
			const tRef = react.useRef(t);
			tRef.current = t;

			const reload = react.useCallback(async (announce) => {
				const tt = tRef.current;
				try {
					const res = await callApi("GET", SETTINGS_PATH);
					const payload = res.payload;
					if (res.status === 200 && payload !== null) {
						const value = payload.value && typeof payload.value === "object" ? payload.value : {};
						setState({
							phase: "ready",
							revision: typeof payload.revision === "number" ? payload.revision : 0,
							value: value,
							detection: payload.detection && typeof payload.detection === "object" ? payload.detection : null,
							error: null
						});
						setChoice(normalizeSource(value.quotaSource));
						setMessage(announce === true ? { kind: "ok", text: tt("cfg.reloaded") } : null);
						return true;
					}
					const detail = (payload && (payload.error || payload.hint)) || "";
					setState((prev) => ({
						...prev,
						phase: "error",
						error: (res.status === 503 ? tt("cfg.unsupported") : tt("cfg.loadFailed", { error: "HTTP " + res.status })) + (detail === "" ? "" : "[" + detail + "]")
					}));
					return false;
				} catch (error) {
					setState((prev) => ({ ...prev, phase: "error", error: tt("cfg.loadFailed", { error: (error && error.message) || String(error) }) }));
					return false;
				}
			}, []);

			react.useEffect(() => {
				reload(false);
			}, [reload]);

			const save = async () => {
				if (busy.save) return;
				const tt = tRef.current;
				const next = normalizeSource(choice);
				const server = normalizeSource((state.value || {}).quotaSource);
				if (next === server) {
					setMessage({ kind: "info", text: tt("cfg.noChanges") });
					return;
				}
				setBusy((b) => ({ ...b, save: true }));
				setMessage(null);
				try {
					const res = await callApi("POST", SETTINGS_PATH, { patch: { quotaSource: next }, expectedRevision: state.revision });
					const payload = res.payload;
					if (res.status === 200 && payload !== null) {
						setState((prev) => ({
							...prev,
							revision: typeof payload.revision === "number" ? payload.revision : prev.revision,
							detection: payload.detection && typeof payload.detection === "object" ? payload.detection : prev.detection
						}));
						await reload(false);
						setMessage({ kind: "ok", text: tt("cfg.saved") });
					} else if (res.status === 409) {
						setMessage({ kind: "warn", text: tt("cfg.conflict") });
					} else {
						setMessage({ kind: "err", text: tt("cfg.saveFailed", { error: (payload && payload.error) || ("HTTP " + res.status) }) });
					}
				} catch (error) {
					setMessage({ kind: "err", text: tt("cfg.saveFailed", { error: (error && error.message) || String(error) }) });
				} finally {
					setBusy((b) => ({ ...b, save: false }));
				}
			};

			const onReload = async () => {
				if (busy.reload) return;
				setBusy((b) => ({ ...b, reload: true }));
				try {
					await reload(true);
				} finally {
					setBusy((b) => ({ ...b, reload: false }));
				}
			};

			if (state.phase === "loading") {
				return react_jsx_runtime.jsx("div", { style: PS.wrap, children: react_jsx_runtime.jsx("p", { style: PS.hint, children: t("cfg.loading") }) });
			}
			if (state.phase === "error") {
				return react_jsx_runtime.jsx("div", {
					style: PS.wrap,
					children: [
						react_jsx_runtime.jsx("p", { style: PS.err, children: state.error }),
						react_jsx_runtime.jsx("div", {
							style: PS.row,
							children: react_jsx_runtime.jsx("button", {
								style: busy.reload ? { ...PS.button, ...PS.buttonDisabled } : PS.button,
								disabled: busy.reload,
								onClick: onReload,
								children: t("cfg.retry")
							})
						})
					]
				});
			}

			// Everything below is a defensive read: `/opencode-go/settings` on an
			// older host, or a partial detection report, must render rather than
			// throw.
			const value = state.value || {};
			const detection = state.detection || {};
			const og = detection.opencodeGo && typeof detection.opencodeGo === "object" ? detection.opencodeGo : {};
			const account = og.account && typeof og.account === "object" ? og.account : {};
			const fallback = detection.fallback && typeof detection.fallback === "object" ? detection.fallback : null;
			const serverChoice = normalizeSource(value.quotaSource);
			const selected = normalizeSource(choice);
			const dirty = selected !== serverChoice;
			const effectiveSource = normalizeSource(asText(detection.effectiveSource) || serverChoice);
			const mode = normalizeSource(asText(detection.mode) || serverChoice);
			const version = asText(og.version);
			const accountName = asText(account.name);
			const accountRef = asText(account.ref);
			const accountText = accountName !== ""
				? accountName + (accountRef === "" ? "" : " (" + accountRef + ")")
				: accountRef !== "" ? accountRef : t("cfg.status.defaultAccount");
			const unknown = t("cfg.status.unknown");

			const statusRows = [];
			const pushStatus = (key, label, val) => statusRows.push(react_jsx_runtime.jsx(StatusRow, { label: label, value: val }, key));
			pushStatus("mode", t("cfg.status.mode"), sourceLabel(t, mode));
			pushStatus("effective", t("cfg.status.effective"), sourceLabel(t, effectiveSource));
			pushStatus("package", t("cfg.status.package"), og.detected === true ? (version === "" ? t("cfg.status.detected") : "v" + version) : t("cfg.status.notDetected"));
			pushStatus("entry", t("cfg.status.entry"), og.entryFound === true ? t("cfg.status.found") : og.entryFound === false ? t("cfg.status.notFound") : unknown);
			pushStatus("enabled", t("cfg.status.enabled"), og.enabled === true ? t("cfg.status.on") : og.enabled === false ? t("cfg.status.off") : unknown);
			pushStatus("service", t("cfg.status.service"), og.service === true ? t("cfg.status.available") : og.service === false ? t("cfg.status.unavailable") : unknown);
			if (typeof og.compatible === "boolean") {
				pushStatus("compatible", t("cfg.status.compatible"), og.compatible ? t("cfg.status.compatibleYes") : t("cfg.status.compatibleNo"));
			}
			pushStatus("account", t("cfg.status.account"), accountText);
			pushStatus("fallback", t("cfg.status.fallback"), fallback === null
				? t("cfg.status.none")
				: reasonLabel(t, fallback.reason) + (asText(fallback.message) === "" ? "" : " · " + asText(fallback.message)));

			const optionRows = SOURCES.map((src) => react_jsx_runtime.jsx("label", {
				style: selected === src ? { ...PS.option, ...PS.optionActive } : PS.option,
				children: [
					react_jsx_runtime.jsx("input", {
						type: "radio",
						name: "ocg-quota-source",
						checked: selected === src,
						disabled: busy.save || busy.reload,
						style: PS.radio,
						onChange: () => {
							setChoice(src);
							setMessage(null);
						}
					}),
					react_jsx_runtime.jsx("span", {
						style: PS.optionBody,
						children: [
							react_jsx_runtime.jsx("span", { style: PS.optionTitle, children: t(src === "builtin" ? "cfg.option.builtin" : "cfg.option.opencode-go") }),
							react_jsx_runtime.jsx("span", { style: PS.optionDesc, children: t(src === "builtin" ? "cfg.option.builtin.desc" : "cfg.option.opencode-go.desc") })
						]
					})
				]
			}, src));

			const messageStyle = message === null
				? PS.info
				: message.kind === "ok" ? PS.ok : message.kind === "warn" ? PS.warn : message.kind === "err" ? PS.err : PS.info;
			const disabled = busy.save || busy.reload;

			return react_jsx_runtime.jsx("div", {
				style: PS.wrap,
				children: [
					// ---- source choice ----
					react_jsx_runtime.jsx("section", {
						style: PS.card,
						children: [
							react_jsx_runtime.jsx("div", { style: PS.title, children: t("cfg.title") }),
							react_jsx_runtime.jsx("p", { style: PS.hint, children: t("cfg.lead") }),
							react_jsx_runtime.jsx("div", {
								style: { display: "flex", flexDirection: "column", gap: 8 },
								children: optionRows
							})
						]
					}),
					// ---- detection / status panel ----
					react_jsx_runtime.jsx("section", {
						style: PS.card,
						children: [
							react_jsx_runtime.jsx("div", { style: PS.title, children: t("cfg.status.title") }),
							og.detected === true ? null : react_jsx_runtime.jsx("p", { style: PS.hint, children: t("cfg.status.hint.missing") }),
							react_jsx_runtime.jsx("div", {
								style: { display: "flex", flexDirection: "column", gap: 6 },
								children: statusRows
							})
						]
					}),
					// ---- actions and messages ----
					react_jsx_runtime.jsx("section", {
						style: PS.card,
						children: [
							react_jsx_runtime.jsx("div", {
								style: PS.row,
								children: [
									react_jsx_runtime.jsx("button", {
										style: disabled ? { ...PS.buttonPrimary, ...PS.buttonDisabled } : PS.buttonPrimary,
										disabled: disabled,
										onClick: save,
										children: busy.save ? t("cfg.saving") : t("cfg.save")
									}),
									react_jsx_runtime.jsx("button", {
										style: disabled ? { ...PS.button, ...PS.buttonDisabled } : PS.button,
										disabled: disabled,
										onClick: onReload,
										children: busy.reload ? t("cfg.reloading") : t("cfg.reload")
									}),
									dirty ? react_jsx_runtime.jsx("span", { style: PS.warn, children: t("cfg.unsaved") }) : null,
									react_jsx_runtime.jsx("span", {
										style: { ...PS.hint, marginLeft: "auto" },
										children: t("cfg.revision", { n: state.revision })
									})
								]
							}),
							message === null ? null : react_jsx_runtime.jsx("p", { style: messageStyle, children: message.text })
						]
					})
				]
			});
		}

		/** One-line description the panel may render as the bundle's summary. */
		const SUMMARY = "OpenCode GO 额度来源:优先 dsh-opencode-go 当前账号(失败自动回退到 DSH 内置提供商),或固定使用内置提供商。";

		/**
		 * The `plugins.bundle.config` occupant.
		 *
		 * The `view` branch is a component boundary on purpose: {@link SettingsPage}
		 * opens with `useState`/`useEffect`, so the summary — rendered as a plain
		 * string by the panel — must not pass through a hook-bearing parent.
		 *
		 * @param {{ view?: string, t?: Function }} props - owner props; `view` is
		 * `"summary"` or `"page"` (the bundle-level cell only asks for `"page"`,
		 * but the same shape is reused by summary cells).
		 * @returns {string|object} the one-liner, or the configuration page.
		 */
		function BundleConfig(props) {
			if (props !== null && props !== undefined && props.view === "summary") {
				try {
					return translateFor(props)("cfg.summary");
				} catch (_error) {
					return SUMMARY;
				}
			}
			return react_jsx_runtime.jsx(SettingsPage, props && typeof props.t === "function" ? { t: props.t } : {});
		}

		// ── cordis plugin entry ──
		const inject = ["slots", "locale"];

		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-opencode-go-usage: dictionaries");
			const selectionStore = createSelectionStore();
			if (typeof ctx.inject === "function") {
				ctx.inject(["sessions", "modelDirectories"], (scope) => {
					scope.effect(() => selectionStore.connect(scope), "dsh-opencode-go-usage: model selection");
				});
			} else if (ctx.sessions && ctx.modelDirectories) {
				ctx.effect(() => selectionStore.connect(ctx), "dsh-opencode-go-usage: model selection");
			}
			function ConnectedWidget(props) {
				const selection = react.useSyncExternalStore(selectionStore.subscribe, selectionStore.getSnapshot, selectionStore.getSnapshot);
				// Remount on selection changes so old data and in-flight reads cannot cross providers.
				const key = selection === undefined ? "legacy" : selection === null ? "none" : JSON.stringify([selection.sessionId, selection.provider, selection.model]);
				return react_jsx_runtime.jsx(Widget, { ...props, selection }, key);
			}
			const registerWidget = () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: PACKAGE_NAME,
				order: 0,
				label: "OpenCode GO",
				locale: NS
			}, ConnectedWidget);
			const registerConfig = () => ctx.slots.register({
				name: "plugins.bundle.config",
				key: CONFIG_KEY,
				locale: NS
			}, BundleConfig);
			// The settings page is additive: a host that predates the Plugins
			// panel (or a slots service without `inject`) must lose only this
			// page, never the widget. `inject` waits for the panel to declare the
			// slot, so an absent slot simply never fires; the fallback branch is
			// wrapped because an unknown slot name may throw there.
			const registerConfigSafely = () => {
				try {
					registerConfig();
				} catch (_error) {
					// no plugins.bundle.config slot in this composition
				}
			};
			if (typeof ctx.slots.inject === "function") {
				ctx.slots.inject("sidebar.footer.action", registerWidget);
				// `inject` waits for the Plugins panel to declare the slot, so this
				// bundle loads in either order. A key mismatch would not error — the
				// section would simply not render — hence CONFIG_KEY === PACKAGE_NAME.
				try {
					ctx.slots.inject("plugins.bundle.config", registerConfigSafely);
				} catch (_error) {
					// older slots service: the widget alone still works
				}
			} else {
				ctx.effect(registerWidget, "dsh-opencode-go-usage: widget registration");
				ctx.effect(registerConfigSafely, "dsh-opencode-go-usage: settings page registration");
			}
		}

		exports.apply = apply;
		exports.inject = inject;
		exports.CONFIG_KEY = CONFIG_KEY;
		exports.SUMMARY = SUMMARY;
		exports.Widget = Widget;
			exports.createSelectionStore = createSelectionStore;
		exports.BundleConfig = BundleConfig;
		exports.SettingsPage = SettingsPage;
		return module.exports;
	}
});
