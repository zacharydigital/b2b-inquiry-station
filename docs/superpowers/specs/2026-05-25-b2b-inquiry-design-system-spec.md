# 外贸 B2B 询盘型高转化独立站设计系统规格

Date: 2026-05-25
Status: Approved design direction, ready for implementation planning
Scope: Core B2B inquiry template plus three vertical overlays: machinery, materials, and consumer OEM/ODM.

## 1. Design Goal

This design system supports export-oriented B2B product detail pages and inquiry flows. The target outcome is not direct checkout. The target outcome is a qualified commercial conversation: quote request, sample request, document request, or technical consultation.

The PDP narrative follows:

Hook -> Proof -> Fit -> Trust -> Terms -> Convert

This maps to the buyer's four questions:

- What is this?
- Can I use it?
- Can I trust it?
- How do I buy it?

The system combines three conversion models:

- FAB-E: Feature -> Advantage -> Benefit -> Evidence for product claims.
- AIDCA: Attention -> Interest -> Desire -> Conviction -> Action for page progression.
- LIFT: Relevance, Clarity, Urgency, Anxiety, and Distraction reduction for form and CTA design.

## 2. Design Language Decision

Use a Carbon-inspired enterprise design language as the core. It should feel technical, structured, international, and procurement-ready. Use restrained HP-style product catalog patterns only where visual product comparison and variant scanning matter.

Avoid consumer-brand landing page patterns that reduce information density or over-prioritize visual drama. PDP pages must support technical evaluation, not just brand impression.

Core visual attributes:

- White canvas, low-noise gray surfaces, dark ink text.
- Blue for professional navigation, links, focus, and technical proof.
- Orange only for the main inquiry conversion path.
- Low radius, strong hairlines, minimal shadows.
- Dense but scannable information hierarchy.
- Forms and spec tables must be visually prominent, not hidden below decorative sections.

## 3. Token Architecture

Use one shared core token layer and three vertical overlay layers.

Token order:

1. Primitive tokens: fixed color, spacing, type, radius, and shadow values.
2. Semantic core tokens: canvas, surface, ink, primary, accent, focus, success, warning, error.
3. Component tokens: button, field, card, table, sidebar, CTA dock.
4. Vertical overlay tokens: machinery, materials, consumer-oem.

Naming rules:

- Use CSS custom properties.
- Use semantic names for component consumption.
- Use primitive values only inside the token file.
- Use `--vertical-*` tokens for industry-specific overrides.
- Keep `--color-accent` reserved for inquiry CTA intent.
- Do not use accent orange for neutral links, tabs, or decorative labels.

Recommended token pattern:

```css
:root {
  --color-blue-60: #0f62fe;
  --color-orange-60: #e85d1c;

  --color-canvas: #ffffff;
  --color-surface-1: #f4f4f4;
  --color-surface-2: #e0e0e0;
  --color-ink: #161616;
  --color-ink-muted: #525252;
  --color-ink-subtle: #6f6f6f;
  --color-hairline: #e0e0e0;

  --color-primary: var(--color-blue-60);
  --color-accent: var(--color-orange-60);
  --color-focus: var(--color-blue-60);

  --field-bg: var(--color-surface-1);
  --field-border: #8d8d8d;
  --field-border-hover: var(--color-ink-muted);
  --field-focus-ring: 0 0 0 2px var(--color-focus);

  --radius-card: 8px;
  --radius-button: 4px;
  --radius-input: 4px;
}
```

## 4. Core Tokens

### 4.1 Color

| Token | Value | Use |
|---|---:|---|
| `--color-canvas` | `#ffffff` | Default page background |
| `--color-surface-1` | `#f4f4f4` | Input background, alternate sections, table strips |
| `--color-surface-2` | `#e0e0e0` | Disabled surface, stronger separators |
| `--color-ink` | `#161616` | Primary text, headings |
| `--color-ink-muted` | `#525252` | Secondary text |
| `--color-ink-subtle` | `#6f6f6f` | Helper text, captions |
| `--color-hairline` | `#e0e0e0` | Borders and dividers |
| `--color-primary` | `#0f62fe` | Links, active tabs, focus, technical proof |
| `--color-primary-hover` | `#0353e9` | Link and button hover |
| `--color-primary-active` | `#002d9c` | Pressed state |
| `--color-accent` | `#e85d1c` | Main inquiry CTA only |
| `--color-accent-hover` | `#ba4e00` | Inquiry CTA hover |
| `--color-success` | `#24a148` | Success messages and verified status |
| `--color-warning` | `#f1c21b` | Warnings and caveats |
| `--color-error` | `#da1e28` | Field errors and destructive states |

