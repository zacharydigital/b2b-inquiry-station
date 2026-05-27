# B2B Inquiry Design Token Progress Tracker

Date: 2026-05-26
Status: Active progress tracker
Owner: Agent-maintained project status
Source plans:
- B2B Inquiry Design Token 补充计划
- B2B Inquiry Design Token 补充计划【新版】
- B2B Inquiry Design System 第二轮优化计划
- B2B Inquiry Design Token 未完成任务收尾计划
- Localhost Browser 验证与 API Build Warning 收口计划

## Agent Update Rules

Every agent working on B2B Inquiry Design Token tasks must update this file before handing off.

Update requirements:
- Change task status when implementation changes.
- Add exact file references for newly completed work.
- Add verification command output summary under "Latest Verification".
- Do not mark browser acceptance as complete unless `pnpm accept:local`, `pnpm accept:visual`, or `pnpm accept:rfq` has actually run successfully in an environment that allows browser automation.
- If a task is only represented as a contract but not implemented as user-facing behavior, keep it as "Partial".

Status legend:

| Status | Meaning |
|---|---|
| Done | Implemented and covered by test/build/guardrail or code verification. |
| Partial | Contract/base capability exists, but full productized behavior is not implemented. |
| Not Started | No meaningful implementation yet. |
| Blocked | Implementation depends on environment, policy, external service, or unresolved product decision. |

## Latest Verification

| Date | Command | Result | Notes |
|---|---|---|---|
| 2026-05-26 | `pnpm test src/lib/design-rules.test.ts` | Passed: 12 tests | Guardrails cover token rules, form states, conversion primitives, API GET fallback, acceptance scripts. |
| 2026-05-26 | `pnpm build` | Passed | API POST-only GET warnings removed after explicit GET 405 handlers. |
| 2026-05-26 | `pnpm check:local` | Passed: 12 files, 74 tests | Runs test, build, and design-system guardrails. |
| 2026-05-26 | `git diff --check` | Passed | No whitespace errors. |
| 2026-05-26 | `lsof -nP -iTCP:4321 -sTCP:LISTEN` | No output | No dev server left listening on port 4321. |
| 2026-05-26 | Browser plugin localhost smoke check | Blocked | Codex Browser security policy rejected `localhost:4321`; project-level Playwright CLI acceptance scripts are now the intended path. |

## Overall Status

| Workstream | Status | Evidence / Files | Notes |
|---|---|---|---|
| Design Token new layer model | Done | `src/lib/design-token-contract.ts`, `src/styles/tokens.css`, `src/lib/design-tokens.ts` | Covers layout, state, conversion, data display, media, motion, layers, accessibility, brand, modules, email theme. |
| CSS variable token expansion | Done | `src/styles/tokens.css` | Extended beyond color/type/spacing into interface-level contract. |
| JSON token export | Done | `src/lib/design-tokens.ts`, `src/pages/design-system/tokens.json.ts` | `/design-system/tokens.json` consumes shared contract. |
| UnoCSS token shortcuts | Done | `uno.config.ts` | Shortcuts for CTA, form, overlay, drawer, modal, table, media, motion. |
| Phase 1 component tokenization | Done | `src/components/ui/*`, `src/components/inquiry/*`, `src/components/fab-e/Specifications.astro` | Header, mobile nav, CTA dock, sticky inquiry, fields, modals, quote cart, tables migrated. |
| Real form state productization | Done | `src/lib/inquiry-form-state.ts`, inquiry forms | Error summary, `aria-live`, `role=alert`, field errors, submitting state. |
| Conversion primitives | Done | `InquiryCTA.astro`, `ConversionPanel.astro`, `TrustReassurance.astro`, `RFQProgress.astro` | Used by Header, CTADock, StickyInquirySidebar, design-system page. |
| Guardrail expansion | Done | `src/lib/design-rules.test.ts`, `src/lib/design-tokens.test.ts` | Covers hard-coded style rules, token export, forms, primitives, validator, API fallback, acceptance scripts. |
| API build warning cleanup | Done | `src/pages/api/inquiry.ts`, `src/pages/api/download-gate.ts`, `src/pages/api/quote-cart.ts` | Explicit GET 405 handlers remove Astro POST-only route warnings. |
| Project-level browser acceptance scripts | Done | `scripts/playwright-visual-acceptance.mjs`, `scripts/playwright-rfq-workflow.mjs`, `scripts/playwright-local-acceptance.mjs`, `package.json` | Scripts exist; actual browser run remains environment-dependent. |
| Real browser acceptance execution | Blocked | `pnpm accept:local` | Not run in current environment because Browser plugin localhost access was blocked. Run locally or in CI where Playwright is allowed. |
| Brand overlay tooling | Partial | `DESIGN_TOKEN_CONTRACT.brand` | Contract and protected-token boundary exist; no customer theme editor/config UI. |
| React island module products | Partial | `DESIGN_TOKEN_CONTRACT.modules` | Module contracts exist; RFQWizard/ProductConfigurator/etc. are not implemented. |
| Headless/ARIA primitive integration | Not Started | N/A | No React Aria/Radix/TanStack/Uppy integration yet. |

