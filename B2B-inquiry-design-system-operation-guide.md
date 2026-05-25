# B2B 询盘型独立站母版系统操作教程

本文档用于说明当前本地工作区代码改动的目的、模块结构、配置方式和后续维护方法。

这批改动的核心目标是：把网站从一个固定的机械类 B2B 产品页面，升级成一套可配置的 B2B 询盘型独立站母版系统。

系统主线：

```text
产品 vertical 配置
  -> 行业视觉 tokens
  -> PDP 模块顺序
  -> 询盘表单字段 schema
  -> API 保存通用字段 + 行业专属 extra fields
  -> 销售邮件展示采购关键信息
```

## 1. 当前实现状态

这批代码目前写在本地工作区，还没有提交为新的 commit。

已经提交的本地 commit 主要是 spec 文档：

```text
9dca125 Make design spec brand neutral
f86e0fb Clarify B2B design language decision
deb9741 Add B2B inquiry design system spec
```

当前这批实现代码涉及 `src/`、`migrations/`、`uno.config.ts`、`src/styles/tokens.css` 等文件。下面这些文件是手动创建或替换内容，不属于本次设计系统实现范围，应在提交时忽略，除非明确需要一起提交：

```text
design.md
.github/
HP-design.md
IBMCarbon-design.md
```

## 2. 系统核心概念

### 2.1 Product Vertical

`vertical` 表示产品所属行业类型。目前支持三类：

```ts
type ProductVertical = 'machinery' | 'materials' | 'consumer-oem';
```

三类含义：

| vertical | 适用场景 | 页面重点 |
|---|---|---|
| `machinery` | 机械、设备、零部件、工业产品 | 规格、应用、制造能力、QC、交期、MOQ |
| `materials` | 材料、化工、原料、配方、添加剂 | 技术数据、COA、SDS、样品、法规、批量报价 |
| `consumer-oem` | 消费品、OEM、ODM、私标、批发 | 变体、包装、Logo、MOQ、渠道、目标市场 |

现有产品默认全部按 `machinery` 处理。

### 2.2 三层配置

这套系统有三层：

| 层级 | 文件 | 作用 |
|---|---|---|
| 视觉层 | `src/styles/tokens.css`、`uno.config.ts` | 控制颜色、字体、按钮、表单、卡片、行业 overlay |
| 业务配置层 | `src/lib/verticals.ts`、`src/lib/pdp.ts` | 控制行业配置、PDP 模块顺序、表单字段 |
| 页面和数据层 | `src/pages/products/[slug].astro`、`src/pages/api/inquiry.ts` | 按配置渲染页面，并保存询盘数据 |

## 3. 文件改动说明

### 3.1 `src/styles/tokens.css`

作用：定义全站设计 tokens 和三类行业视觉 overlay。

主要新增内容：

```css
--color-primary
--color-accent
--field-bg
--field-border
--field-focus-ring
--button-primary-bg
--button-inquiry-bg
--card-bg
--sidebar-bg
--mobile-cta-bg
```

这些 tokens 的作用：

| token | 作用 |
|---|---|
| `--color-primary` | 蓝色主色，用于普通主操作、链接、focus、技术证明 |
| `--color-accent` | 橙色强调色，只用于询盘转化路径 |
| `--field-bg` | 表单输入框背景 |
| `--field-border` | 表单默认边框 |
| `--field-focus-ring` | 表单 focus 状态 |
| `--button-primary-bg` | 普通蓝色按钮背景 |
| `--button-inquiry-bg` | 橙色询盘按钮背景 |
| `--card-bg` | 卡片背景 |
| `--sidebar-bg` | sticky 询盘侧栏背景 |
| `--mobile-cta-bg` | 移动端底部 CTA 背景 |

行业 overlay：

```css
[data-vertical="machinery"] { ... }
[data-vertical="materials"] { ... }
[data-vertical="consumer-oem"] { ... }
```

操作方式：

如果要调整机械类页面主色，改：

```css
[data-vertical="machinery"] {
  --vertical-primary: #0f62fe;
}
```

如果要调整询盘 CTA 颜色，改：

```css
--color-orange-60: #e85d1c;
```

注意：橙色只用于询盘转化按钮，不应用于普通链接、标签、装饰元素。

### 3.2 `uno.config.ts`

作用：定义 UnoCSS shortcuts，也就是复用型 UI 类。

主要改动：

```ts
btn-primary
btn-inquiry
btn-outline
form-control
quote-panel
metric-card
product-card
```

