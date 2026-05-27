# B2B Inquiry Station

Astro 6.3 SSG + UnoCSS + Cloudflare Pages 的外贸 B2B 询盘型独立站母版。

## Tech Stack
- **Framework**: Astro 6.3 (static output local, server + @astrojs/cloudflare on deploy)
- **CSS**: UnoCSS (Atomic CSS with Wind preset)
- **Deploy**: Cloudflare Pages + D1 + R2 + Resend
- **State**: nanostores (client-side islands)
- **Test**: Vitest
- **Package**: pnpm

## Commands
```bash
pnpm dev                  # astro dev (static mode)
pnpm build                # astro build (static mode, local)
pnpm preview              # astro preview
pnpm test                 # vitest run
pnpm check:design-system  # 三路 guardrail：contract + brand overlay + hardcode
pnpm check:local          # test + build + check:design-system（完整本地检查）
pnpm accept:local         # Playwright 浏览器验收（需本地浏览器环境）
```

## Component Architecture

```
src/components/
├── ui/           BaseLayout, Header, Footer, MobileNav, CTADock, Gallery,
│                 Breadcrumb, ProductCard, ParamFilter, DownloadsSection,
│                 FAQAccordion, RelatedProducts, FinalCTA, KeyCommercialTerms,
│                 SEOHead, LocaleSwitcher
├── inquiry/      StickyInquirySidebar, InlineInquiryForm, FullInquiryForm,
│                 InquiryFields, InquiryCTA, ConversionPanel, TrustReassurance,
│                 RFQProgress, QuickQuotePop, EmailGateModal, QuoteCartPanel,
│                 QuoteCartButton
├── trust/        QuantifiedStrip, CertLogoWall, ClientLogoWall,
│                 TestimonialCards, ProdFlowDiagram, TeamPhotoCards,
│                 ManufacturingQC, CaseStudy
├── fab-e/        FABENarrative, Specifications, Applications
├── pdp/          ChannelFit, ComplianceDocuments, TechnicalData,
│                 Customization, Variants
└── seo/          SourcingPageTemplate
```

**Rules**:
- Astro 组件用 PascalCase 文件名
- Props 用 `export interface Props` 定义在 frontmatter 内
- 导入路径用相对路径 `../../components/...`
- CSS tokens 在 `src/styles/tokens.css`，UnoCSS shortcuts 在 `uno.config.ts`

## Page Structure (v1)
```
/                              Home（六段叙事：Hook→Proof→Fit→Trust→Terms→Convert）
/products/                     PLP（参数筛选 + 产品卡片 + Buying Guide）
/products/[slug]/              PDP（13 区块 FAB-E + 信任证据 + 询盘转化）
/about/                        关于我们
/contact/                      全功能询盘表单
/thank-you/                    转化确认页
/compare/                      产品对比表
/certifications/               认证证书展示
/get-a-quote/                  独立 CTA 落地页（RFQ）
/applications/                 应用场景
/materials/                    材料垂直 sourcing pages
/oem/                          OEM/ODM 垂直 sourcing pages
/design-system/                内部设计系统展示页
/admin/                        管理后台
/404                           404
/api/inquiry                   POST 询盘提交 + GET 405
/api/download-gate             POST 资料下载 Email Gate + GET 405
/api/quote-cart                POST 批量 RFQ + GET 405
```

## Design Tokens (src/styles/tokens.css)

Token 系统是 B2B Inquiry Interface Contract，被 Astro 组件、UnoCSS shortcuts、nanostores 组件和未来 React islands 共同消费。

### 核心颜色
```css
--color-primary: #0f62fe         /* 蓝色：导航、链接、focus、技术证明 */
--color-primary-hover: #0353e9
--color-accent: #e85d1c          /* 橙色：仅用于询盘转化路径（RFQ/CTA/inquiry） */
--color-canvas: #ffffff          /* 白色画布 */
--color-surface-1: #f4f4f4       /* 浅灰表面 */
--color-ink: #161616             /* 深色正文 */
--color-ink-muted: #525252       /* 次级文字 */
--color-hairline: #e0e0e0        /* 分割线 */
--color-success: #24a148         /* 成功 */
--color-warning: #f1c21b         /* 警告 */
--color-error: #da1e28           /* 错误 */
```

