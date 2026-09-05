# DISPATCH — Explorer 2 (PDP Architecture, Data Layer & Fallbacks)

## Task Assignment
Investigate existing storefront PDP architecture, routing, server components, data fetching, and fallback strategy.

## Reference Files
- `c:\Users\WDAGUtilityAccount\Documents\Nova pasta\.agents\ORIGINAL_REQUEST.md` (MUST READ FIRST)
- `c:\Users\WDAGUtilityAccount\Documents\Nova pasta\apps\storefront\app\(shop)\produto\[handle]\page.tsx`
- `c:\Users\WDAGUtilityAccount\Documents\Nova pasta\apps\storefront\lib\` (medusa SDK, formatters, etc.)
- `c:\Users\WDAGUtilityAccount\Documents\Nova pasta\apps\storefront\components\`
- `c:\Users\WDAGUtilityAccount\Documents\Nova pasta\packages\types\`

## Deliverables

## 2026-09-05T01:02:19Z
Investigate existing storefront PDP architecture and data layer:
1. Analyze `apps/storefront/app/(shop)/produto/[handle]/page.tsx` in detail: how are product data fetched (`getProductByHandle`), breadcrumbs, SEO metadata (`generateMetadata`), JSON-LD, prices, formatters (`formatBRL`), and action buttons implemented?
2. Analyze how products are modeled and how we can differentiate a 3D-enabled product (e.g., handle `luminaria-pendente-macrame-ninho`) vs generic/classic products (e.g., `painel-macrame-aura-algodao`) so classic products are NOT broken.
3. Check `apps/storefront/lib/` and Medusa integration or mock data used by the storefront.
4. Review components in `apps/storefront/components/` to see conventions for UI, product cards, client vs server components.
5. Propose clean architectural integration for 3D PDP vs Classic PDP.