## Token Layer Checklist

| Token Layer / Requirement | Status | Evidence / Files | Remaining Work |
|---|---|---|---|
| Primitive Tokens | Done | `DESIGN_TOKEN_CONTRACT.core`, `tokens.css` | Keep backwards compatible. |
| Semantic Tokens | Done | `tokens.css`, `uno.config.ts` | Continue replacing one-off values when new components are added. |
| Layout Tokens | Done | `containerPage`, `sectionPaddingBlock`, `sidebarWidth`, `stickyTopOffset`, `mobileDockHeight` | None for current Phase 1 scope. |
| State Tokens | Done | `hoverBg`, `activeBg`, `selectedBg`, `disabledOpacity`, `loadingOpacity`, `invalidBg`, `validBg` | None for current Phase 1 scope. |
| Component Tokens | Done | fields, buttons, cards, modal, drawer, form status tokens | Continue using only tokenized component styling. |
| Conversion Tokens | Done | inquiry CTA, sticky sidebar, mobile dock, download gate, quote cart, RFQ progress | Future high-interaction modules must consume same tokens. |
| Data Display Tokens | Done | table bg/header/cell/density, procurement row, badge/chip, empty/loading/error states | Interactive table behavior still future work. |
| Media Tokens | Done | gallery/product aspect, thumbnail size, frame, placeholder, document preview | More product-gallery behavior can be added later. |
| Motion Tokens | Done | duration fast/base/slow, easing, accordion/stepper/toast duration | Avoid overusing motion on B2B pages. |
| Z-Index / Overlay Tokens | Done | header/sticky/dock/drawer/modal/toast/backdrop/overlay bg | Guardrail prevents reverting to `z-50`/raw overlays. |
| Accessibility Tokens | Done | focus ring, offset, min touch target, error announcement, contrast pairs, reduced motion | Keep testing real browser focus states when possible. |
| Vertical Overlay Tokens | Done | machinery/materials/consumer-oem | New verticals must include equivalent overlay contract. |
| Brand Overlay Tokens | Partial | brand primary/surface/font/ink/protected tokens | No multi-brand theme editor or config loader yet. |
| Module Tokens | Partial | six module contracts under `modules` | Contracts only; implementation pending. |
| Email Theme Tokens | Done | `emailTheme`, `EMAIL_THEME_TOKENS`, `EMAIL_STYLES` | Further email template builder is optional/future. |

## Execution Task Checklist From New Plan