按钮语义：

| class | 用途 |
|---|---|
| `btn-primary` | 蓝色普通主操作，如浏览、导航、普通页面动作 |
| `btn-inquiry` | 橙色询盘转化动作，如 Request a Quote、Send RFQ、Get OEM Quote |
| `btn-outline` | 次级动作，如 Add to Quote Cart、WhatsApp、查看资料 |

操作方式：

如果一个按钮是询盘动作，使用：

```astro
<a class="btn-inquiry" href="#inline-inquiry">Request a Quote</a>
```

如果一个按钮只是普通浏览动作，使用：

```astro
<a class="btn-primary" href="/products/">View Products</a>
```

不要把所有按钮都改成橙色。橙色必须保留给最重要的询盘路径。

### 3.3 `src/components/ui/BaseLayout.astro`

作用：全站布局入口，负责给页面输出行业标识。

新增 props：

```ts
vertical?: ProductVertical;
mobileCtaHref?: string;
```

页面最终会输出：

```html
<body data-vertical="machinery">
```

这个 `data-vertical` 会触发 `tokens.css` 里的行业 overlay。

操作方式：

如果页面是材料类：

```astro
<BaseLayout vertical="materials">
  ...
</BaseLayout>
```

如果页面是 OEM/ODM：

```astro
<BaseLayout vertical="consumer-oem">
  ...
</BaseLayout>
```

产品详情页不需要手动写死，它会从产品数据读取 `product.vertical`。

### 3.4 `src/components/ui/CTADock.astro`

作用：移动端底部 sticky CTA。

主要改动：

- 接收 `vertical`。
- 根据行业读取移动端 CTA 文案。
- 主按钮使用 `btn-inquiry`。
- 保留 WhatsApp 作为第二动作。

不同 vertical 的移动端 CTA 文案示例：

| vertical | mobile CTA |
|---|---|
| `machinery` | Send RFQ |
| `materials` | Get Bulk Price |
| `consumer-oem` | OEM Quote |

操作方式：

如果希望某个产品页移动端 CTA 点击后跳到页内询盘表单：

```astro
<BaseLayout mobileCtaHref="#inline-inquiry">
```

如果是普通页面，可以跳到全站询盘页：

```astro
<BaseLayout mobileCtaHref="/get-a-quote/#rfq-form">
```

## 4. 行业配置管理

### 4.1 `src/lib/verticals.ts`

这是整套系统最重要的配置文件。

它定义了：

```ts
ProductVertical
InquiryField
PdpModuleKey
VerticalConfig
VERTICAL_CONFIGS
normalizeVertical()
getVerticalConfig()
getInquiryFields()
getAllowedExtraFieldNames()
```

### 4.2 `VERTICAL_CONFIGS` 结构

每个行业配置包含：

```ts
{
  label: string;
  cta: {
    primary: string;
    secondary: string;
    mobilePrimary: string;
  };
  requestTypeOptions: string[];
  stickyFields: InquiryField[];
  fullFields: InquiryField[];
  pdpModules: PdpModuleKey[];
}
```

字段解释：

| 字段 | 作用 |
|---|---|
| `label` | 行业显示名称 |
| `cta.primary` | 主要询盘按钮文案 |
| `cta.secondary` | 次级询盘动作文案 |
| `cta.mobilePrimary` | 移动端底部 CTA 文案 |
| `requestTypeOptions` | 询盘类型选项 |
| `stickyFields` | 桌面右侧 sticky 表单字段，建议 5 到 7 个 |
| `fullFields` | 完整询盘表单字段 |
| `pdpModules` | PDP 模块渲染顺序 |

### 4.3 如何修改某个行业 CTA 文案

文件：

```text
src/lib/verticals.ts
```

例如修改材料类 CTA：

```ts
materials: {
  cta: {
    primary: 'Request Sample',
    secondary: 'Request COA',
    mobilePrimary: 'Get Bulk Price',
  },
}
```

如果你想让材料类主 CTA 改成 `Request Material Quote`：

```ts
primary: 'Request Material Quote'
```

影响范围：

- PDP 右侧 sticky 表单标题和按钮。
- PDP 页内 inline inquiry 表单标题和按钮。
- 相关移动端 CTA 文案。

### 4.4 如何修改 sticky 表单字段

仍然在：

```text
src/lib/verticals.ts
```

例如机械类 sticky 字段：