### 4.2 Component Tokens

| Token | Value | Use |
|---|---:|---|
| `--field-bg` | `var(--color-surface-1)` | Text input, select, and textarea background |
| `--field-border` | `#8d8d8d` | Default field border |
| `--field-border-hover` | `var(--color-ink-muted)` | Field hover border |
| `--field-focus-ring` | `0 0 0 2px var(--color-focus)` | Visible form focus ring |
| `--button-primary-bg` | `var(--color-primary)` | Non-inquiry primary button |
| `--button-inquiry-bg` | `var(--color-accent)` | Inquiry CTA button |
| `--card-bg` | `var(--color-canvas)` | Default card background |
| `--table-header-bg` | `var(--color-surface-1)` | Specification table header |
| `--sidebar-bg` | `var(--color-canvas)` | Sticky inquiry sidebar |
| `--mobile-cta-bg` | `var(--color-canvas)` | Mobile bottom CTA bar |

### 4.3 Typography

| Token | Desktop | Mobile | Weight | Use |
|---|---:|---:|---:|---|
| `--text-display` | `3.75rem` | `2.125rem` | 300-400 | PDP hero title |
| `--text-heading` | `2.625rem` | `1.5rem` | 400 | Section heading |
| `--text-subhead` | `1.25rem` | `1.125rem` | 400 | Lead text |
| `--text-body` | `1rem` | `1rem` | 400 | Body and form input |
| `--text-caption` | `0.875rem` | `0.875rem` | 400 | Labels, helper text |
| `--text-small` | `0.75rem` | `0.75rem` | 400 | Metadata and badges |

Font stack:

```css
--font-sans: "IBM Plex Sans", "Inter", "Noto Sans SC", system-ui, sans-serif;
--font-mono: "IBM Plex Mono", "SFMono-Regular", monospace;
```

Typography rules:

- Use sentence case for section kickers and labels.
- Do not use negative letter spacing.
- Keep body letter spacing at `0.16px` where already used.
- Use monospaced type only for SKU, model, code, dimensions, or technical identifiers.

### 4.4 Spacing, Radius, and Elevation

| Token | Value | Use |
|---|---:|---|
| `--space-1` | `4px` | Small offsets |
| `--space-2` | `8px` | Tight grouping |
| `--space-3` | `12px` | Form label gap |
| `--space-4` | `16px` | Default inline spacing |
| `--space-6` | `24px` | Card padding |
| `--space-8` | `32px` | Module gap |
| `--space-12` | `48px` | Large block gap |
| `--space-section` | `96px desktop / 56px mobile` | Section rhythm |
| `--radius-card` | `8px` | Cards, media frames |
| `--radius-button` | `4px` | Buttons |
| `--radius-input` | `4px` | Inputs |
| `--shadow-card` | Subtle only | Conversion modules and sticky panels |
| `--border-subtle` | `1px solid var(--color-hairline)` | Default separator |

Elevation rules:

- Default content is flat.
- Use borders and surface shifts before shadows.
- Use shadow only for sticky inquiry sidebar, modal, quote cart, and mobile CTA dock.

## 5. Vertical Token Overlays

### 5.1 Machinery / Industrial Equipment / Parts

Intent: engineering trust, specification clarity, manufacturing reliability.

```css
[data-vertical="machinery"] {
  --vertical-primary: #0f62fe;
  --vertical-accent: #e85d1c;
  --vertical-surface-tint: #f8fbff;
  --vertical-spec-bg: #f4f4f4;
  --vertical-proof-bg: #edf5ff;
  --vertical-evidence: #6f6f6f;

  --color-primary: var(--vertical-primary);
  --color-accent: var(--vertical-accent);
  --color-focus: var(--vertical-primary);
}
```

