---
name: project-conventions
description: B2B Inquiry Station coding conventions — Astro component patterns, UnoCSS shortcuts, Cloudflare API patterns, design tokens usage
user-invocable: false
---

# Project Conventions — B2B Inquiry Station

## Component Rules
- PascalCase filenames, `.astro` extension
- `export interface Props` in frontmatter for TypeScript prop types
- `const { ... } = Astro.props` for prop destructuring
- Relative imports from src: `../../components/...`
- Four component categories: `ui/`, `trust/`, `fab-e/`, `inquiry/`

## UnoCSS Shortcuts (uno.config.ts)
```
btn               → inline-flex items-center justify-center font-semibold rounded-button transition-colors
btn-primary       → btn + bg-accent text-white hover:bg-accent-hover px-6 py-3 min-h-12
btn-secondary     → btn + bg-primary text-white hover:bg-primary-900 px-6 py-3 min-h-12
btn-outline       → btn + border-2 border-primary text-primary hover:bg-primary-50 px-6 py-3 min-h-12
section           → py-[var(--space-section)]
container         → max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
card              → bg-white rounded-card shadow-card p-6
```

## Design Tokens
- Reference via CSS variables: `var(--color-primary)`, `var(--space-section)`, etc
- Never hardcode colors or spacing
- `--color-primary`: steel blue, `--color-accent`: orange (CTA only), `--color-gray-warm`: background
- Type scale: display → heading → subhead → body → caption → small

## API Route Pattern
```typescript
export const POST: APIRoute = async ({ request, locals }) => {
  // 1. Validate input (honeypot, required fields, email)
  // 2. D1 write (skip silently if no binding)
  // 3. R2 upload (if file, 10MB max)
  // 4. Resend dual email (notify + confirm)
  // 5. Return { success: true }
}
```

## Build Modes
- Local: `output: 'static'`, no Cloudflare adapter
- Cloudflare Pages: `output: 'server'` + `@astrojs/cloudflare` (auto-detect via `CF_PAGES=1`)