| Original Task | Status | Evidence / Files | Notes |
|---|---|---|---|
| 1. Update token spec document with new layers, naming rules, priority, forbidden items | Done | `docs/superpowers/specs/2026-05-25-b2b-inquiry-design-system-spec.md` | Spec was updated during token work. |
| 2. Extend CSS tokens: semantic/layout/state/conversion/z-index first, then data/media/motion/a11y/module | Done | `src/styles/tokens.css` | All planned token groups exist. |
| 3. Sync token JSON export and preserve `core/components/verticals` compatibility | Done | `src/lib/design-token-contract.ts`, `src/lib/design-tokens.ts`, `tokens.json.ts` | `core`, `components`, `verticals` retained; new groups added. |
| 4. Update UnoCSS token-based shortcuts | Done | `uno.config.ts` | Hard-coded layout/overlay/CTA/table/form shortcuts reduced. |
| 5. Migrate Phase 1 components | Done | Header, MobileNav, CTADock, StickyInquirySidebar, InquiryFields, EmailGateModal, QuoteCartPanel, tables | Guardrail covers Phase 1 components. |
| 6. Extend `/design-system/` examples | Done | `src/pages/design-system/index.astro` | Shows tokens, form states, primitives, media, tables, brand boundary. |
| 7. Add tests for token export, vertical overlay, inquiry CTA, hard-coded style bans | Done | `design-rules.test.ts`, `design-tokens.test.ts` | Current tests pass under `pnpm check:local`. |
| 8. Run verification | Done | `pnpm check:local` | Passed on 2026-05-26. Browser acceptance still separate. |

## Phase 1 Component Tokenization Checklist

| Component / Area | Status | Evidence / Files | Notes |
|---|---|---|---|
| Header | Done | `src/components/ui/Header.astro` | Uses `InquiryCTA`. |
| MobileNav | Done | `src/components/ui/MobileNav.astro` | Included in guardrail coverage. |
| Mobile CTA Dock | Done | `src/components/ui/CTADock.astro` | Uses `InquiryCTA` and mobile dock token. |
| StickyInquirySidebar | Done | `src/components/inquiry/StickyInquirySidebar.astro` | Uses form-state helper and `TrustReassurance`. |
| InquiryFields | Done | `src/components/inquiry/InquiryFields.astro` | Tokenized controls, required marker, error association. |
| EmailGateModal | Done | `src/components/inquiry/EmailGateModal.astro` | Tokenized modal shell and overlay behavior. |
| QuickQuotePop | Done | `src/components/inquiry/QuickQuotePop.astro` | Flex modal regression fixed and tested. |
| QuoteCartButton | Done | `src/components/inquiry/QuoteCartButton.astro` | Tokenized quote cart trigger. |
| QuoteCartPanel | Done | `src/components/inquiry/QuoteCartPanel.astro` | Tokenized drawer/panel/cart item styling. |
| Specification table | Done | `src/components/fab-e/Specifications.astro` | Uses data display/table token conventions. |
| Comparison table | Done | `src/pages/compare.astro` | Tokenized table and CTA styling. |
| ProductCard | Done | `src/components/ui/ProductCard.astro` | Tokenized media frame/card styling. |
| Page-level CTA paths | Done | `src/pages/index.astro`, `about.astro`, `compare.astro` | Inquiry CTA rules guarded. |

## Form State Productization Checklist

| Requirement | Status | Evidence / Files | Notes |
|---|---|---|---|
| Shared form-state helper | Done | `src/lib/inquiry-form-state.ts` | Used by full/inline/sticky forms. |
| Error summary | Done | inquiry forms | `form-error-summary` exists in real forms. |
| `role="alert"` | Done | inquiry forms | Guardrail checks it. |
| `aria-live="assertive"` | Done | inquiry forms | Guardrail checks it. |
| Field-level error text | Done | `InquiryFields.astro` | `data-field-error`, `aria-describedby`. |
| `aria-invalid` state | Done | `inquiry-form-state.ts` | Set during validation. |
| Conditional fields sync | Done | `inquiry-form-state.ts` | Shows/hides and disables hidden fields. |
| Submitting state | Done | inquiry forms | Uses `form-status-submitting`. |
| Success state in real AJAX form | Partial | success token exists | Current flow mainly redirects/submits; no full AJAX success UX. |
| Complex file upload manager | Not Started | N/A | Future `FileUploadManager`/Uppy/FilePond work. |

