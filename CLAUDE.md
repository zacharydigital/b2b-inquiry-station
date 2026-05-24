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
pnpm dev          # astro dev (static mode)
pnpm build        # astro build (static mode, local)
pnpm preview      # astro preview
pnpm test         # npx vitest run
```

## Component Architecture

```
src/components/
├── ui/           BaseLayout, Header, Footer, MobileNav, CTADock, Gallery,
│                 Breadcrumb, ProductCard, ParamFilter, DownloadsSection,
│                 FAQAccordion, RelatedProducts, FinalCTA, KeyCommercialTerms,
│                 SEOHead, LocaleSwitcher
├── trust/        QuantifiedStrip, CertLogoWall, ClientLogoWall,
│                 TestimonialCards, ProdFlowDiagram, TeamPhotoCards,
│                 ManufacturingQC, CaseStudy
├── fab-e/        FABENarrative, Specifications, Applications
└── inquiry/      StickyInquirySidebar, InlineInquiryForm, FullInquiryForm,
                  QuickQuotePop, EmailGateModal, QuoteCartPanel, QuoteCartButton
```

**Rules**:
- Astro 组件用 PascalCase 文件名
- Props 用 `export interface Props` 定义在 frontmatter 内
- 导入路径用相对路径 `../../components/...`
- CSS tokens 在 `src/styles/tokens.css`，UnoCSS shortcuts 在 `uno.config.ts`

## Page Structure (v1, 9 pages)
```
/                              Home (六段叙事)
/products/                     PLP (参数筛选+产品卡片)
/products/[slug]/              PDP (13区块 FAB-E + 询盘)
/contact/                      全功能询盘表单
/thank-you/                    转化确认页
/compare/                      产品对比表
/certifications/               认证证书展示
/get-a-quote/                  独立CTA落地页
/404                           404
/api/inquiry                   POST 询盘提交
/api/download-gate             POST 资料下载Email Gate
/api/quote-cart                POST 批量RFQ
```

## Design Tokens (src/styles/tokens.css)
```css
--color-primary: #1A4F86 (钢蓝)
--color-accent: #E8651A (橙色CTA)
--color-gray-warm: #F7F7F6 (暖灰底)
--font-sans: Inter
--font-mono: JetBrains Mono
--radius-card: 8px / --radius-button: 6px / --radius-input: 4px
```

## API Patterns
- Astro API routes: `src/pages/api/*.ts` → POST handlers
- Honeypot 字段 `website_url` 用于反垃圾
- 邮箱 MX 校验 + disposable domain 检测
- Cloudflare D1 write + Resend 双邮件（通知+确认）
- 文件上传 → R2，10MB 上限

## Routing
- v1 单行业，全部根路径路由（无 `/machinery/en/` 前缀）
- dev build: static 模式 (无 Cloudflare adapter)
- Cloudflare Pages build: server 模式 (`CF_PAGES=1` 自动切换)