Usage:

- Use blue for technical proof, model ranges, and active spec tabs.
- Use neutral gray for tables and comparison panels.
- Use orange only for `Request a Quote`, `Add to RFQ`, and sticky inquiry CTA.

### 5.2 Materials / Chemicals / Ingredients

Intent: compliance, safety, consistency, traceability.

```css
[data-vertical="materials"] {
  --vertical-primary: #007d79;
  --vertical-accent: #e85d1c;
  --vertical-surface-tint: #f6fbfa;
  --vertical-spec-bg: #eef7f6;
  --vertical-proof-bg: #defbe6;
  --vertical-evidence: #24a148;

  --color-primary: var(--vertical-primary);
  --color-accent: var(--vertical-accent);
  --color-focus: var(--vertical-primary);
}
```

Usage:

- Use teal for technical and compliance sections.
- Use green for verified documents, COA, SDS, and standard compliance.
- Keep warning states distinct for hazardous handling, storage, or transport limits.

### 5.3 Consumer Products / Wholesale / OEM ODM

Intent: product appeal, customization confidence, retail readiness.

```css
[data-vertical="consumer-oem"] {
  --vertical-primary: #0f62fe;
  --vertical-accent: #ff6f00;
  --vertical-surface-tint: #fffaf2;
  --vertical-spec-bg: #f4f4f4;
  --vertical-proof-bg: #fff1e0;
  --vertical-evidence: #8a3800;

  --color-primary: var(--vertical-primary);
  --color-accent: var(--vertical-accent);
  --color-focus: var(--vertical-primary);
}
```

Usage:

- Use warmer proof backgrounds for packaging, customization, and private-label blocks.
- Allow higher image density than machinery and materials pages.
- Keep procurement data visible: MOQ, sample time, production lead time, and certification.

## 6. PDP Layout Contract

### 6.1 Desktop

Use a 12-column layout.

- Main product media: columns 1-7.
- Product summary and primary actions: columns 8-12.
- Deep content: columns 1-8.
- Sticky inquiry sidebar: columns 9-12.
- Sidebar top offset must clear the sticky header.

Primary scan pattern:

- Hero uses Z-pattern: image, title, proof chips, CTA.
- Deep sections use F-pattern: heading, evidence summary, table/list, CTA.

### 6.2 Mobile

Use single-column folding flow.

- Product title appears before or immediately after the first image.
- Key proof chips appear above the first CTA.
- Long tables become horizontally scrollable or summary-first accordions.
- Sticky sidebar is replaced by a bottom sticky CTA bar.
- Full inquiry form appears after proof, trust, and terms sections unless user taps CTA.

## 7. PDP Module Contract

Every PDP module must have a clear job in the Hook -> Proof -> Fit -> Trust -> Terms -> Convert sequence.

### 7.1 Shared Module Types

#### `ProductHero`

Purpose: explain what this is and why the buyer should continue.

Required content:

- Product name
- Short positioning line
- Primary image or gallery
- 3-5 key proof chips
- Primary CTA
- Secondary CTA

Recommended data:

```ts
type ProductHero = {
  title: string;
  subtitle: string;
  media: ProductMedia[];
  proofChips: string[];
  primaryCta: Cta;
  secondaryCta?: Cta;
};
```

#### `Specifications`

Purpose: provide technical decision data.

Required content:

- Model or grade table
- Key parameters
- Unit labels
- Tolerance or range where relevant

Rules:

- Tables must include units in headers.
- Do not hide core specs inside downloadable PDFs only.
- Highlight buyer-relevant specs before internal manufacturing specs.

#### `FABENarrative`

Purpose: connect product features to buyer outcomes with evidence.

Required content:

- Feature
- Advantage
- Benefit
- Evidence

Rules:

- Evidence must be concrete: test result, certification, process, case, image, or document.
- Avoid generic claims such as "high quality" without evidence.

