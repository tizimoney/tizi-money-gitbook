# 从 deployments 同步 GitBook 地址

使用 Node.js 18 或更新版本，无需安装依赖。

已根据同级 `whitepaper/deployments/deployments` 中的实际部署文件实现。文件结构如下：

```text
deployments/
  base_mainnet/
    DepositHelper.json
    StakedTD.json
  sei_mainnet/
    ChildstTD.json
```

每个 JSON 从顶层 `address` 字段提取地址，例如：

```json
{ "address": "0x1111111111111111111111111111111111111111" }
```

脚本以 `users-guide/he-yue-di-zhi.md` 中的链标签及表格名称为准，默认加载 `scripts/deployment-mappings.json`，映射七条链的目录名及 `SubValut → SubVault`。链目录忽略大小写，合约文件名精确匹配；例如 `StakedTD` 读取 `StakedTD.json`，不取 `_Implementation`、`Update` 或其他相似文件。它同步更新显示地址和浏览器链接，保留链接参数、GitBook 标签、其他列及原有格式。只更新已有条目，不自动添加未列出的策略。当前 `Strategies` 页面没有具体策略名称或地址表，默认不向该页面插入内容。

在仓库根目录运行，先预览：

```powershell
node scripts/sync-deployment-addresses.mjs --strict
```

实际写入：

```powershell
node scripts/sync-deployment-addresses.mjs --strict --write
```

省略 `--deployments` 时优先使用仓库根目录下的 `deployments`；不存在时使用同级 `../whitepaper/deployments/deployments`。也可通过 `--deployments "C:\path\to\deployments"` 指定实际包含各链目录的路径。可用 `--document` 指定其他使用相同 GitBook tabs 和 HTML 地址表格式的文件。

未匹配的条目会报告并保持原样；`--strict` 要求所有文档条目均匹配，否则不写入。地址格式错误、零地址、JSON 错误或同名网络目录歧义也会终止写入。脚本不验证链上部署，不提交或推送 Git。

若部署名称不同，可编辑默认映射文件，或通过 `--config mappings.json` 替换整份配置。配置键使用 GitBook 中的原始名称，值使用实际目录名或 JSON 文件名（不含 `.json`）。自定义配置示例：

```json
{
  "networks": { "Base": "base-mainnet" },
  "contracts": { "SubValut": "SubVault" },
  "contractsByNetwork": { "Base": { "StakedTD": "StakedTD_Proxy" } }
}
```

链专属名称映射优先于全局名称映射。网络目录应直接位于 `deployments` 下；脚本不递归搜索历史部署，以免取错版本。

验证：

```powershell
node --test scripts/sync-deployment-addresses.test.mjs
```
