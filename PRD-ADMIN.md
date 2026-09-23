# PRD — Admin Panel for Green Decor (Next.js + Firebase)

## Context

The "green-decor" site is a Next.js 16 App Router app (React 19, TypeScript, Zustand, Tailwind CSS v4, lucide-react, Firebase Auth + Firestore already configured in `src/lib/firebase.ts`). Today all content is static (imports from `src/lib/data/*.ts` and hardcoded Zustand stores). Goal: build `/admin` routes + a Firestore-backed data layer, then wire the customer-facing site to read live data from Firestore with static data as an offline fallback.

## Design system (must match existing site)

- Colors: primary `#14402a` (deep green), accent `#d47343` (terracotta orange), light backgrounds `#f4f7f2`, `#eaf0e7`, borders `#e5ece3` / `#f0f4ee`, text `#172b21` / `#52685a`.
- Fonts: Playfair Display for headings (class `font-serif`), Plus Jakarta Sans for body, Alex Brush script (`font-script`) for decorative copy.
- Curvy rounded cards (`rounded-2xl` / `rounded-3xl`), soft shadows, pill buttons, generous whitespace. The admin should feel like a natural extension of the brand, not a boilerplate dashboard.
- Admin layout: fixed dark-green sidebar (`bg-[#14402a]`) with lucide-react nav icons, light content area, top bar with breadcrumb + admin avatar.
- Mobile: sidebar collapses to a hamburger drawer.

## Auth & Roles (Firebase)

- Use existing Firebase Auth (email/password + Google). Add a Firestore `users` collection doc per user: `{ uid, name, email, phone, photoURL, role: 'admin' | 'staff' | 'customer', status, createdAt, lastLogin }`.
- Role via custom claims OR Firestore role field; enforce with a middleware/guard in the `/admin` layout that checks the Firestore role and rejects non-admins.
- `/admin/login` page with email/password (self-hosted admin credential seed — provide a seed script that creates the first admin, using admin credentials from env).
- Seed script (`scripts/seed-admin.ts` or an npm script) to create the first admin user + an optional one-click seed of demo Firestore data from the existing static files.

## Firestore collections (map existing `src/types/index.ts` 1:1)

- `products` → Product
- `services` → ServiceItem
- `promos` → PromoSlide
- `testimonials` → Testimonial
- `orders` → Order
- `serviceRequests` → ServiceRequest
- `users` → UserProfile + role
- `coupons` → new collection: `{ code, type: 'percent' | 'flat', value, minOrder, active, usageLimit, usedCount, expiresAt, createdAt }`
- `settings` → single doc `general`: `{ whatsappNumber, contactPhone, contactEmail, address, workingHours, shippingFreeThreshold, shippingFlatFee, currencyLabel, deliveryCities[], supportedProvinces[] }`
- `siteContent` → one doc per section: `heroSlides[]`, `purpose`, `trustBar`, `howItWorks`, `footer`, `megaMenu`, etc.
- `contactInquiries` → contact form messages (name, email, phone, subject, message, createdAt, status)

## Admin modules (sidebar sections)

### 1. Dashboard
- KPI cards: today's orders, revenue, new quotes, low-stock count, pending testimonials.
- 7/30-day sales line chart (pure SVG — no new chart dependency).
- Recent 5 orders list, top 5 products by revenue, quick links.
- All computed live from Firestore queries.

### 2. Orders
- Table: order ID, date, customer, city, items count, total, payment method + status pill, order status pill. Filter by status; search by ID / phone / name.
- Detail drawer/page: full address, items with images/qty/price, totals (subtotal, discount, shipping), payment info, status timeline, status stepper (placed → confirmed → processing → shipped → delivered | cancelled), update status with optional note (appends to `statusHistory`), edit `paymentStatus`, set/add `trackingNumber`.
- Auto-adjust stock when order ships or is cancelled.

### 3. Products
- Table/grid with image thumb, name, category, price (salePrice shown struck-through), stock with low-stock badge, rating, featured/isNew toggles, inStock toggle.
- Create/Edit form: name, slug (auto from name), category dropdown, categoryLabel, prices, multi-image URL list (add/remove/reorder), stock, rating, reviewCount, shortDescription, description, `careInstructions` block (sunlight, water, difficulty, petFriendly, indoor), `details` block (height, potSize, material, origin), tags (chips input), featured, isNew checkboxes.
- Image URL input = paste URL + optional Firebase Storage upload helper.
- Delete with confirmation. Bulk actions: set stock, mark featured.

### 4. Services
- List of ServiceItem cards.
- Create/Edit: title, slug, shortDescription, fullDescription, heroImage, icon picker (Leaf / Trees / Fish / Gift / Home / Sparkles), pricingRange, features (repeatable), benefits (title + desc), process (step + title + desc, ordered), gallery images, faqs (question + answer).
- Public pages are built from these fields, so keep field sets exact.