## Conversion Primitive Checklist

| Primitive | Status | Evidence / Files | Notes |
|---|---|---|---|
| `InquiryCTA` | Done | `src/components/inquiry/InquiryCTA.astro` | Used in Header and CTADock. |
| `ConversionPanel` | Done | `src/components/inquiry/ConversionPanel.astro` | Used on design-system page. |
| `TrustReassurance` | Done | `src/components/inquiry/TrustReassurance.astro` | Used in StickyInquirySidebar and design-system page. |
| `RFQProgress` | Done | `src/components/inquiry/RFQProgress.astro` | Used on design-system page. |
| Dedicated primitive docs | Partial | `/design-system/` examples | No standalone README per primitive yet. |

## Guardrail Checklist

| Guardrail | Status | Evidence / Files | Notes |
|---|---|---|---|
| Inquiry conversion CTA must not use `btn-primary` | Done | `design-rules.test.ts` | Prevents primary action color confusion. |
| D1 inquiry field alignment | Done | `design-rules.test.ts` | Checks migrations/API/admin fields. |
| Required token variables | Done | `design-rules.test.ts` | Checks core interface contract vars. |
| No hard-coded z-index/overlay/shadow/motion in Phase 1 components | Done | `design-rules.test.ts` | Prevents style regression. |
| Data/media/a11y/brand/motion contract completeness | Done | `design-rules.test.ts` | Checks CSS and TS contract. |
| Form validation and conversion primitive contracts | Done | `design-rules.test.ts` | Checks tokens and examples. |
| Validator uses shared token contract | Done | `scripts/validate-design-system.mjs`, test | Replaces old string marker assumptions. |
| QuickQuote flex display state | Done | `design-rules.test.ts` | Prevents modal layout regression. |
| Real form state primitives | Done | `design-rules.test.ts` | Checks real forms, not only examples. |
| Conversion primitive files exist | Done | `design-rules.test.ts` | Checks four primitives. |
| Acceptance scripts exist | Done | `design-rules.test.ts`, `package.json` | Checks visual/RFQ/local acceptance commands. |
| API GET 405 fallback | Done | `design-rules.test.ts`, API routes | Removes Astro build warnings. |

## Browser and Acceptance Checklist

| Task | Status | Evidence / Files | Next Step |
|---|---|---|---|
| Visual acceptance script | Done | `scripts/playwright-visual-acceptance.mjs` | Run with an allowed browser environment. |
| RFQ workflow acceptance script | Done | `scripts/playwright-rfq-workflow.mjs` | Run with an allowed browser environment. |
| Local acceptance orchestrator | Done | `scripts/playwright-local-acceptance.mjs` | Runs visual + RFQ and manages dev server. |
| `accept:local` package script | Done | `package.json` | `pnpm accept:local`. |
| Browser screenshots generated | Blocked | N/A | Current Codex Browser blocked localhost; run locally/CI. |
| Browser acceptance summary updated | Partial | `docs/browser-acceptance-checklist.md` | Add latest screenshot links after successful run. |

## API Warning Cleanup Checklist

| API Route | Status | Evidence / Files | Notes |
|---|---|---|---|
| `/api/inquiry` GET fallback | Done | `src/pages/api/inquiry.ts` | Returns 405 + Allow POST. |
| `/api/download-gate` GET fallback | Done | `src/pages/api/download-gate.ts` | Returns 405 + Allow POST. |
| `/api/quote-cart` GET fallback | Done | `src/pages/api/quote-cart.ts` | Returns 405 + Allow POST. |
| Build warning removal | Done | `pnpm build` latest verification | No POST-only GET warnings in latest build. |

