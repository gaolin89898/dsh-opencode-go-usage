# dsh-opencode-go-usage

> ⚡ 需要 **OpenCode GO 套餐**:[buycodingplan.com](https://buycodingplan.com/)

一个 [DSH](https://github.com/deepseek-ai/deepseek-harness)(DeepSeek Harness)插件:在侧栏常驻监控你的 **OpenCode GO 套餐**额度 —— 滚动 5 小时 / 每周 / 每月三个用量窗口,每条用量条下再叠一条时间条,额度花得快还是慢,一眼可见。

- 兼容 DSH `0.1.7` 及以上(含 `0.2.0` 线),兼容范围声明在 `peerDependencies`,由宿主强制校验;
- 本仓库([gaolin89898/dsh-usage-meter](https://github.com/gaolin89898/dsh-usage-meter))是 [yumusb/dsh-opencode-go-usage](https://github.com/yumusb/dsh-opencode-go-usage) 的 fork 线(早前也曾以 `Astervolans/dsh-opencode-go-usage` 存在),npm 包名仍为 `@astervolans/dsh-opencode-go-usage`;设置命名空间、HTTP 路由与命令名保持 `dsh-opencode-go-usage` 不变,从上游迁移无需改配置;
- 相对上游的差异:每条用量条下的**时间条**;以及 1.6.0(源码树)的**额度来源** —— 可读取 `dsh-opencode-go` 插件的当前账号,并带独立的应用包设置页。

> **1.6.0 仅存在于本源码树**,尚未发布到 npm(最新发布版为 1.5.0,不含额度来源功能)。
> 想试用全部新功能,请[从本地源码目录安装](#从本地源码目录安装)。

第一次装 DSH 插件?直接看[使用者指南](docs/INSTALL.zh.md),一步步照做即可。

## 功能一览

| 能力 | 说明 |
|---|---|
| **侧栏小组件** | 常驻 DSH 侧边栏底部(`sidebar.footer.action` 槽位):5h / 周 / 月三条用量条,各带重置倒计时;侧栏收起时收缩为紧凑百分比徽标 |
| **时间进度条** | 每条用量条下方一条时间条:左灰为已流逝时间(向右增长),右蓝为剩余时间(向左收缩),窗口重置时灰段占满归零。与用量条同高同圆角,悬停显示已流逝 / 剩余百分比 |
| **跟随当前服务** | 切换会话的模型或服务时,侧栏立即切换为对应服务的额度或余额;旧请求不会覆盖新服务的数据 |
| **额度来源** | 默认读取 `dsh-opencode-go` 插件的**当前账号**;读不到(未装 / 禁用 / 不兼容 / 读取失败)时自动回退内置提供商并标注原因,见[额度来源与回退](#额度来源与回退) |
| **应用包设置页** | 侧栏「插件」面板 → 本应用包卡片内的配置页:切换额度来源,查看实时检测状态,见[设置页](#设置页) |
| **`/opencode-go` 命令** | 在任意对话中以文本输出三个窗口的数字 |
| **同源代理** | host 端注册 `GET /opencode-go/usage`,默认经 `dsh-opencode-go` 读额度,或携带 API key 转发官方 GO 网关;key 永不进入浏览器,无 CORS 问题 |
| **`x-opencode-session` 修复** | 运行时为 GO 网关聊天请求注入真实会话 ID(缺失该头网关返回 400);不改 DSH 安装文件,升级不失效,见[x-opencode-session 修复](#x-opencode-session-修复) |

## 服务覆盖

| 服务 | 显示内容 |
|---|---|
| OpenCode GO | 滚动、周、月用量与重置时间 |
| MiniMax 国内 / 国际 | Coding Plan 接口返回的滚动、周用量;不补造月额度或重置时间 |
| DeepSeek API / 登录账号 | 按币种显示可用余额;登录账号合计充值与赠送钱包 |
| OpenRouter | 总充值减去已用金额 |
| Moonshot 国内 / 国际 | 可用余额 |
| 其他服务或自定义代理 | 提示暂不支持查询 |

组件通过 `GET /opencode-go/usage?provider=<服务路由>&model=<模型>` 查询。Host 根据当前服务的实时配置解析凭据,不按模型名称猜测服务;缓存按服务、模型、凭据分别隔离,密钥不进浏览器。未配置凭据、未登录、接口失败各有对应状态。

`llm-pi-ai` 配置的 GO 路由优先使用该路由自己的凭据;仅当它与额度来源中的账号及网关一致时才复用原有 GO 来源设置。旧版 DSH(没有模型选择服务)、不带查询参数的请求以及 `/opencode-go` 命令,继续使用原有 GO 来源配置。

## 快速开始

### 环境要求

- DSH `0.1.7` 及以上(含 `0.2.0` 线),目标 profile 至少启动过一次(如 `~/.dsh/profiles/web` 已存在)
- Node.js ≥ 18(需要 `fetch`),pnpm 可用(没有就先 `corepack enable`)
- OpenCode GO 订阅及其 API key(在 [opencode.ai/auth](https://opencode.ai/auth) 创建)
- 可选:同一 profile 里的 `dsh-opencode-go` 插件 —— 装了它,默认来源就会跟随该插件的当前账号;没装则自动回退内置提供商

### 从本地源码目录安装

```bash
# 装到目标 profile(web / desktop 均可,换成你实际用的 profile 名)
dsh plugin --profile web add /path/to/dsh-usage-meter

# 把 GO API key 存为 DSH credential → 在 ~/.dsh/.credentials.yaml 加一行:
#   OPENCODE_GO_API_KEY: sk-...

# 完全重启 DSH(不是刷新页面),浏览器再硬刷新(Cmd/Ctrl+Shift+R)
```

`dsh plugin add` 会自动把包的 `dsh.bundle.patch` 合并进 profile 的 bundle 层栈 —— **不需要手改 cordis.patch.yml,不需要软链**。装完即可看到小组件与 `/opencode-go` 命令。

> 本地目录是 `link:` 安装,模块从项目真实路径解析依赖。若报 `Cannot find package '@deepseek-ai/schemastery'`,在项目里建一个 junction 指向 profile 的副本即可(详见[开发](#开发))。

### 从 npm 注册表安装(已发布版本,1.5.0)

```bash
dsh plugin --profile web add @astervolans/dsh-opencode-go-usage
```

### 从 GitHub Packages 安装(镜像)

每次发布也会自动同步到 [GitHub Packages](https://npm.pkg.github.com)。该注册表**即使对公开包也要求认证**,先在 `.npmrc`(项目级或 `~/.npmrc`)写入至少有 `read:packages` 权限的 PAT:

```
@astervolans:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=你的_GITHUB_PAT
```

再执行与上面相同的 `dsh plugin --profile web add @astervolans/dsh-opencode-go-usage`。

两点提醒:

- GitHub 上的包**默认 private**(仓库公开也一样),首次发布后需在包设置页手动改为 public(Danger Zone → Change visibility);
- 安装需要 token,所以 npmjs.org(无需 token)始终是更省事的主路,GitHub Packages 是镜像而非替代。

## 使用

- **小组件**:直接看。侧栏收起 → 百分比徽标;展开 → 三条用量条 + 重置倒计时。标题显示 `dsh-opencode-go` 的当前账号(`OpenCode GO · <账号名>`),发生回退时带「内置」徽标。
- **命令**:任意对话输入 `/opencode-go`,输出三个窗口的文本。
- **切换额度来源**:侧栏 →「插件」→ 本应用包卡片、设置 → 插件 → 插件配置、或 profile patch,三处任一;改完即时生效。

## 配置项

所有字段都是 volatile:出现在 设置 → 插件 → 插件配置(`quotaSource` 还会出现在应用包设置页),改完即时生效、无需重启。

| 键 | 默认 | 说明 |
|---|---|---|
| `quotaSource` | `opencode-go` | 额度数字来源:`opencode-go`(优先 `dsh-opencode-go` 当前账号,失败自动回退内置)或 `builtin`(始终走 `${baseUrl}/v1/usage`);未知值归一化为 `opencode-go` |
| `apiKeyEnv` | `OPENCODE_GO_API_KEY` | API key 的 credential 引用 / 环境变量名(内置路径;`opencode-go` 模式回退时也用它) |
| `baseUrl` | `https://opencode.ai/zen/go` | 网关 base URL(内置路径) |
| `cacheMs` | `30000` | host 端上游缓存 TTL |
| `updateCheck` | `true` | 检查 npm 新版本(组件与命令只提示,插件不会自行升级) |
| `injectSessionHeader` | `true` | 为 GO 网关聊天调用注入运行时 `x-opencode-session` 头 |

> `quotaSource` 只是**偏好**而非保证:`opencode-go` 模式下探测失败仍会显示内置数字,并用徽标标注、在接口的 `fallback` 里说明原因。想彻底不探测就设为 `builtin`。

也可以直接在 profile patch 里配置:

```yaml
- id: dsh-opencode-go-usage
  config:
    cacheMs: 60000
    quotaSource: builtin   # 可选:强制走内置提供商
```

> volatile 标记是**带守卫**的:`.volatile()` 从 schemastery 3.18.4 起才有,而 DSH 解析插件依赖时**优先用 profile 里的副本**。若 profile 里仍是旧副本(3.18.2),插件照常启用并从条目读取配置,只是不会生成设置页、不能热改;重装插件或升级 profile 里的 `@deepseek-ai/schemastery` 即可恢复。

## 额度来源与回退

一个 volatile 配置项 `quotaSource` 决定数字来自哪里:

| `quotaSource` | 行为 |
|---|---|
| `opencode-go`(默认) | 通过 `dsh-opencode-go` 插件的 `opencodeGoUsage` host 服务读取当前账号用量;该插件缺失、被禁用、不兼容或读取失败时回退内置提供商并说明原因 |
| `builtin` | 始终走 1.x 路径:`${baseUrl}/v1/usage`,credential 取 `apiKeyEnv`;完全不接触 `dsh-opencode-go` |

`opencode-go` 模式下 host 按以下顺序探测,任一步失败都会记录原因:

1. 存在实时 loader 条目 `opencode-go`(或 `dsh-opencode-go`);
2. 该条目未被禁用;
3. `ctx.get("opencodeGoUsage")` 能解析出服务且带 `read()`;
4. `await read()` 返回三个窗口(rolling / weekly / monthly);
5. 从该条目的实时配置解析当前账号(`apiKeyEnv`,再按同一 `apiKeyEnv` 匹配 `accounts[]`),并从可解析的 `dsh-opencode-go/package.json` 读版本号。

任一步失败时路由仍返回 **HTTP 200**,但带 `source: "builtin"`、`requested: "opencode-go"`、`fallback` 对象与 `opencodeGo` 诊断块 —— 小组件显示内置数字并加以标注。只有**两个来源都失败**时才返回 502。`quotaSource: builtin` 不触发回退(根本没有探测),因此 `fallback` 为 `null`、也没有徽标。

### 回退原因

| `fallback.reason` | 含义 |
|---|---|
| `not-installed` | 没有实时 loader 条目 —— 本 profile 未安装,或尚未加载(装好后重启) |
| `entry-disabled` | 条目存在但在 profile 里被禁用 |
| `service-unavailable` | 条目已启用,但没有 `opencodeGoUsage` 或其缺少 `read()`(通常是 `dsh-opencode-go` 版本较旧) |
| `read-failed` | `read()` 抛错 —— 该插件自身的错误(例如其当前账号没有 credential),原文见 `fallback.message` |
| `invalid-response` | `read()` 返回值里没有三个有效窗口 |

### 账号显示

- 当前账号有名字时,小组件标题变为 `OpenCode GO · <账号名>`(展开面板与收起后的 rail 标题都是);账号没有名字时保持 `OpenCode GO`。
- 只有**真的发生回退**(请求 `opencode-go`、实际 `builtin`)才显示「内置」徽标,tooltip 里带原因与信息。主动固定 `builtin` 不算回退,不显示徽标;接口里的 `source` 始终表示实际生效的来源。

### 设置页

插件在 DSH 官方 **`plugins.bundle.config`** 槽位注册了配置页,以包名为 key:

**侧边栏 →「插件」面板 → `@astervolans/dsh-opencode-go-usage` 的卡片 → 配置页。**

页面提供:

- 两个来源的选择 —— **优先 dsh-opencode-go(当前账号)** 或 **DSH 内置提供商**,默认取当前 `quotaSource`;
- 由 `GET /opencode-go/settings` 驱动的状态面板:是否检测到 `dsh-opencode-go`、其版本、当前账号、服务可用性 / 兼容性、生效来源、回退原因与信息;
- **保存**(`POST /opencode-go/settings`,带 `{ patch: { quotaSource }, expectedRevision }`)与**重新加载**按钮,以及成功 / 失败 / 冲突提示。出现 revision 冲突说明配置在别处被改过(另一个标签页、设置表单、profile)—— 先重新加载再保存。

它与 **设置 → 插件 → 插件配置** 并存:两者改的是同一份条目配置,任一处保存都即时生效。该路由只接受 `quotaSource`,保存成功后 host 会让额度缓存失效,下一次小组件轮询即反映新来源 —— 无需重启。若 DSH 无法描述本插件的设置(条目 id / schemastery),该路由返回 503、页面会提示;此时改用 profile patch 设置 `quotaSource`。

## x-opencode-session 修复

OpenCode GO 网关拒绝缺少 `x-opencode-session` 头的聊天补全请求(`HTTP 400 MissingSessionID`),而 DSH 的 `llm-pi-ai` 适配器从不发送该头。与其修改 DSH 安装目录里的文件(每次升级都会被覆盖),本插件改为运行时注入:

- 一次性包装 `globalThis.fetch`;
- 监听 DSH 官方 `llm/stream` waterfall 事件,获取每次调用的会话 ID(`options.sessionId`,由 `dsh-agent-loop` 填充)。

网关 base 从**被调用 provider 自身的实时配置**解析(`llm-pi-ai.providers.<route>.baseURL`,缺省回退本插件的 `baseUrl`)—— 代码不硬编码任何域名 —— 因此只有发往该调用对应网关的请求才会收到该头,且值为真实的会话级 ID。

- 开关:配置项 `injectSessionHeader`(默认 `true`)。
- 可观测性:`GET /opencode-go/usage` 返回 `sessionHeader: { active, count, diag }`;`diag` 报告运行时观测,如 `streamSeen`(处理过的 `llm/stream` 调用数)、`lastStream`(provider、session-id 是否存在、base 及其来源)、`requests` / `injected` / `missed`(带上下文的 wire 请求数 / 实际注入数 / 因 URL 不匹配未注入数)。

## 工作原理

这是一个**双端 DSH 插件包**:

| 端 | 文件 | 职责 |
|---|---|---|
| host(Node) | `lib/index.js` | 注册 `/opencode-go/usage` 路由与 `/opencode-go/settings` 一对路由(`ctx.webServer`),以及 `/opencode-go` 命令(`ctx.commands`);解析额度来源(优先 `dsh-opencode-go` 的 `opencodeGoUsage` 服务,失败回退内置)并经 DSH credentials 解析 key;上游调用带缓存(默认 30s,按来源 + 账号区分) |
| 浏览器 | `lib/client.js` | 手写的 `window.__ModuleLoader__.load({ id, factory })` bundle,等待 `sidebar.footer.action` 列表槽与 `plugins.bundle.config` 槽就绪后注册,每 60s 轮询同源路由 |

### 侧边栏小组件如何加载

DSH `0.1.7-rc` 起通过官方 client-modules 扫描装载组件:包的 `dsh.client` 声明 + `exports["./client"]` 按 loader entry 自动识别,bundle 由 `/plugins/...` 组合路由提供,boot graph 行由 host 自己写进 `window.__DSH_BOOT__` 清单 —— 无需手工打包或注入 index。(更早的 `0.1.1` / `0.1.2` 线用自托管 `/dsh-opencode-go-usage/client.js` 路由 + `webServer.tapIndex` 行注入;该机制已移除,因为 `0.1.7-rc` 把数组形 boot 清单改成了 `{ rev, entries, batches }` 对象,只能由 client-modules 生成。)

## 兼容性

| 插件版本 | DSH 运行时 | host 端 | 浏览器端 |
|---|---|---|---|
| **1.6.0**(本源码树) | `0.1.7` 及以上,含 `0.2.0` 线 | 同 1.5.0,另加经 `opencodeGoUsage` 的额度来源探测,以及 `GET` / `POST /opencode-go/settings` 路由 | 同 1.5.0,另加 `plugins.bundle.config` 槽位注册(应用包设置页)与账号 / 回退显示 |
| 1.5.0 | `0.1.7` 及以上,含 `0.2.0` 线 | loader 读取导出的 `Config` schema;配置取自插件条目(不再调用 `ctx.settings.register` / `settings.get`) | 由 client-modules 依据包的 `dsh.client` 声明自动装配 |
| 1.4.0 | `0.1.7-rc.1`、`0.1.7-rc.2` | 同 1.5.0 | 同 1.5.0 |
| 1.3.3 | `0.1.1-rc.2`、`0.1.2-alpha.2`(`0.1.7` 之前的版本线) | `ctx.settings.register` 注册命名空间 + `ctx.settings.get` 读取 | 自托管 bundle 路由 + `webServer.tapIndex` 注入启动图行 |

支持的运行时写进了 `peerDependencies`:

```json
"peerDependencies": {
  "@deepseek-ai/schemastery": "^3.18.4",
  "@deepseek-ai/dsh": ">=0.1.7-rc.1 <0.3.0"
}
```

`dsh-opencode-go` 本身是**可选**的,也没有声明为依赖:`opencode-go` 模式下 host 运行时探测它,没有安装属于正常回退(`not-installed`),不是错误。想让小组件跟随其当前账号,就在同一个 profile 里装上它。

DSH 会在条目启用前用该范围校验当前运行时。从 `0.2.0` 起这是**硬闸门**:所有 `@deepseek-ai/dsh` / `@deepseek-ai/dsh-*` peer 都会带 `includePrerelease` 参与判定,不匹配则**整行被禁用**(宿主日志写 `disabling profile plugin row …`),而不是半死不活地跑着。因此窗口写成 `>=0.1.7-rc.1 <0.3.0`,同时覆盖 `0.1.7` 线与整条 `0.2.0` 线;1.4.0 的写法 `0.1.7-rc.1 || 0.1.7-rc.2` 做不到 —— 任何 `0.1.x` 范围的上界都是 `<0.2.0`。若运行时不在此列,请改装对应版本的插件(`0.1.7` 之前用 `1.3.3`),或显式接受风险后重启 DSH:

```bash
dsh plugin allow-version     # 为 name@version 在本 dsh 版本上授予精确版本豁免
```

在受支持版本上还有三点运行时说明:

- **设置页 / 热改 / 旧配置迁移** —— volatile 字段需要 schemastery ≥ `3.18.4`。两个官方包都按约定声明为 peer 而非 dependency,全新安装会解析到 DSH 自带的那份;若 profile 里仍 hoist 着旧的 `3.18.2`,则不会生成设置页、不能热改,旧的 `~/.dsh/settings.yaml` 段落也不会被迁移(留在 `settings.yaml.imported`)。两种情况插件都照常启用,并从 profile 条目读取配置(见[配置项](#配置项))。
- **小组件** —— 全程无需手工打包或注入 index:host 依据包的 `dsh.client` 声明装配组件,并从 `/plugins/...` 组合路由提供(见[侧边栏小组件如何加载](#侧边栏小组件如何加载))。
- **应用包设置页** —— 1.6.0 的设置页通过 `plugins.bundle.config` 槽位渲染,已在 `0.2.1-rc.4` host(Desktop Next `2.0.21-next`)上验证。若你的运行时不提供该槽位,请改用 设置 → 插件 → 插件配置 或 profile patch 配置 `quotaSource`;小组件与 `/opencode-go` 命令不受影响。

## HTTP 接口

### 上游用量 API

`GET https://opencode.ai/zen/go/v1/usage`,带 `Authorization: Bearer <key>`:

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

小组件与命令从不直接访问网关,由 host 代理并附加信息。

**`GET /opencode-go/usage`** —— 在 1.5.0 字段(`usage`、`update`、`sessionHeader`)之外,1.6.0 新增:

| 字段 | 含义 |
|---|---|
| `source` | `usage` 里数字的实际来源:`opencode-go` 或 `builtin` |
| `requested` | 配置的 `quotaSource` |
| `account` | `dsh-opencode-go` 的当前账号:`{ ref, id, name }`(`builtin` 模式下为配置的 ref) |
| `fallback` | `null`;或插件路径失败改用内置时的 `{ from: "opencode-go", reason, message }` |
| `opencodeGo` | 检测信息:`{ detected, version, entryFound, enabled, service, compatible, reason, message }` |
| `lastSwitch` | `dsh-opencode-go` 最近一次账号切换(`fromRef`、`toRef`、`reason`、`at`),没有则为 `null` |

两个来源都失败时返回 **HTTP 502** —— `{ error, requested, opencodeGo, fallback }`。

**`GET /opencode-go/settings`** —— 返回 `{ ok, namespace, revision, value, base, user, detection }`;`value` 是脱敏后的配置,`detection` 另含 `dsh-opencode-go` 的账号列表与生效来源。DSH 无法描述本插件设置时返回 503。

**`POST /opencode-go/settings`** —— 请求体 `{ patch: { quotaSource }, expectedRevision }` → `{ ok, revision, detection }`。只接受 `quotaSource`;`expectedRevision` 过期返回 `409`,请求体 / 取值非法返回 `400`,跨源 `Origin` 返回 `403`。

## 开发

- **测试**:`npm test`(即 `node test/run.mjs`,全部离线运行)。
- **浏览器端**是手写的 factory bundle(`window.__ModuleLoader__.load`),因为目前第三方 client 插件还没有公开的构建流水线。它只能 `require()` shell 模块表里的模块(`react`、`react/jsx-runtime` 以及已注册的 client 包)。直接改 `lib/client.js`,重启 DSH 并刷新页面 —— bundle 的 revision hash 会变化,shell 自动加载新文件。
- **host 端**(`lib/index.js`)的改动只需重启 DSH。
- 1.6.0 的应用包设置页是同一个 bundle 里的第二处注册(`plugins.bundle.config`,以包名为 key)。组件按 `props.view` 分支:`summary` 必须返回纯字符串(插件面板卡片内联渲染),`page` 才挂载设置组件。两端都走同一组 `/opencode-go/...` 路由 —— 设置页不直接读配置,而是经 `GET` / `POST /opencode-go/settings`。

### 本地 link 安装的依赖解析

`dsh plugin add <本地目录>` 以 pnpm `link:` 协议挂载,模块从**项目真实路径**解析依赖,而 `lib/index.js` 引用了 `@deepseek-ai/schemastery`(peer)。若从项目路径向上找不到该包,导入会报 `ERR_MODULE_NOT_FOUND`。解决办法是在项目里建一个 junction 指向 profile 的 hoisted 副本(Windows 示例,无需管理员权限):

```bash
node -e "const fs=require('fs');fs.mkdirSync('node_modules/@deepseek-ai',{recursive:true});fs.symlinkSync(process.env.USERPROFILE+'/.dsh/profiles/<profile>/node_modules/@deepseek-ai/schemastery','node_modules/@deepseek-ai/schemastery','junction')"
```

`node_modules/` 已在 `.gitignore` 中,不会进入仓库。验证:`node --input-type=module -e "await import('@astervolans/dsh-opencode-go-usage')"`(在 profile 目录执行)。

## 常见问题

- **重启后小组件不出现** → 硬刷新页面(`Cmd/Ctrl+Shift+R`);启动图是按页面加载注入的。
- **`/opencode-go/usage` 返回 502 且提示 no API key** → 在 `~/.dsh/.credentials.yaml` 配置 key。
- **网关 401 / 403** → key 无效或订阅过期;检查 credential。
- **小组件显示错误串** → 悬停收起态徽标,或展开态小组件里的错误行。
- **装了 `dsh-opencode-go` 但仍回退到内置** → `curl -s http://127.0.0.1:3080/opencode-go/usage` 看 `source`、`fallback` 与 `opencodeGo` 块,按 `fallback.reason` 处理:`not-installed` → 装到同一个 profile,或重启让它加载;`entry-disabled` → 在 设置 → 插件 里启用;`service-unavailable` → 升级 `dsh-opencode-go`;`read-failed` / `invalid-response` → 是该插件自身报错或返回结构不对,原文在 `fallback.message`。不想让它探测就设 `quotaSource: builtin`。
- **小组件标题没有账号名** → 正常现象:`dsh-opencode-go` 缺失(回退)或其当前账号没有 `name`;可看接口里的 `account.name` 确认。
- **启动失败,日志有 `Identifier 'PACKAGE_NAME' has already been declared`** → 客户端 bundle 在 shell 的共享脚本作用域里声明了顶层同名常量(与 `@astervolans/dsh-literature-search` 等插件冲突),整个 web boot 会被判定失败。1.6.x 当前源码已把该名称移入 factory 内部;重新安装本源码并完全重启 DSH 即可。若同时使用 `dsh-literature-search`,也请确保它来自当前版本。

## License

MIT