### 5. Service Quotes / Requests
- Table of `serviceRequests` from the site's "Request a Quote" forms: service title, name/phone/email, city, propertyType (Residential / Commercial / Office / Balcony / Terrace / Other), budget, message, createdAt, status (new → contacted → consultation_scheduled → completed).
- Filter + mark status + WhatsApp/call quick-action buttons using `settings.whatsappNumber`.

### 6. Testimonials
- Admin inputs customer testimonials: name, role, city, quote, rating (1–5), photoUrl, serviceOrProduct, featured toggle.
- List with featured star, approve/publish toggle.

### 7. Promos / Banners
- CRUD for `promos`: kicker, title, subtitle, ctaLabel, ctaHref, badge, bgGradient (pick from curated green gradient presets), imageUrl, active toggle, order (drag or up/down).
- Live preview card.

### 8. Coupons / Discounts
- Full CRUD for `coupons` (replaces the hardcoded codes in `src/lib/store/useCartStore.ts`).
- Enable, set % / flat value, min order, expiry, usage limit.
- Cart page + checkout read coupons from Firestore.

### 9. Site Content / CMS
- Edit without redeploying:
  - Hero: 3 slides (title lines, subtitle, image, wallScript, badge word/lines).
  - Promo/carousel covered in Promos module; allow on/off toggle here too.
  - Purpose section (heading, subcopy, 4 pillar labels, quote).
  - TrustBar stats (4 numbers/labels + note).
  - Services grid heading + which services show (order).
  - Contact page: address, phones, emails, hours (from `settings.general`).
  - Footer/misc text copy.
- Each section: preview + "Publish" (save draft/published in doc).

### 10. Users
- Table of Firestore `users`: name, email, phone, role, status, signup date, orders count, total spent.
- Promote/demote to admin/staff, disable account, view customer detail + their orders.
- Optional: send password-reset email via Firebase Admin (note if out of scope).

### 11. Settings
- Store configuration form writing to `settings.general`: WhatsApp number, phone, emails, address, working hours, free-shipping threshold + flat fee (replaces the hardcoded 4000/350 in `src/lib/store/useCartStore.ts`), delivery cities list, provinces list.
- Saves to Firestore; site reads live.

### 12. Store-front sync (REAL DATA FLOW — core requirement)
Remove/replace static imports so the customer site reads Firestore live:
- `products`, `services`, `promos`, `testimonials` → realtime listeners or refetch with a small custom hook (no new dependency — build a `useFirestoreCollection` / `useFirestoreDoc` hooks file).
- Cached fallback: if Firestore is empty/unavailable, fall back to the existing static data files so the site never breaks during migration.
- `useCartStore.applyPromoCode` and shipping-fee logic → read from Firestore `coupons` + `settings.general` (make these store methods async; update call sites in CartDrawer / checkout).
- Checkout `createOrder` → also write order to Firestore `orders` (keep local Zustand as cache).
- Service quote + contact forms → save to Firestore `serviceRequests` + `contactInquiries`.
- `useOrdersStore` for logged-in users → sync from Firestore `orders` where `userId == current uid`.

## Technical requirements

- All new code under `src/app/admin/**`, `src/components/admin/**`, `src/lib/firestore/**` (Firebase imports `getFirestore`, `getStorage`).
- Route group `/admin` with its own layout, guards, 403/404 states, loading spinners matching brand.
- Forms: minimal custom components (TextInput, Select, Textarea, ImageDrop/URL input, Toggle, ChipsInput, RepeatableField) styled to brand — do NOT add a heavy form library unless already present.
- Confirm modals for destructive actions; toasts for success/error; skeleton loaders on tables.
- Firestore helpers: serialize/deserialize timestamps, slugify, PKR formatter (reuse `formatPKR` in `src/lib/utils.ts`).
- Add `scripts/seed-firestore.ts` that imports `productsData`, `servicesData`, `promoSlidesData`, `testimonialsData` and seeds Firestore.
- Don't break existing TS types — extend `src/types/index.ts` only by addition (Coupon, ContactMessage, Role, SiteSettings, SiteContent).
- Run `npm run lint` and `npm run build` to verify. TypeScript strict.

## Acceptance criteria

- Admin can sign in and, on every module: create → see it live on the public site immediately → edit → publish again → delete/archive.
- Order status updates reflect on the customer's `/orders/[id]` page and account immediately.
- Coupons, shipping threshold, WhatsApp number are editable in admin and respected by cart / checkout / contact instantly.
- Site works even if Firestore seed is empty (static fallback).
- No new third-party chart/UI/form libraries.