### 排版
```css
--font-sans: 'Inter', 'Noto Sans SC', 'Helvetica Neue', Arial, system-ui, sans-serif;
--font-mono: 'SFMono-Regular', 'Roboto Mono', Consolas, monospace;
--text-display: 3.75rem;  --text-heading: 2.625rem;  --text-subhead: 1.25rem;
--text-body: 1rem;         --text-caption: 0.875rem;  --text-small: 0.75rem;
```
- 移动端 `--text-display: 2.125rem`，`--text-heading: 1.5rem`
- Body letter-spacing: `0.16px`
- 句首大写，禁止负 letter-spacing

### 关键尺寸
```css
--radius-card: 8px;     --radius-button: 4px;     --radius-input: 4px;
--container-page: 1584px;  --container-content: 960px;
--sidebar-width: 360px;    --header-height: 48px;   --mobile-dock-height: 72px;
--section-padding-block: 96px;  /* mobile: 56px */
```

### Token 优先级（冲突裁决）
1. conversion tokens（询盘转化）
2. accessibility, error, focus safety（可访问性安全）
3. vertical overlay（行业覆盖）
4. brand overlay（品牌覆盖，仅 `--brand-*` 白名单）
5. component styling（组件样式）

### 禁止规则
- 橙色仅用于询盘 CTA，不得用于导航/标签/装饰
- 禁止硬编码 `z-40`/`z-50`/raw overlay/shadow/motion 值在核心组件中
- 第三方库（Headless/Radix/Uppy）不得接管视觉语言
- Brand overlay 不得覆盖 conversion、error、focus、a11y token

## Vertical Overlays

三个行业垂直，通过 `data-vertical` 属性切换：

| Vertical | Primary | Accent | 定位 |
|---|---|---|---|
| `machinery` | `#0f62fe` | `#e85d1c` | 工程技术信任 |
| `materials` | `#007d79` | `#e85d1c` | 合规安全可追溯 |
| `consumer-oem` | `#0f62fe` | `#ff6f00` | 产品定制零售 |

垂直覆盖可调整 PDP 模块顺序、表单字段、CTA 文案，但不重新定义核心系统。

## Design System Guardrails

三路检查由 `pnpm check:design-system` 执行：
- `scripts/validate-design-system.mjs` — token 契约完整性 + form/CTA/conversion primitive 检测
- `scripts/validate-brand-overlay.mjs` — brand 仅覆盖白名单 token，保护 conversion/a11y 边界
- `scripts/validate-component-hardcode.mjs` — Phase 1 组件无硬编码 z-index/overlay/shadow/motion

Token 契约定义在 `src/lib/design-token-contract.ts`，JSON 导出在 `src/pages/design-system/tokens.json.ts`。

## API Patterns
- Astro API routes: `src/pages/api/*.ts` → POST + GET 405（显式 fallback 消除 Astro build warning）
- Honeypot 字段 `website_url` 用于反垃圾
- 邮箱 MX 校验 + disposable domain 检测
- Cloudflare D1 write + Resend 双邮件（通知 + 确认）
- 文件上传 → R2，10MB 上限

## Routing
- v1 单行业，根路径路由（无 `/machinery/en/` 前缀）
- dev build: static 模式（无 Cloudflare adapter）
- Cloudflare Pages build: `CF_PAGES=1` 自动切换 server 模式

## Key Lib Modules
```
src/lib/
├── design-token-contract.ts  # Token 契约定义 + TS 类型
├── design-tokens.ts          # Token 序列化导出
├── brand-overlay.ts          # Brand 运行时覆盖 + 保护 token 校验
├── verticals.ts              # 垂直行业配置（PDP 模块顺序/表单字段/CTA）
├── inquiry-form-state.ts     # 表单状态管理（验证/条件字段/提交状态）
├── inquiry.ts                # 询盘 API 处理
├── products.ts               # 产品数据 + 筛选
├── sourcing-pages.ts         # 多行业 Sourcing Pages 生成
├── admin-inquiries.ts        # 管理后台询盘查询
├── seo.ts                    # SEO meta 生成
├── i18n.ts                   # 国际化
├── store.ts                  # nanostores 全局状态
└── types.ts                  # 共享 TypeScript 类型
```