```ts
const machineryStickyFields: InquiryField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'country', label: 'Country / Region', type: 'text', required: true },
  { name: 'product_slug', label: 'Product / Model', type: 'text', required: true },
  { name: 'quantity', label: 'Required Quantity', type: 'text', required: true },
  { name: 'application', label: 'Application / Equipment Type', type: 'text', required: true },
  { name: 'message', label: 'Message', type: 'textarea', required: true },
];
```

如果要增加 `required_delivery_time`：

```ts
{ name: 'required_delivery_time', label: 'Required Delivery Time', type: 'text', required: false }
```

注意：

- sticky 表单不要太长，建议 5 到 7 个字段。
- 过多字段会降低桌面侧栏转化率。
- 复杂字段放到 full form 更合适。

### 4.5 如何修改完整询盘表单字段

完整表单字段在每个 vertical 的 `fullFields` 中。

例如材料类：

```ts
fullFields: [
  ...materialsStickyFields,
  { name: 'target_specification', label: 'Target Specification', type: 'text', required: false },
  { name: 'packaging_requirement', label: 'Packaging Requirement', type: 'text', required: false },
  { name: 'destination_port', label: 'Destination Port', type: 'text', required: false },
  { name: 'regulatory_requirement', label: 'Regulatory Requirement', type: 'text', required: false },
  { name: 'monthly_demand', label: 'Monthly / Annual Demand', type: 'text', required: false },
  { name: 'company_type', label: 'Company Type', type: 'select', required: false, options: ['Distributor', 'Manufacturer', 'Lab', 'Trader'] },
]
```

影响范围：

- `/get-a-quote/` 完整表单。
- PDP 页内 inline inquiry 表单。
- API extra fields 白名单。
- 销售通知邮件中的 Additional Requirements。

## 5. PDP 模块顺序管理

### 5.1 `src/lib/pdp.ts`

作用：根据 vertical 返回对应 PDP 模块顺序。

当前逻辑很薄：

```ts
export function getPdpModules(vertical: unknown): PdpModuleKey[] {
  return getVerticalConfig(vertical).pdpModules;
}
```

真正的顺序定义在 `src/lib/verticals.ts` 的 `pdpModules`。

### 5.2 如何调整机械类 PDP 顺序

文件：

```text
src/lib/verticals.ts
```

找到：

```ts
machinery: {
  pdpModules: [
    'ProductHero',
    'Specifications',
    'Applications',
    'FABENarrative',
    'ManufacturingQC',
    'TrustEvidence',
    'CommercialTerms',
    'Downloads',
    'ConversionPanel',
    'FAQ',
    'RelatedProducts',
  ],
}
```

如果你想把 `CommercialTerms` 提前到规格后面：

```ts
pdpModules: [
  'ProductHero',
  'Specifications',
  'CommercialTerms',
  'Applications',
  'FABENarrative',
  'ManufacturingQC',
  'TrustEvidence',
  'Downloads',
  'ConversionPanel',
  'FAQ',
  'RelatedProducts',
]
```

### 5.3 当前支持的 PDP 模块 key

```ts
'ProductHero'
'Specifications'
'TechnicalData'
'ComplianceDocuments'
'Applications'
'FABENarrative'
'ManufacturingQC'
'QualityConsistency'
'TrustEvidence'
'CommercialTerms'
'Downloads'
'ConversionPanel'
'FAQ'
'RelatedProducts'
'Variants'
'ChannelFit'
'Customization'
```

### 5.4 模块 key 和现有组件的映射

当前第一版实现中，有些行业专属模块暂时映射到现有组件：

| module key | 当前渲染 |
|---|---|
| `Specifications` | `Specifications` 组件 |
| `TechnicalData` | 暂时使用 `Specifications` 组件 |
| `Applications` | `Applications` 组件 |
| `FABENarrative` | `FABENarrative` 组件 |
| `ManufacturingQC` | `ManufacturingQC` 组件 |
| `QualityConsistency` | 暂时使用 `ManufacturingQC` 组件 |
| `TrustEvidence` | `CertLogoWall` |
| `ComplianceDocuments` | 暂时使用 `CertLogoWall` |
| `CommercialTerms` | `KeyCommercialTerms` |
| `Downloads` | `DownloadsSection` |
| `ConversionPanel` | `InlineInquiryForm` |
| `FAQ` | `FAQAccordion` |
| `RelatedProducts` | `RelatedProducts` |
| `Variants` | 轻量 section |
| `ChannelFit` | 轻量 section |
| `Customization` | 轻量 section |