## Architecture Roadmap Checklist

| Roadmap Item | Status | Evidence / Files | Remaining Work |
|---|---|---|---|
| Phase 1: Astro + tokens + UnoCSS + nanostores | Done | Current project architecture | Continue as default. |
| Phase 1: simple modal/drawer/FAQ/mobile CTA/download gate/simple quote cart/basic forms | Done | Existing components | Maintain with guardrails. |
| Phase 2: React island only for complex modules | Partial | Module contracts exist | No React island implementation yet. |
| RFQWizard | Partial | `modules.rfqWizard` contract | Build React island module. |
| ProductConfigurator | Partial | `modules.productConfigurator` contract | Build React island module. |
| QuoteCartManager | Partial | `modules.quoteCartManager` contract | Upgrade simple quote cart to manager. |
| DownloadCenter | Partial | `modules.downloadCenter` contract | Build advanced download center. |
| ComparisonBuilder | Partial | `modules.comparisonBuilder` contract | Build interactive comparison builder. |
| LeadScoringPanel | Partial | `modules.leadScoringPanel` contract | Build admin/ops lead scoring UI. |
| AdvancedDownloadGate | Not Started | N/A | Define schema/state/events first. |
| CountryProductSelector | Not Started | N/A | Define product and country selection flow. |
| FileUploadManager | Not Started | N/A | Evaluate Uppy/FilePond. |
| AdvancedPLPFilter | Not Started | N/A | Define PLP data model and filters. |
| Headless/ARIA primitives | Not Started | N/A | Introduce only when complex interaction needs it. |
| Zod + React Hook Form | Not Started | N/A | Use only inside complex React islands. |
| TanStack Table | Not Started | N/A | Use for complex comparison/filter/sort tables. |
| Uppy/FilePond | Not Started | N/A | Use for complex upload manager. |
| Zustand inside complex React island | Not Started | N/A | Use only if island-local state becomes complex. |

## Remaining Backlog

| Priority | Item | Status | Acceptance Criteria |
|---|---|---|---|
| High | Run full browser acceptance | Blocked | `pnpm accept:local` passes and screenshots/summary are generated under `output/playwright/`. |
| High | RFQWizard island | Not Started | Multi-step RFQ with schema/state/events/validation/API/analytics/token contract. |
| High | QuoteCartManager island | Not Started | Cart supports edit/remove/persist/submit/recover state and analytics. |
| Medium | ProductConfigurator island | Not Started | PDP configurator with tokenized UI and product schema. |
| Medium | FileUploadManager | Not Started | Validated multi-file upload with progress/error/retry states. |
| Medium | ComparisonBuilder | Not Started | Interactive product comparison with table state and tokenized density. |
| Medium | DownloadCenter | Not Started | Advanced gated downloads with state and analytics. |
| Medium | LeadScoringPanel | Not Started | Admin or sales view using lead score module contract. |
| Medium | Brand overlay implementation | Partial | Configurable brand overlay that cannot override protected conversion/a11y/error tokens. |
| Low | Headless primitives | Not Started | React Aria/Radix introduced only for complex interactions and styled entirely by custom tokens. |
| Low | Email template builder | Partial | Existing email theme token expanded into reusable builder/helpers if templates grow. |

## Next Recommended Task

Run real browser acceptance outside the blocked Codex Browser environment:

```bash
pnpm accept:local
```

If it passes, update:
- "Latest Verification"
- "Browser and Acceptance Checklist"
- `docs/browser-acceptance-checklist.md`

Then choose the next productization module. Recommended order:

1. RFQWizard
2. QuoteCartManager
3. ProductConfigurator
4. FileUploadManager
5. ComparisonBuilder
6. DownloadCenter
7. LeadScoringPanel