#### `Applications`

Purpose: help the buyer judge fit.

Required content:

- Use cases
- Suitable industries or channels
- Compatibility notes
- Limits or unsuitable cases where important

#### `TrustEvidence`

Purpose: reduce anxiety before inquiry.

Valid evidence:

- Certifications
- Factory photos
- QC process
- Production capacity
- Case studies
- Client logos only when authorized
- Test reports
- Inspection workflow

#### `CommercialTerms`

Purpose: answer procurement questions before the form.

Required content:

- MOQ
- Lead time
- Sample policy
- Packaging
- Payment terms
- Trade terms
- Warranty or after-sales policy where relevant

#### `ConversionPanel`

Purpose: capture a qualified inquiry with low friction.

Required content:

- Short value statement
- Minimal form
- Primary CTA
- Alternative contact route
- Privacy reassurance

Rules:

- Desktop uses sticky sidebar.
- Mobile uses bottom sticky CTA plus full-page form anchor.
- Sidebar form must not exceed 7 fields.

## 8. Vertical PDP Module Order

### 8.1 Machinery

1. `ProductHero`: product identity, model, primary image, key specs, quote CTA.
2. `Specifications`: model range, torque, power, material, tolerance, dimensions.
3. `Applications`: compatible machines, industries, installation scenarios.
4. `FABENarrative`: engineered features tied to buyer benefits and evidence.
5. `ManufacturingQC`: process, inspection, test equipment, factory capability.
6. `TrustEvidence`: certifications, cases, delivery countries.
7. `CommercialTerms`: MOQ, lead time, customization, packaging, warranty.
8. `Downloads`: drawing, catalog, datasheet gated by email.
9. `ConversionPanel`: RFQ sidebar and full inquiry form.
10. `FAQ`: installation, lifespan, replacement, maintenance.

### 8.2 Materials

1. `ProductHero`: grade, purity, form, application, sample CTA.
2. `TechnicalData`: TDS, composition, physical properties, grade standards.
3. `ComplianceDocuments`: SDS/MSDS, COA, REACH, RoHS, FDA, other regulatory proof.
4. `Applications`: formulations, industries, process suitability, limits.
5. `QualityConsistency`: batch consistency, lab testing, traceability.
6. `CommercialTerms`: packaging, sample, MOQ, storage, transport, hazard notes.
7. `Downloads`: TDS, SDS, COA request gate.
8. `ConversionPanel`: request sample, request COA, get bulk price.
9. `FAQ`: shelf life, storage, sample, regulation, shipping.

### 8.3 Consumer OEM/ODM

1. `ProductHero`: product appeal, main image, quote CTA, OEM/ODM CTA.
2. `Variants`: colors, sizes, materials, styles, packaging options.
3. `Specifications`: dimensions, material, capacity, certification, testing.
4. `ChannelFit`: Amazon, retail, gift, distributor, private label suitability.
5. `Customization`: logo, packaging, mold, color, formula, function options.
6. `TrustEvidence`: cases, shipped countries, audit proof, production lines.
7. `CommercialTerms`: MOQ, sample fee, sample time, production lead time, payment.
8. `ConversionPanel`: OEM/ODM inquiry and reference upload.
9. `FAQ`: custom process, samples, packaging, inspection, warranty.

## 9. Inquiry Form Schema

### 9.1 Field Model

Use one shared field model for all verticals.

```ts
type InquiryField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "number" | "file" | "url";
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
};
```

Field ordering rules:

- Ask low-friction identity fields first.
- Ask product intent before detailed procurement terms.
- Put high-effort fields such as upload, target price, and annual demand after the basic message.
- Keep sticky forms shorter than full forms.

### 9.2 Shared Required Fields

All vertical inquiry forms require:

| Field | Type | Notes |
|---|---|---|
| `name` | text | Buyer contact name |
| `email` | email | Primary reply route |
| `country` | text/select | Required for logistics and compliance |
| `productInterest` | text/select | Product, model, grade, or category |
| `quantity` | text/number | Accept ranges such as `500 pcs` or `2 tons` |
| `message` | textarea | Buyer context |