后续如果要做更完整的材料类或 OEM 类页面，可以为这些 key 新建专属组件。

例如：

```text
src/components/pdp/TechnicalData.astro
src/components/pdp/ComplianceDocuments.astro
src/components/pdp/Variants.astro
src/components/pdp/Customization.astro
```

然后在 `src/pages/products/[slug].astro` 里把对应 key 映射到新组件。

## 6. 产品数据如何启用行业配置

### 6.1 `src/lib/products.ts`

产品类型新增：

```ts
vertical?: ProductVertical;
```

现有产品：

```ts
{
  slug: 'planetary-gearbox-hg-series',
  vertical: 'machinery',
  title: 'Planetary Gearbox HG-220 Series',
  ...
}
```

### 6.2 新增机械类产品

```ts
{
  slug: 'industrial-reducer-rx-series',
  vertical: 'machinery',
  title: 'Industrial Reducer RX Series',
  model: 'RX-120',
  ...
}
```

效果：

- 使用机械类蓝色技术视觉。
- PDP 按机械类模块顺序。
- 表单询问型号、数量、应用设备、图纸等。
- CTA 文案为 `Request a Quote` / `Send RFQ`。

### 6.3 新增材料类产品

```ts
{
  slug: 'pa66-gf30-engineering-plastic',
  vertical: 'materials',
  title: 'PA66 GF30 Engineering Plastic',
  model: 'PA66-GF30',
  ...
}
```

效果：

- 使用材料类 overlay。
- PDP 更重视技术数据、合规文件、样品、COA/SDS。
- 表单询问材料牌号、应用、数量、request type。
- CTA 文案为 `Request Sample` / `Get Bulk Price`。

### 6.4 新增 OEM/ODM 消费品

```ts
{
  slug: 'custom-stainless-water-bottle',
  vertical: 'consumer-oem',
  title: 'Custom Stainless Steel Water Bottle',
  model: 'WB-OEM-500',
  ...
}
```

效果：

- 使用 consumer OEM overlay。
- PDP 更重视变体、渠道适配、包装、Logo、定制范围。
- 表单询问产品兴趣、MOQ、OEM/ODM/Private Label。
- CTA 文案为 `Get OEM Quote` / `OEM Quote`。

## 7. 询盘表单 schema 操作教程

### 7.1 字段结构

字段类型定义：

```ts
interface InquiryField {
  name: string;
  label: string;
  type: InquiryFieldType;
  required: boolean;
  placeholder?: string;
  helperText?: string;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
  };
}
```

支持字段类型：

```text
text
email
tel
textarea
select
number
file
url
```

### 7.2 添加普通文本字段

```ts
{
  name: 'destination_port',
  label: 'Destination Port',
  type: 'text',
  required: false,
}
```

### 7.3 添加 select 字段

```ts
{
  name: 'company_type',
  label: 'Company Type',
  type: 'select',
  required: false,
  options: ['Distributor', 'Manufacturer', 'Lab', 'Trader'],
}
```

### 7.4 添加文件上传字段

```ts
{
  name: 'file',
  label: 'Upload Drawing / Specs',
  type: 'file',
  required: false,
  helperText: 'PDF, JPG, PNG, DWG, STEP, IGS, X_T up to 10MB.',
}
```

注意：

- 当前 API 已有附件上传逻辑。
- `file` 是通用字段，不会进入 `extra_fields`。
- 行业专属字段才会进入 `extra_fields`。

### 7.5 字段命名规则

建议使用 snake_case：

```text
material_grade
destination_port
target_market
required_certifications
logo_or_packaging_needed
```

不要使用：

```text
Material Grade
materialGrade
material-grade
```

原因：

- 便于 API 读取。
- 便于邮件 label 自动格式化。
- 便于数据库 JSON 保存。

## 8. API 和数据库操作说明

### 8.1 为什么新增 `extra_fields`

通用字段适合放在主表列：

```text
name
email
country
product_slug
product_name
quantity
message
industry
```

但不同 vertical 的专属字段差异很大。

例如材料类：

```text
material_grade
regulatory_requirement
destination_port
monthly_demand
```

例如 OEM 类：

```text
logo_or_packaging_needed
target_market
reference_link
sales_channel
```

如果每个字段都加数据库列，表结构会越来越臃肿。因此新增：

```sql
extra_fields TEXT
```

用于 JSON 字符串保存行业专属字段。

### 8.2 D1 migration

新增迁移文件：

```text
migrations/002_inquiry_extra_fields.sql
```

内容：

