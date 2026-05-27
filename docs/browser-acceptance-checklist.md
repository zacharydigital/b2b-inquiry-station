# 浏览器视觉验收流程 / Browser Visual Acceptance

本项目使用 Codex 已安装的 Playwright CLI skill 做本地浏览器验收。当前阶段不引入 `@playwright/test`，不新增项目级 Playwright 依赖，也不把视觉验收接入 Cloudflare Pages build。

## 目标

这套流程用于验证外贸 B2B 询盘型母版的真实浏览器表现：

- 桌面 PDP 的右侧 sticky inquiry sidebar 是否可见。
- 移动端 bottom sticky CTA 是否可见且不溢出。
- 三类 vertical 的 `data-vertical` overlay 是否输出正确。
- `btn-inquiry` 是否出现在询盘转化路径。
- materials / consumer-oem 的正式 PDP 模块是否实际渲染。
- `/design-system/` 内部规范页是否可读。
- `/admin/inquiries` 后台 shell、lead grade 筛选和 CSV 导出入口是否可见。

## 为什么不用项目依赖

当前使用的是 Codex skill wrapper：

```bash
$HOME/.codex/skills/playwright/scripts/playwright_cli.sh
```

它通过 `npx --package @playwright/cli playwright-cli` 运行，不需要在项目里安装：

```text
@playwright/test
playwright
```

这样不会影响：

- Cloudflare Pages build 命令。
- Astro production bundle。
- 项目依赖体积。
- 当前 `pnpm test` / `pnpm build` / `pnpm check:local`。

后续只有在需要 CI、PR 自动截图、团队统一 E2E 流程时，再考虑引入 `@playwright/test`。

## 前置条件

确认 `npx` 可用：

```bash
command -v npx >/dev/null 2>&1 && echo npx-ok
```

确认 Codex Playwright CLI wrapper 存在：

```bash
test -f "$HOME/.codex/skills/playwright/scripts/playwright_cli.sh" && echo playwright-cli-wrapper-ok
```

## 本地运行

先启动 Astro dev server：

```bash
pnpm dev --host 127.0.0.1
```

在另一个终端运行视觉验收：

```bash
pnpm accept:visual
```

如果需要打开真实浏览器窗口辅助人工检查：

```bash
pnpm accept:visual -- --headed
```

如果本地端口不是 `4321`：

```bash
BASE_URL=http://127.0.0.1:3000 pnpm accept:visual
```

## 输出文件

截图和摘要输出到：

```text
output/playwright/visual-acceptance/
```

当前会生成：

```text
desktop-machinery-pdp.png
desktop-materials-pdp.png
desktop-oem-pdp.png
mobile-materials-sourcing.png
mobile-oem-pdp.png
desktop-design-system.png
desktop-admin-inquiries.png
summary.md
```

`output/playwright/` 已在 `.gitignore` 中忽略，截图默认不提交。

## 验收页面

脚本会检查这些页面：

```text
/products/planetary-gearbox-hg-series/
/products/pa66-gf30-engineering-plastic/
/products/custom-stainless-water-bottle-oem/
/materials/pa66-gf30-supplier/
/design-system/
/admin/inquiries?token=local-admin
```

关键断言包括：

- `body[data-vertical="machinery"]`
- `body[data-vertical="materials"]`
- `body[data-vertical="consumer-oem"]`
- `Request a Quote`
- `Request Sample`
- `Get OEM Quote`
- `Get Bulk Price`
- `What Can Be Customized for OEM / ODM`
- `Options Buyers Can Compare Quickly`
- `Technical data`
- `B2B Inquiry Design System`
- `Inquiry inbox`
- `#lead_grade`
- `Export CSV`

## 视觉问题修复流程

如果页面视觉出现问题：

1. 运行 `pnpm accept:visual -- --headed`。
2. 查看 `output/playwright/visual-acceptance/` 的截图。
3. 使用 Codex 应用快照功能定位具体视觉问题。
4. 修改对应组件、tokens 或页面数据。
5. 运行：

```bash
pnpm check:local
pnpm accept:visual
```

6. 确认新的截图不再出现遮挡、溢出、错位、CTA 消失、vertical overlay 错误等问题。

## 不替代的检查

浏览器视觉验收不替代：

```bash
pnpm test
pnpm build
pnpm check:design-system
```

推荐本地完整验收顺序：

```bash
pnpm check:local
pnpm dev --host 127.0.0.1
pnpm accept:visual
```

## 后续升级条件

只有当出现以下需求时，才建议引入 `@playwright/test`：

- 需要 GitHub Actions / CI 自动跑浏览器测试。
- 需要 PR 自动上传截图、trace、video。
- 多人协作需要统一 E2E 测试规范。
- 需要视觉 snapshot baseline 或差异对比。

在那之前，本项目保持 Codex Playwright CLI skill 方案。