### 9.3 Machinery Fields

Sticky sidebar fields:

| Field | Required | Type |
|---|---:|---|
| `name` | Yes | text |
| `email` | Yes | email |
| `country` | Yes | text/select |
| `productModel` | Yes | text/select |
| `quantity` | Yes | text |
| `application` | Yes | text |
| `message` | Yes | textarea |

Full form optional fields:

- `targetSpecification`
- `equipmentType`
- `drawingUpload`
- `annualDemand`
- `deliveryTime`
- `phoneOrWhatsapp`
- `companyWebsite`

Primary CTA labels:

- `Request a Quote`
- `Send RFQ`
- `Get Technical Proposal`

### 9.4 Materials Fields

Sticky sidebar fields:

| Field | Required | Type |
|---|---:|---|
| `name` | Yes | text |
| `email` | Yes | email |
| `country` | Yes | text/select |
| `materialGrade` | Yes | text/select |
| `application` | Yes | text |
| `quantity` | Yes | text |
| `requestType` | Yes | select |

`requestType` options:

- Sample
- Bulk Quote
- COA
- SDS
- Technical Consultation

Full form optional fields:

- `targetSpecification`
- `packagingRequirement`
- `destinationPort`
- `regulatoryRequirement`
- `monthlyDemand`
- `companyType`

Primary CTA labels:

- `Request Sample`
- `Request COA`
- `Get Bulk Price`

### 9.5 Consumer OEM/ODM Fields

Sticky sidebar fields:

| Field | Required | Type |
|---|---:|---|
| `name` | Yes | text |
| `email` | Yes | email |
| `country` | Yes | text/select |
| `productInterest` | Yes | text/select |
| `quantity` | Yes | text |
| `inquiryType` | Yes | select |
| `message` | Yes | textarea |

`inquiryType` options:

- Wholesale
- OEM
- ODM
- Private Label

Full form optional fields:

- `logoOrPackagingNeeded`
- `targetMarket`
- `referenceLink`
- `referenceFileUpload`
- `expectedUnitPrice`
- `requiredCertifications`
- `salesChannel`

Primary CTA labels:

- `Get OEM Quote`
- `Request Wholesale Price`
- `Start Private Label Project`

## 10. Component State Contract

### 10.1 Buttons

Button types:

- `primary`: blue, used for technical navigation and secondary page actions.
- `inquiry`: orange, used only for high-intent inquiry actions.
- `secondary`: white or gray surface with hairline border.
- `ghost`: text/icon button for low-emphasis actions.

Required states:

| State | Behavior |
|---|---|
| Default | Clear label, stable dimensions |
| Hover | Background or border darkens |
| Focus | Visible `2px` focus ring using `--color-focus` |
| Active | Background darkens further |
| Disabled | Muted ink, disabled surface, no hover |
| Loading | Spinner or progress text, same button width |

### 10.2 Form Fields

Required states:

| State | Visual rule |
|---|---|
| Default | `--field-bg`, 1px border or Carbon-style bottom rule |
| Hover | Border changes to `--field-border-hover` |
| Focus | `2px` focus ring or 2px bottom rule in `--color-focus` |
| Filled | Same as default; value text uses `--color-ink` |
| Error | Red border/rule and inline message below field |
| Disabled | `--color-surface-2`, muted text |
| Help | Helper text below field in `--color-ink-subtle` |

Validation rules:

- Show errors inline, not only in toast.
- Keep user input after failed submission.
- Use clear business language: "Enter your email so our sales engineer can reply."
- File upload must show allowed file types and size limit.

### 10.3 Cards and Tables

Cards:

- Use `--border-subtle`.
- Use `--radius-card`.
- Avoid nested cards.
- Repeated product cards should keep stable image ratios.

Tables:

- Header rows use muted surface.
- Units must appear in column headers.
- Important rows can use `--vertical-proof-bg`.
- Mobile tables must support horizontal scroll or a summary-first accordion.

### 10.4 Sticky Inquiry Sidebar

Desktop behavior:

