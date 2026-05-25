# Browser Acceptance Checklist

This checklist verifies the B2B inquiry template with Codex Browser screenshots. It does not require `@playwright/test` or any project-level Playwright dependency.

## 1. Start Local Site

Run from the repository root:

```bash
pnpm dev
```

Use the local URL printed by Astro, usually:

```text
http://127.0.0.1:4321/
```

## 2. PDP Desktop Screenshot

Open:

```text
http://127.0.0.1:4321/products/planetary-gearbox-hg-series/
```

Use a desktop viewport.

Check:

- `body[data-vertical="machinery"]` exists.
- The right sticky inquiry sidebar is visible.
- At least one `.btn-inquiry` CTA is visible.
- `Request a Quote` is visible.
- Product proof and specification sections render below the hero.

Capture a desktop screenshot with Codex Browser.

## 3. PDP Mobile Screenshot

Use a mobile viewport.

Check:

- Bottom sticky CTA bar is visible.
- Main mobile CTA says `Send RFQ`.
- The CTA points to `#inline-inquiry`.
- The CTA does not cover the visible form submit area or footer content.

Capture a mobile screenshot with Codex Browser.

## 4. Inquiry Form Validation

On the PDP page:

1. Navigate to `#inline-inquiry`.
2. Attempt to submit the form with required fields empty.
3. Confirm browser required validation or inline field errors appear.
4. Do not submit real production buyer data during this check.

## 5. Admin Shell Check

Open:

```text
http://127.0.0.1:4321/admin/inquiries?token=local-admin
```

Check:

- The Inquiry inbox shell renders.
- Filter controls are visible.
- Export CSV button is visible.
- If no local D1 binding is available, the page shows a readable error state instead of crashing.

If `ADMIN_TOKEN` is configured locally, use that token instead of `local-admin`.

## 6. Screenshot Storage

Codex Browser screenshots can remain in the session output.

If local files are needed, save them outside the repository:

```text
/private/tmp/b2b-inquiry-acceptance/
```

Do not commit screenshots unless the project later adopts a formal visual snapshot baseline.

## 7. Completion Evidence

Record the following after a validation run:

- Desktop PDP screenshot captured.
- Mobile PDP screenshot captured.
- Sticky inquiry sidebar verified.
- Mobile CTA verified.
- Form required validation verified.
- Admin shell rendered.
- CSV export link generated.

