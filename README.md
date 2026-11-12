# 把额度放进侧边栏

**[dsh-usage-meter](https://github.com/gaolin89898/dsh-usage-meter)** 是 [DSH](https://github.com/deepseek-ai/deepseek-harness)（DeepSeek Harness）的侧边栏小组件：跟随会话当前所用服务，实时显示对应的额度或余额——OpenCode GO 的 5 小时 / 周 / 月用量窗口，MiniMax 的滚动与周用量，DeepSeek / OpenRouter / Moonshot 的可用余额。每条用量条下再叠一条时间条——额度花得快还是慢，一眼可见。

`DSH ≥ 0.1.7` · `MIT License` · `● v1.0.0 · 源码树`

本仓库**不发布 npm**，安装一律从本地源码目录——见 [01 快速开始](#01-快速开始)。

第一次装 DSH 插件？直接看[使用者指南](docs/INSTALL.zh.md)，一步步照做即可。

## 01 快速开始

<div align="right"><sub>QUICK START</sub></div>

三步，从安装到看到第一条用量。

**从本地源码目录安装**

```bash
# install into the web profile
$ dsh plugin --profile web add ./dsh-usage-meter

# GO key → ~/.dsh/.credentials.yaml
OPENCODE_GO_API_KEY: sk-...

# restart the web service
$ dsh web
```

1. **安装到 web profile** —— `--profile web` 添加本地目录（desktop 同理，换成你实际用的 profile 名）；依赖 pnpm，没有就先 `corepack enable`。`dsh plugin add` 会自动把包的 `dsh.bundle.patch` 合并进 profile 的 bundle 层栈，不需要手改 cordis.patch.yml，也不需要软链。
2. **写入 API key** —— 在 `~/.dsh/.credentials.yaml` 里加一行 `OPENCODE_GO_API_KEY: sk-...`，key 在 [opencode.ai/auth](https://opencode.ai/auth) 创建。即使走默认的 `dsh-opencode-go` 来源也要配好这一步：一旦回退到内置提供商，用的正是这个 credential。
3. **重启并硬刷新** —— 完全退出 DSH 再启动（不是刷新页面），浏览器再 `Cmd/Ctrl+Shift+R`。装完侧栏底部即出现小组件；任意对话输入 `/opencode-go` 可输出同样的数字。

> 本地目录是 `link:` 安装，依赖从项目真实路径解析。若启动报 `Cannot find package '@deepseek-ai/schemastery'`，按[本地 link 安装的依赖解析](#本地-link-安装的依赖解析)建一个 junction 即可。

## 02 功能一览

<div align="right"><sub>WHAT IT DOES</sub></div>

一个小组件，覆盖用量、服务到状态的完整反馈。

<table>
<tr>
<td><b>三条窗口，一条时间轴</b><br>5h / 周 / 月三条用量条，各带重置倒计时；侧栏收起时收缩为紧凑百分比徽标。</td>
<td><b>额度与时间对照</b><br>用量条下再叠一条时间条：灰段是已流逝，蓝段是剩余；快慢一眼可见。与用量条同高同圆角，悬停显示两侧百分比，窗口重置时灰段占满归零。</td>
</tr>
<tr>
<td><b>跟随当前服务</b><br>切换模型或会话，侧栏即时换成对应服务的额度或余额；旧请求不会覆盖新服务的数据。</td>
<td><b>密钥不出端</b><br>同源代理：浏览器只访问本插件在 host 注册的路由，API key 永不离开 host，也没有 CORS 问题。</td>
</tr>
</table>

## 03 服务覆盖

<div align="right"><sub>COVERAGE</sub></div>

同一个接口，按当前服务返回最合适的数字。Host 实时解析凭据，密钥不会进入浏览器。

| 服务 | 显示内容 | 来源 |
|---|---|---|
| OpenCode GO | 滚动、周、月用量与重置时间 | ● 双来源 |
| MiniMax 国内 · 国际 | Coding Plan 的滚动与周用量；不补造月额度或重置时间 | ○ 内置 |
| DeepSeek API · 登录账号 | 按币种显示可用余额；登录账号合计充值与赠送钱包 | ○ 内置 |
| OpenRouter | 总充值减去已用金额 | ○ 内置 |
| Moonshot 国内 · 国际 | 可用余额 | ○ 内置 |
| 其他服务 · 自定义代理 | 提示暂不支持查询 | — |

来源图例：**● 双来源** = 可经 `dsh-opencode-go` 插件或内置提供商两条路径查询（见 [04 额度来源与回退](#04-额度来源与回退)）；**○ 内置** = 本插件按该服务自己的接口直连（见 [HTTP 接口](#http-接口)）；**—** = 无查询路径。

小组件通过 `GET /opencode-go/usage?provider=<服务路由>&model=<模型>` 查询。Host 根据当前服务的实时配置解析凭据，不按模型名称猜测服务；缓存按服务、模型、凭据分别隔离。未配置凭据、未登录、接口失败各有对应状态——小组件显示对应状态，而不是空白。

`llm-pi-ai` 配置的 GO 路由优先使用该路由自己的凭据；仅当它与额度来源中的账号及网关一致时才复用原有 GO 来源设置。旧版 DSH（没有模型选择服务）、不带查询参数的请求以及 `/opencode-go` 命令，继续使用原有 GO 来源配置。

## 04 额度来源与回退

<div align="right"><sub>QUOTA SOURCE</sub></div>

配置项 `quotaSource` 决定数字从哪里来。默认先问 `dsh-opencode-go` 的当前账号，失败时回退内置提供商，并在面板上标注原因。

| `quotaSource` | 行为 |
|---|---|
| `opencode-go`（默认） | 读取插件**当前账号**，账号切换时自动跟随；失败 → `builtin`，标注「内置」 |
| `builtin`（固定） | 始终走 `baseUrl` + `/v1/usage`，不探测插件；不会触发回退，也没有徽标 |

`opencode-go` 模式下，host 按以下顺序探测，任一步失败都会记录原因：

1. 存在实时 loader 条目 `opencode-go`（或 `dsh-opencode-go`）；
2. 该条目未被禁用；
3. `ctx.get("opencodeGoUsage")` 能解析出服务且带 `read()`；
4. `await read()` 返回三个窗口（rolling / weekly / monthly）；
5. 从该条目的实时配置解析当前账号（`apiKeyEnv`，再按同一 `apiKeyEnv` 匹配 `accounts[]`），并从可解析的 `dsh-opencode-go/package.json` 读版本号。

### 回退原因

| `fallback.reason` | 含义 |
|---|---|
| `not-installed` | 未安装，或尚未加载（装好后重启） |
| `entry-disabled` | profile 中条目被禁用 |
| `service-unavailable` | 服务缺失或版本过旧（没有 `opencodeGoUsage`，或其缺少 `read()`） |
| `read-failed` | 插件读取时报错，原文见 `fallback.message` |
| `invalid-response` | 没有三个有效窗口 |

任一步失败时，`GET /opencode-go/usage` 仍返回 **HTTP 200**，带 `source: "builtin"`、`requested: "opencode-go"`、`fallback` 对象与 `opencodeGo` 诊断块——小组件显示内置数字并加以标注。只有**两个来源都失败**才返回 502；`quotaSource: builtin` 不探测，因此 `fallback` 恒为 `null`、也没有徽标。

### 账号显示

- 当前账号有名字时，小组件标题变为 `OpenCode GO · <账号名>`（展开面板与收起后的徽标都是）；没有名字时保持 `OpenCode GO`。
- 只有**真的发生回退**（请求 `opencode-go`、实际 `builtin`）才显示「内置」徽标，tooltip 里带原因与信息。主动固定 `builtin` 不算回退，不显示徽标；接口里的 `source` 始终表示实际生效的来源。

### 设置页

插件在 DSH 官方 **`plugins.bundle.config`** 槽位注册了配置页，以包名为 key：**侧栏 →「插件」面板 → `@astervolans/dsh-opencode-go-usage` 卡片 → 配置页**。

页面提供：

- 两个来源的选择——**优先 dsh-opencode-go（当前账号）** 或 **DSH 内置提供商**，默认取当前 `quotaSource`；
- 由 `GET /opencode-go/settings` 驱动的状态面板：是否检测到 `dsh-opencode-go`、其版本、当前账号、服务可用性 / 兼容性、生效来源、回退原因与信息；
- **保存**（`POST /opencode-go/settings`，带 `{ patch: { quotaSource }, expectedRevision }`）与**重新加载**按钮，以及成功 / 失败 / 冲突提示。出现 revision 冲突说明配置在别处被改过（另一个标签页、设置表单、profile）——先重新加载再保存。

它与 **设置 → 插件 → 插件配置** 并存：两处改的是同一份条目配置，任一处保存都即时生效、无需重启；保存成功后 host 会让额度缓存失效，下一次小组件轮询即反映新来源。该路由只接受 `quotaSource`。若 DSH 无法描述本插件的设置（条目 id / schemastery），该路由返回 503、页面会提示——此时改用 profile patch 配置 `quotaSource`。

## 配置项

所有字段都是 volatile：出现在 设置 → 插件 → 插件配置（`quotaSource` 还会出现在[设置页](#设置页)），改完即时生效、无需重启。

| 键 | 默认 | 说明 |
|---|---|---|
| `quotaSource` | `opencode-go` | 额度数字来源：`opencode-go`（优先 `dsh-opencode-go` 当前账号，失败自动回退内置）或 `builtin`；未知值归一化为 `opencode-go` |
| `apiKeyEnv` | `OPENCODE_GO_API_KEY` | API key 的 credential 引用 / 环境变量名（内置路径；`opencode-go` 模式回退时也用它） |
| `baseUrl` | `https://opencode.ai/zen/go` | 网关 base URL（内置路径） |
| `cacheMs` | `30000` | host 端上游缓存 TTL |
| `updateCheck` | `false` | 检查 npm 新版本（组件与命令只提示，插件不会自行升级）。默认关闭：本仓库不发布 npm，开启会因 npm 上遗留的 1.5.0 高于 1.0.0 而误报可升级 |
| `injectSessionHeader` | `true` | 为 GO 网关聊天请求注入运行时 `x-opencode-session` 头 |

也可以直接在 profile patch 里配置：

```yaml
- id: dsh-opencode-go-usage
  config:
    cacheMs: 60000
    quotaSource: builtin   # 可选：强制走内置提供商
```

> volatile 标记需要 schemastery ≥ `3.18.4`；profile 里若 hoist 着旧副本（3.18.2），插件照常启用并从条目读配置，只是不生成设置页、不能热改。详见[兼容性](#兼容性)。

## HTTP 接口

### 上游用量 API

`GET https://opencode.ai/zen/go/v1/usage`，带 `Authorization: Bearer <key>`：

```json
{
  "usage": {
    "rolling": { "status": "ok", "percent": 0,  "resetsAt": "2026-08-14T07:51:13Z" },
    "weekly":  { "status": "ok", "percent": 1,  "resetsAt": "2026-08-17T00:00:00Z" },
    "monthly": { "status": "ok", "percent": 22, "resetsAt": "2026-08-21T13:05:13Z" }
  }
}
```

### 同源路由

小组件与命令从不直接访问网关，由 host 代理并附加信息。

**`GET /opencode-go/usage`** —— 在 1.5.0 字段（`usage`、`update`、`sessionHeader`）之外，本源码树新增：

| 字段 | 含义 |
|---|---|
| `source` | `usage` 里数字的实际来源：`opencode-go` 或 `builtin` |
| `requested` | 配置的 `quotaSource` |
| `account` | `dsh-opencode-go` 的当前账号：`{ ref, id, name }`（`builtin` 模式下为配置的 ref） |
| `fallback` | `null`；或插件路径失败改用内置时的 `{ from: "opencode-go", reason, message }` |
| `opencodeGo` | 检测信息：`{ detected, version, entryFound, enabled, service, compatible, reason, message }` |
| `lastSwitch` | `dsh-opencode-go` 最近一次账号切换（`fromRef`、`toRef`、`reason`、`at`），没有则为 `null` |

两个来源都失败时返回 **HTTP 502**——`{ error, requested, opencodeGo, fallback }`。

**`GET /opencode-go/settings`** —— 返回 `{ ok, namespace, revision, value, base, user, detection }`；`value` 是脱敏后的配置，`detection` 另含 `dsh-opencode-go` 的账号列表与生效来源。DSH 无法描述本插件设置时返回 503。

**`POST /opencode-go/settings`** —— 请求体 `{ patch: { quotaSource }, expectedRevision }` → `{ ok, revision, detection }`。只接受 `quotaSource`；`expectedRevision` 过期返回 `409`，请求体 / 取值非法返回 `400`，跨源 `Origin` 返回 `403`。

## x-opencode-session 修复

OpenCode GO 网关拒绝缺少 `x-opencode-session` 头的聊天补全请求（`HTTP 400 MissingSessionID`），而 DSH 的 `llm-pi-ai` 适配器从不发送该头。与其修改 DSH 安装目录里的文件（每次升级都会被覆盖），本插件改为运行时注入：

- 一次性包装 `globalThis.fetch`；
- 监听 DSH 官方 `llm/stream` waterfall 事件，获取每次调用的会话 ID（`options.sessionId`，由 `dsh-agent-loop` 填充）。

网关 base 从**被调用 provider 自身的实时配置**解析（`llm-pi-ai.providers.<route>.baseURL`，缺省回退本插件的 `baseUrl`）——代码不硬编码任何域名——因此只有发往该调用对应网关的请求才会收到该头，且值为真实的会话级 ID。

- 开关：配置项 `injectSessionHeader`（默认 `true`）。
- 可观测性：`GET /opencode-go/usage` 返回 `sessionHeader: { active, count, diag }`；`diag` 报告运行时观测，如 `streamSeen`（处理过的 `llm/stream` 调用数）、`lastStream`（provider、session-id 是否存在、base 及其来源）、`requests` / `injected` / `missed`（带上下文的 wire 请求数 / 实际注入数 / 因 URL 不匹配未注入数）。

## 工作原理

这是一个**双端 DSH 插件包**：

| 端 | 文件 | 职责 |
|---|---|---|
| host（Node） | `lib/index.js` | 注册 `GET /opencode-go/usage` 与 `GET` / `POST /opencode-go/settings` 路由（`ctx.webServer`），以及 `/opencode-go` 命令（`ctx.commands`）；解析额度来源（优先 `dsh-opencode-go` 的 `opencodeGoUsage` 服务，失败回退内置）并经 DSH credentials 解析 key；上游调用带缓存（默认 30s，按来源 + 账号区分） |
| 浏览器 | `lib/client.js` | 手写的 `window.__ModuleLoader__.load({ id, factory })` bundle，等待 `sidebar.footer.action` 列表槽与 `plugins.bundle.config` 槽就绪后注册，每 60s 轮询同源路由 |

### 侧边栏小组件如何加载

DSH `0.1.7-rc` 起通过官方 client-modules 扫描装载组件：包的 `dsh.client` 声明 + `exports["./client"]` 按 loader entry 自动识别，bundle 由 `/plugins/...` 组合路由提供，boot graph 行由 host 自己写进 `window.__DSH_BOOT__` 清单——无需手工打包或注入 index。（更早的 `0.1.1` / `0.1.2` 线用自托管 `/dsh-opencode-go-usage/client.js` 路由 + `webServer.tapIndex` 行注入；该机制已移除，因为 `0.1.7-rc` 把数组形 boot 清单改成了 `{ rev, entries, batches }` 对象，只能由 client-modules 生成。）

## 兼容性

| 插件版本 | DSH 运行时 | host 端 | 浏览器端 |
|---|---|---|---|
| **1.0.0**（本源码树；版本线在 fork 处重启，能力等同源码树此前的 1.6.0） | `0.1.7` 及以上，含 `0.2.x` 线（已在 `0.2.2-rc.2` 验证） | 同 1.5.0，另加经 `opencodeGoUsage` 的额度来源探测、多服务跟随，以及 `GET` / `POST /opencode-go/settings` 路由 | 同 1.5.0，另加 `plugins.bundle.config` 槽位注册（应用包设置页）与账号 / 回退显示 |
| 1.5.0 | `0.1.7` 及以上，含 `0.2.0` 线 | loader 读取导出的 `Config` schema；配置取自插件条目（不再调用 `ctx.settings.register` / `settings.get`） | 由 client-modules 依据包的 `dsh.client` 声明自动装配 |
| 1.4.0 | `0.1.7-rc.1`、`0.1.7-rc.2` | 同 1.5.0 | 同 1.5.0 |
| 1.3.3 | `0.1.1-rc.2`、`0.1.2-alpha.2`（`0.1.7` 之前的版本线） | `ctx.settings.register` 注册命名空间 + `ctx.settings.get` 读取 | 自托管 bundle 路由 + `webServer.tapIndex` 注入启动图行 |

支持的运行时写进了 `peerDependencies`：

```json
"peerDependencies": {
  "@deepseek-ai/schemastery": "^3.18.4",
  "@deepseek-ai/dsh": ">=0.1.7-rc.1 <0.2.0-0 || >=0.2.0 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0"
}
```

`dsh-opencode-go` 本身是**可选**的，也没有声明为依赖：`opencode-go` 模式下 host 运行时探测它，没有安装属于正常回退（`not-installed`），不是错误。想让小组件跟随其当前账号，就在同一个 profile 里装上它。

DSH 会在条目启用前用该范围校验当前运行时。从 `0.2.0` 起这是**硬闸门**：所有 `@deepseek-ai/dsh` / `@deepseek-ai/dsh-*` peer 都会带 `includePrerelease` 参与判定，不匹配则**整行被禁用**（宿主日志写 `disabling profile plugin row …`），而不是半死不活地跑着。窗口按 node-semver 的预发布规则写成显式分支：`0.1.7` 线（含 rc）一条、`0.2.x` 稳定版一条、`0.2.2` 预发布一条——宿主的 `includePrerelease` 判定与普通 semver 解析（npm / pnpm）都能通过；单一区间 `>=0.1.7-rc.1 <0.3.0` 看似更宽，但在普通解析下会**静默排除** `0.2.2-rc.x` 这类预发布版。未来 `0.2.x` 的新预发布（如 `0.2.3-rc.1`）在宿主判定下依旧可用，普通解析则需等分支补充。若运行时不在此列，请改装对应版本的插件，或显式接受风险后重启：

```bash
dsh plugin allow-version     # 为 name@version 在本 dsh 版本上授予精确版本豁免
```

在受支持版本上还有三点运行时说明：

- **设置页 / 热改 / 旧配置迁移** —— volatile 字段需要 schemastery ≥ `3.18.4`。两个官方包都按约定声明为 peer 而非 dependency，全新安装会解析到 DSH 自带的那份；若 profile 里仍 hoist 着旧的 `3.18.2`，则不会生成设置页、不能热改，旧的 `~/.dsh/settings.yaml` 段落也不会被迁移（留在 `settings.yaml.imported`）。两种情况插件都照常启用，并从 profile 条目读取配置（见[配置项](#配置项)）。
- **小组件** —— 全程无需手工打包或注入 index：host 依据包的 `dsh.client` 声明装配组件，并从 `/plugins/...` 组合路由提供（见[侧边栏小组件如何加载](#侧边栏小组件如何加载)）。
- **应用包设置页** —— 本源码树的设置页通过 `plugins.bundle.config` 槽位渲染，已在 `0.2.1-rc.4` host（Desktop Next `2.0.21-next`）与 `0.2.2-rc.2` 上验证。若你的运行时不提供该槽位，请改用 设置 → 插件 → 插件配置 或 profile patch 配置 `quotaSource`；小组件与 `/opencode-go` 命令不受影响。

## 开发

- **测试**：`npm test`（即 `node test/run.mjs`，全部离线运行）。
- **浏览器端**是手写的 factory bundle（`window.__ModuleLoader__.load`），因为目前第三方 client 插件还没有公开的构建流水线。它只能 `require()` shell 模块表里的模块（`react`、`react/jsx-runtime` 以及已注册的 client 包）。直接改 `lib/client.js`，重启 DSH 并刷新页面——bundle 的 revision hash 会变化，shell 自动加载新文件。
- **host 端**（`lib/index.js`）的改动只需重启 DSH。
- 本源码树的应用包设置页是同一个 bundle 里的第二处注册（`plugins.bundle.config`，以包名为 key）。组件按 `props.view` 分支：`summary` 必须返回纯字符串（插件面板卡片内联渲染），`page` 才挂载设置组件。两端都走同一组 `/opencode-go/...` 路由——设置页不直接读配置，而是经 `GET` / `POST /opencode-go/settings`。

### 本地 link 安装的依赖解析

`dsh plugin add <本地目录>` 以 pnpm `link:` 协议挂载，模块从**项目真实路径**解析依赖，而 `lib/index.js` 引用了 `@deepseek-ai/schemastery`（peer）。若从项目路径向上找不到该包，导入会报 `ERR_MODULE_NOT_FOUND`。解决办法是在项目里建一个 junction 指向 profile 的 hoisted 副本（Windows 示例，无需管理员权限）：

```bash
node -e "const fs=require('fs');fs.mkdirSync('node_modules/@deepseek-ai',{recursive:true});fs.symlinkSync(process.env.USERPROFILE+'/.dsh/profiles/<profile>/node_modules/@deepseek-ai/schemastery','node_modules/@deepseek-ai/schemastery','junction')"
```

`node_modules/` 已在 `.gitignore` 中，不会进入仓库。验证：`node --input-type=module -e "await import('@astervolans/dsh-opencode-go-usage')"`（在 profile 目录执行）。

## 常见问题

- **重启后小组件不出现** → 硬刷新页面（`Cmd/Ctrl+Shift+R`）；启动图是按页面加载注入的。
- **`/opencode-go/usage` 返回 502 且提示 no API key** → 在 `~/.dsh/.credentials.yaml` 配置 key。
- **网关 401 / 403** → key 无效或订阅过期；检查 credential。
- **小组件显示错误串** → 悬停收起态徽标，或展开态小组件里的错误行。
- **装了 `dsh-opencode-go` 但仍回退到内置** → `curl -s http://127.0.0.1:3080/opencode-go/usage` 看 `source`、`fallback` 与 `opencodeGo` 块，按 `fallback.reason` 处理（见[回退原因](#回退原因)）。不想让它探测就设 `quotaSource: builtin`。
- **小组件标题没有账号名** → 正常现象：`dsh-opencode-go` 缺失（回退）或其当前账号没有 `name`；可看接口里的 `account.name` 确认。
- **启动失败，日志有 `Identifier 'PACKAGE_NAME' has already been declared`** → 客户端 bundle 在 shell 的共享脚本作用域里声明了顶层同名常量（与 `@astervolans/dsh-literature-search` 等插件冲突），整个 web boot 会被判定失败。1.6.x 当前源码已把该名称移入 factory 内部；重新安装本源码并完全重启 DSH 即可。若同时使用 `dsh-literature-search`，也请确保它来自当前版本。

## 项目来源与致谢

- 本仓库（[gaolin89898/dsh-usage-meter](https://github.com/gaolin89898/dsh-usage-meter)）是 [yumusb/dsh-opencode-go-usage](https://github.com/yumusb/dsh-opencode-go-usage) 的 fork 线（早前也曾以 `Astervolans/dsh-opencode-go-usage` 存在）。包名沿用上游的 `@astervolans/dsh-opencode-go-usage`（`package.json` 的 `name` 未改，本地安装的解析名就是它）；**本仓库不发布 npm**——npm 上留有历史版本 1.3.2–1.5.0，新功能请从本地源码目录安装。版本线在 fork 处重启：本源码树为 **1.0.0**。
- 设置命名空间、HTTP 路由与命令名保持 `dsh-opencode-go-usage` 不变，从上游迁移无需改配置。
- 相对上游的差异：每条用量条下的**时间条**；**跟随当前服务**的多服务额度 / 余额显示；1.6.0 的**额度来源**（读取 `dsh-opencode-go` 当前账号）与应用包设置页。

## License

MIT
