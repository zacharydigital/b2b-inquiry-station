# PLP/PDP SEO, AEO, and E-E-A-T Module Plan

This plan defines how product listing pages (PLP) and product detail pages (PDP) should evolve for a high-conversion B2B export inquiry template. It follows Google Search guidance for helpful content, ecommerce pages, product structured data, and AI features.

## Shared Principles

- Keep important content server-rendered in initial HTML.
- Write direct answer blocks that can be extracted by Google AI Overviews and answer engines.
- Add visible trust evidence near claims: certifications, test standards, factory capability, export experience, warranty, and named case studies.
- Use self-referencing canonical URLs, crawlable product images, descriptive headings, and concise meta descriptions.
- Avoid unsupported claims such as fake reviews, unverifiable client logos, or generic “best quality” copy without proof.

## PLP Layout

1. **Category Intent Hero**
   - H1 targets category intent, for example “Industrial Gearboxes Manufacturer”.
   - 40-60 word answer block explains what the category includes, ideal buyers, and sourcing scenarios.
   - Primary CTA: “Request Category Quote”; secondary CTA: “Compare Models”.

2. **Product Finder**
   - Crawlable product cards with static links, model, category, MOQ, lead time, certification badges, and key parameters.
   - Filters must not hide all crawlable content behind client-only rendering.

3. **Category Buying Guide**
   - Short sections for “How to choose”, “Common applications”, “MOQ and lead time”, and “OEM/ODM options”.
   - Use comparison tables for AEO extraction.

4. **Trust and Authority Strip**
   - ISO/CE/RoHS evidence, production capacity, export countries, inspection process, and downloadable capability profile.

5. **FAQ**
   - Natural-language sourcing questions with concise answers.
   - Add FAQ schema only when the visible FAQ content exists on the page.

## PDP Layout

1. **Product Summary**
   - H1 with exact product name and model.
   - Above-fold summary covers application, differentiator, MOQ, lead time, sample availability, and CTA.

2. **Specifications and Selection Data**
   - Full parameter table, variants, compatibility notes, drawing/download links, materials, protection class, and standards.
   - Include Product schema with `name`, `image`, `sku`, `brand`, and `offers` where accurate.

3. **Experience Evidence**
   - Manufacturing process, QC checkpoints, test equipment, tolerances, and packaging/export process.
   - Add dated “last updated” and responsible team/person where possible.

4. **Use Cases and Comparison**
   - Application-specific benefits, replacement/interchange notes, and “this model vs alternatives” table.

5. **Inquiry Conversion**
   - Sticky quote module, inline engineering inquiry form, RFQ cart, file upload, NDA note, and expected reply time.

## Structured Data Targets

- PLP: `BreadcrumbList`, `CollectionPage` or `ItemList`, and FAQ schema when applicable.
- PDP: `BreadcrumbList`, `Product`, and FAQ schema when applicable.
- Organization-level schema should stay in layout or shared SEO utilities.

## Source References

- Google helpful content and E-E-A-T: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google ecommerce SEO guidance: https://developers.google.com/search/docs/specialty/ecommerce
- Google product structured data: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- Google AI features guidance: https://developers.google.com/search/docs/appearance/ai-overviews