```sql
ALTER TABLE inquiries ADD COLUMN extra_fields TEXT;
```

上线前需要在 Cloudflare D1 执行该 migration。

如果使用 Wrangler，命令通常类似：

```bash
pnpm wrangler d1 migrations apply <DATABASE_NAME>
```

具体数据库名称需要以项目当前 Cloudflare 配置为准。

### 8.3 API 如何收集 extra fields

文件：

```text
src/lib/inquiry.ts
```

函数：

```ts
collectInquiryExtraFields(formData, vertical)
```

处理逻辑：

1. 根据 `vertical` 获取允许字段白名单。
2. 从表单提交中读取这些字段。
3. 只保存非空字符串。
4. 忽略未被允许的字段。

这样可以避免恶意字段或无关字段进入数据库和销售邮件。

### 8.4 销售邮件展示

销售通知邮件会新增：

```text
Additional Requirements
```

展示 extra fields。

例如：

```text
Material Grade: PA66 GF30
Destination Port: Los Angeles
Regulatory Requirement: FDA
```

买家确认邮件保持简洁，不展示全部 extra fields。

## 9. 页面渲染流程

以产品详情页为例：

文件：

```text
src/pages/products/[slug].astro
```

流程：

```text
读取 product
  -> normalizeVertical(product.vertical)
  -> getVerticalConfig(vertical)
  -> getPdpModules(vertical)
  -> BaseLayout 输出 data-vertical
  -> StickyInquirySidebar 使用 stickyFields
  -> InlineInquiryForm 使用 fullFields
  -> 按 pdpModules 顺序渲染 PDP 模块
```

简化理解：

```text
产品数据决定行业
行业配置决定页面结构和表单
页面组件只负责渲染
```

## 10. 常见操作场景

### 10.1 修改一个行业的主色

改：

```text
src/styles/tokens.css
```

例如材料类主色：

```css
[data-vertical="materials"] {
  --vertical-primary: #007d79;
}
```

影响：

- 链接颜色。
- focus ring。
- 技术证明相关强调。
- 部分 hover 和 active 状态。

### 10.2 修改询盘按钮颜色

改：

```text
src/styles/tokens.css
```

```css
--color-orange-60: #e85d1c;
```

影响：

- `btn-inquiry`
- PDP sticky 表单提交按钮
- 移动端底部主 CTA
- 所有询盘转化路径按钮

注意：不要直接在组件中写死按钮颜色。

### 10.3 修改某个行业的表单字段

改：

```text
src/lib/verticals.ts
```

如果是 sticky 表单，改：

```ts
machineryStickyFields
materialsStickyFields
consumerOemStickyFields
```

如果是完整表单，改对应 vertical 的：

```ts
fullFields
```

### 10.4 修改 PDP 模块顺序

改：

```text
src/lib/verticals.ts
```

调整对应 vertical 的：

```ts
pdpModules
```

不需要直接在页面里上下移动组件，除非你要新增完全新的模块组件。

### 10.5 新增一个行业 vertical

例如要新增：

```text
electronics
```

需要改 5 个地方：

1. `src/lib/verticals.ts`

扩展类型：

```ts
export type ProductVertical = 'machinery' | 'materials' | 'consumer-oem' | 'electronics';
```

增加：

```ts
electronics: {
  label: 'Electronics / Components',
  cta: { ... },
  requestTypeOptions: [ ... ],
  stickyFields: [ ... ],
  fullFields: [ ... ],
  pdpModules: [ ... ],
}
```

更新：

```ts
normalizeVertical()
```

2. `src/styles/tokens.css`

增加：

```css
[data-vertical="electronics"] {
  --vertical-primary: ...;
  --vertical-accent: ...;
  --vertical-surface-tint: ...;
  --vertical-spec-bg: ...;
  --vertical-proof-bg: ...;
  --vertical-evidence: ...;

  --color-primary: var(--vertical-primary);
  --color-accent: var(--vertical-accent);
  --color-focus: var(--vertical-primary);
}
```

3. `src/lib/verticals.test.ts`

增加测试，确保新 vertical 存在。

4. `src/lib/pdp.test.ts`

增加 PDP 顺序测试。

5. 产品数据

在具体产品中设置：

```ts
vertical: 'electronics'
```

### 10.6 新增一个 PDP 模块 key

例如新增：

```text
WarrantyPolicy
```

需要改：

1. `src/lib/verticals.ts`

扩展 `PdpModuleKey`：

```ts
| 'WarrantyPolicy'
```

