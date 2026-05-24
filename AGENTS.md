# Repository Guidelines

## Project Structure & Module Organization

This is an Astro 6 B2B inquiry-site template deployed to Cloudflare Pages. Source code lives in `src/`. Routes are defined in `src/pages/`, including API routes under `src/pages/api/`. Reusable Astro components are grouped by domain in `src/components/`: `ui/`, `trust/`, `inquiry/`, and `fab-e/`. Shared TypeScript utilities and tests live in `src/lib/`. Industry content is stored under `src/content/machinery/`. Global design tokens are in `src/styles/tokens.css`, static assets are in `public/`, and Cloudflare D1 migrations are in `migrations/`.

## Build, Test, and Development Commands

Use `pnpm` from the repository root.

- `pnpm install`: install dependencies.
- `pnpm dev`: start the Astro dev server, usually at `localhost:4321`.
- `pnpm build`: generate the production build in `dist/`.
- `pnpm preview`: preview the built site locally.
- `pnpm test`: run Vitest tests.
- `pnpm astro ...`: run Astro CLI commands.

## Coding Style & Naming Conventions

Use TypeScript and Astro frontmatter with 2-space indentation. Name Astro components in PascalCase, for example `ProductCard.astro` or `FullInquiryForm.astro`. Keep route files lowercase and URL-oriented, for example `src/pages/get-a-quote.astro`. Prefer relative imports already used in the project. Use UnoCSS utility classes and shared CSS variables from `src/styles/tokens.css`; avoid introducing one-off styling systems.

## Testing Guidelines

Vitest is configured for Node tests and includes files matching `src/**/*.test.ts`. Place unit tests beside the module they cover, such as `src/lib/seo.test.ts`. Add focused tests for shared utilities, validation logic, and API-adjacent behavior. Run `pnpm test` before submitting changes, and run `pnpm build` when touching pages, components, content loading, or Cloudflare bindings.

## Commit & Pull Request Guidelines

The current history only contains an initial commit, so use concise imperative commit messages with optional scope, such as `Add inquiry form validation` or `Fix homepage component imports`. Pull requests should describe the change, list verification commands run, mention any required Cloudflare configuration, and include screenshots for visible UI changes. Link related issues when available.

## Security & Configuration Tips

Do not commit secrets. Configure production values through Cloudflare Pages variables and secrets. Required production integrations include D1 binding `DB`, R2 binding `FILES`, `RESEND_API_KEY`, `NOTIFY_EMAIL`, and `PUBLIC_SITE_URL`. Keep `wrangler.toml` binding names aligned with API route usage.
