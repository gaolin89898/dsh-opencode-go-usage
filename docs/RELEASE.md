# 发布流程

正式名称为 **dsh-usage-meter**，安装包发布在本仓库的 [GitHub Releases](https://github.com/gaolin89898/dsh-usage-meter/releases)。

npm 上的无 scope 包 `dsh-usage-meter` 属于其他维护者，不能用于本仓库发布或安装。本项目的更新检查仅查询本仓库的 GitHub Releases。

## 发布

在干净的工作区执行：

```bash
./scripts/release.sh patch
```

脚本会运行回归测试和语法检查、递增版本、生成安装包与 SHA-256、提交、明确推送到 `origin/main`，然后创建版本 tag 和 GitHub Release。需要 Node.js、npm、Git 与已登录的 GitHub CLI；离线测试所需的 schemastery 解析见 `test/support/loader.mjs`。

每次发布前同步 README 与安装指南中的版本号。也可以先手动更新所有版本，再执行 `./scripts/publish.sh` 发布当前版本。

GitHub Actions 对 main 推送执行回归测试、语法检查与打包；Release 发布后会再次核对 tag 和包版本，并上传安装包及校验文件。无需 npm 登录或 npm token。

## 命名与兼容

- `package.json.name`、客户端 module-loader id、配置页 key 和 bundle 的 `name` 必须一致，均为 `dsh-usage-meter`。
- bundle 的 entry id 与 settings namespace 保留 `dsh-opencode-go-usage`，让已有配置继续生效。
- HTTP 路径与聊天命令仍使用 `/opencode-go`。
- 从旧版升级时请遵循[安装指南](INSTALL.zh.md)，避免同时启用两个插件副本。