2. 对应 vertical 的 `pdpModules` 中加入：

```ts
'WarrantyPolicy'
```

3. 新建组件：

```text
src/components/pdp/WarrantyPolicy.astro
```

4. 在：

```text
src/pages/products/[slug].astro
```

增加映射：

```astro
module === 'WarrantyPolicy' ? (
  <WarrantyPolicy product={product} />
) : ...
```

5. 增加测试：

```text
src/lib/pdp.test.ts
```

## 11. 验收方法

### 11.1 命令验证

运行：

```bash
pnpm test
pnpm build
```

预期：

```text
pnpm test 通过
pnpm build 成功
```

当前已验证结果：

```text
8 files / 36 tests passed
pnpm build 成功
```

### 11.2 本地页面验证

启动：

```bash
pnpm dev
```

访问产品页：

```text
http://127.0.0.1:4321/products/planetary-gearbox-hg-series/
```

检查：

```text
body 是否有 data-vertical="machinery"
询盘按钮是否使用橙色 btn-inquiry
桌面右侧是否有 sticky inquiry form
移动端底部 CTA 是否显示 Send RFQ
页内是否有 #inline-inquiry
```

### 11.3 HTML 检查关键词

可检查页面 HTML 是否包含：

```text
data-vertical="machinery"
btn-inquiry
Request a Quote
#inline-inquiry
Send RFQ
```

### 11.4 材料类和 OEM 类配置验证

当前产品目录中还没有完整材料类和 OEM 类产品数据。要验证 overlay，可以临时把某个产品改成：

```ts
vertical: 'materials'
```

或：

```ts
vertical: 'consumer-oem'
```

然后重新启动或刷新页面，检查：

```text
data-vertical 是否变化
CTA 文案是否变化
表单字段是否变化
PDP 模块顺序是否变化
```

验证后再改回 `machinery`。

## 12. 提交和上线注意事项

### 12.1 建议提交范围

本次实现建议只提交这些范围：

```text
migrations/002_inquiry_extra_fields.sql
src/components/inquiry/
src/components/ui/BaseLayout.astro
src/components/ui/CTADock.astro
src/components/ui/Header.astro
src/components/ui/MobileNav.astro
src/lib/
src/pages/
src/styles/tokens.css
uno.config.ts
B2B-inquiry-design-system-operation-guide.md
```

不要默认提交：

```text
design.md
.github/
HP-design.md
IBMCarbon-design.md
```

### 12.2 上线前必须确认

1. `pnpm test` 通过。
2. `pnpm build` 成功。
3. D1 migration 已执行。
4. Cloudflare Pages 环境变量仍然完整：

```text
DB
FILES
RESEND_API_KEY
NOTIFY_EMAIL
PUBLIC_SITE_URL
```

5. `/api/inquiry` 在生产环境可写入 D1。
6. 销售通知邮件能收到 Additional Requirements。

### 12.3 推送和部署

如果当前 Cloudflare Pages 已连接 GitHub main 分支，流程通常是：

```bash
git add <本次实现相关文件>
git commit -m "Implement B2B inquiry design language"
git push origin main
```

推送后 Cloudflare Pages 会自动触发重新部署。

注意：D1 migration 是否自动执行取决于当前部署流程。如果没有自动执行，需要手动执行 migration。

## 13. 给 AI Agent 的执行规则

后续让 AI Agent 修改这个系统时，建议明确使用以下规则：

```text
1. 不要直接复制外部品牌设计系统命名。
2. 使用本项目自己的 B2B Inquiry Design Language 术语。
3. 视觉修改优先改 tokens.css，不要在组件里写死颜色。
4. 询盘按钮使用 btn-inquiry，普通主操作使用 btn-primary。
5. 行业字段和 CTA 文案优先改 src/lib/verticals.ts。
6. PDP 顺序优先改 verticals.ts 的 pdpModules。
7. 新增行业必须同步更新 tokens、vertical config、tests。
8. 新增表单字段必须考虑是否进入 extra_fields。
9. sticky 表单保持 5 到 7 个字段，复杂字段放 full form。
10. 不要把手动参考文件 HP-design.md、IBMCarbon-design.md 纳入运行命名。
```

## 14. 一句话理解

这批代码不是简单的 UI 改色，而是把网站升级成：

```text
可按行业切换视觉规范
可按行业切换 PDP 叙事顺序
可按行业切换询盘字段
可保存行业专属采购信息
可持续扩展的 B2B 询盘型独立站母版系统
```