- Sticky within PDP content area.
- Starts near the hero and remains visible through proof, fit, trust, and terms.
- Collapses or stops before footer.
- Shows 5-7 fields maximum.
- Includes privacy reassurance and alternate contact link.

States:

- Default: compact quote form.
- Submitting: disable inputs and show loading state.
- Success: show confirmation, expected response time, and next action.
- Error: keep fields and show retry guidance.

### 10.5 Mobile Bottom CTA Bar

Required actions:

- Primary: inquiry CTA.
- Secondary: WhatsApp, email, or quote cart depending on project configuration.

Rules:

- Bar is sticky to bottom.
- It must not cover form submit buttons or footer content.
- Add bottom padding to body/content when the bar is visible.
- Use short labels; avoid wrapping.

## 11. Responsive Rules

### Desktop, 1200px and up

- 12-column grid.
- Hero uses left media and right information.
- Sticky inquiry sidebar is active.
- Spec/proof content can use two-column layouts.

### Tablet, 768px to 1199px

- Use 8-column grid or flexible two-column layout.
- Sidebar becomes inline quote panel unless there is enough width.
- Product media remains above or beside summary depending on content density.

### Mobile, below 768px

- Single-column content.
- Hero order: title, gallery, proof chips, CTA, summary.
- Long sections become accordions only when they are secondary.
- Core specs, MOQ, lead time, and sample policy must remain visible without opening every accordion.
- Bottom sticky CTA replaces sidebar.
- Form fields are full width.
- CTA buttons use stable height and no text overflow.

## 12. Analytics and Conversion Events

Track the following events consistently across all verticals:

| Event | Trigger |
|---|---|
| `pdp_view` | PDP loaded |
| `hero_cta_click` | Primary hero CTA clicked |
| `sticky_inquiry_start` | User focuses first sidebar field |
| `inquiry_submit_success` | Inquiry accepted by API |
| `inquiry_submit_error` | API or validation failure |
| `download_gate_open` | Buyer clicks gated download |
| `download_gate_submit` | Download gate submitted |
| `quote_cart_add` | Product added to RFQ cart |
| `whatsapp_click` | WhatsApp CTA clicked |

Required event properties:

- `vertical`
- `productSlug`
- `productCategory`
- `ctaLabel`
- `formType`
- `country` when provided
- `requestType` when provided

## 13. Existing Project Mapping

Current components can map into this specification as follows:

| Spec concept | Existing component |
|---|---|
| Product hero gallery | `src/components/ui/Gallery.astro` |
| Specifications | `src/components/fab-e/Specifications.astro` |
| FAB-E narrative | `src/components/fab-e/FABENarrative.astro` |
| Applications | `src/components/fab-e/Applications.astro` |
| Commercial terms | `src/components/ui/KeyCommercialTerms.astro` |
| Sticky inquiry sidebar | `src/components/inquiry/StickyInquirySidebar.astro` |
| Full inquiry form | `src/components/inquiry/FullInquiryForm.astro` |
| Inline inquiry form | `src/components/inquiry/InlineInquiryForm.astro` |
| Mobile CTA dock | `src/components/ui/CTADock.astro` |
| Downloads gate | `src/components/ui/DownloadsSection.astro` and `src/components/inquiry/EmailGateModal.astro` |
| Trust evidence | `src/components/trust/*` |

Implementation should preserve the current Astro component boundaries and extend them with vertical-aware props rather than forking one component per vertical unless behavior truly diverges.

## 14. Acceptance Criteria

The design system is correctly implemented when:

- One core token layer supports all verticals.
- Each vertical can set `data-vertical` and receive correct visual overlay tokens.
- PDP module order changes by vertical without duplicating the whole page template.
- Sticky desktop inquiry and mobile bottom CTA are both supported.
- Forms use the correct field schema per vertical.
- Field focus, error, disabled, loading, and success states are visible and accessible.
- Inquiry CTA orange is reserved for conversion actions.
- Core specs, trust evidence, terms, and conversion paths are visible on both desktop and mobile.
- `pnpm test` passes after schema or validation changes.
- `pnpm build` passes after page, component, token, or content changes.
