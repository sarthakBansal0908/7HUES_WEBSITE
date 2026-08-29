# 7HUES EXPEDITIONS — PRD & Progress

## Original Problem
Production-ready, cinematic/editorial website for 7HUES Expeditions (premium motorcycle expedition brand).
Signature concept: ONE motorcycle travelling along a minimal winding road that drifts organically
through the whole page as the user scrolls. Fully CMS-driven (no hardcoded content), replaceable media.

## User Choices
- Admin/CMS auth: Emergent-managed Google OAuth.
- Media storage: Emergent cloud object storage.
- V1 priority: HOMEPAGE FIRST (hero showreel + scroll-following motorcycle/road) for approval.
- Motorcycle: photographic on a rendered winding road.
- Content: high-quality placeholders now, replaceable via CMS later.

## Architecture
- Frontend: React 18 (CRA + CRACO), Tailwind, framer-motion, lenis smooth scroll, react-router, react-helmet-async.
  Fonts: Oswald (display), Manrope (body), Space Mono (details).
- Backend: FastAPI + Motor/MongoDB. All routes under /api.
- Storage: Emergent object storage (init at startup, files served via GET /api/files/{path}).
- Auth: Emergent Google OAuth (session cookie); first login bootstraps admin, or ADMIN_EMAILS allowlist.
- Content model: single Mongo doc site_content(_id="homepage") — settings/social/nav/hero + all sections. Seeded on startup.

## Design System
Palette: sand #F4F3F0, charcoal #121212, ink #1A1A1A, stone #5C5C5C, gold #A88151, deep blue #182A40.
Sharp geometric buttons, generous negative space, grain overlay, mask/parallax reveals, prefers-reduced-motion respected.
Logo: /logo.png (circular 7HUES road-mark). Motorcycle marker: /moto.png (green-screen keyed transparent).

## Implemented (2026-08-27)
- Full-stack scaffold from empty repo.
- HOMEPAGE (verified 100% by testing agent):
  - Full-screen cinematic hero showreel (video + poster fallback, play/pause, progress UI, runtime, scroll indicator, CTAs).
  - Sticky header: transparent over hero -> blurred dark on scroll; desktop nav + full-screen mobile menu.
  - RoadJourney: SVG winding road (organic left/right drift) + scroll-linked motorcycle that repositions & banks with scroll.
  - Sections: 01 What We Do, 02 How We Deliver (4 attrs), Why 7HUES (5), 03 Experiences (6 asymmetric tiles),
    05 Our People (avatars + testimonials), From The Road (3 curated social posts, external links), Journal (3 cards).
  - Footer: "THE WORLD IS CALLING. ANSWER IT.", CTA, social links, nav, contact/WhatsApp.
- Book Your Ride page (/book): premium enquiry form -> POST /api/bookings (verified, stores in Mongo).
- Backend endpoints: /api/content (GET public, PUT admin), /api/bookings (POST public, GET admin),
  /api/media (upload/list/delete admin), /api/files/{path} (serve), /api/auth/session|me|logout, /api/health.
- Placeholder pages for Expeditions/Destinations/Experiences/Info&FAQ/Journal/Community/Privacy/Terms (consistent styling).

## Backlog / Next
- P1: Expeditions listing + immersive detail pages (itinerary, inclusions, pricing, FAQs) with own models/routes.
- P1: Destinations discovery pages; Experiences page; Info & FAQ (accordion, categories, search) — all CMS-editable.
- P1: Journal listing + article pages (rich text, media, SEO per-article, shareable URLs).
- P2: SEO polish (sitemap.xml, robots.txt, OG per page), responsive image/video optimization, real brand media swap-in.

## Admin CMS (2026-08-29) — DONE
- Google-login (Emergent OAuth) protected dashboard at /admin. First login auto-becomes admin (or ADMIN_EMAILS allowlist).
- Full editor for every homepage section: Settings, Social, Navigation, Hero, What We Do, How We Deliver, Experiences,
  Why 7HUES, Our People, From The Road, Journal, Footer — all headings/paragraphs/CTA labels+URLs/images/videos.
- Reusable field kit (Text/Area/Select/ImageInput/VideoInput/ListEditor with add/remove/reorder). Every image/video field
  supports upload/replace (Emergent object storage) or paste-URL; external video URLs supported for performance.
- Media Library tab (upload/list/soft-delete, copy URL). Bookings tab (view enquiries).
- Save writes the whole content doc via PUT /api/content -> reflected live on the homepage. Verified 100% by testing agent (iteration_3).

## Notes
- Hero video is a placeholder streaming URL; poster fallback ensures cinematic look. Replaceable via CMS.
- Screenshot tool is flaky on this page (looping video keeps network busy); rely on testing agent for verification.

## Refinement Pass 1 (2026-08-27) — homepage art direction
- Motorcycle now MUCH smaller and glides at the viewport vertical centre while moving horizontally along the road (banks with direction). Road drifts far across the page horizontally, creating negative space.
- Navbar trimmed to EXPERIENCES / INFO & FAQ / JOURNAL; more translucent over hero.
- Removed decorative divider lines next to section indices; larger, more confident condensed headlines; minimal borders/cards.
- Warmer paper background (#ECE4D6). Added feathered/organically-masked photography (.feather) on key images; larger, more asymmetric compositions.
- Seamless dark-hero → paper-journey transition band. Cinematic image-driven footer (lighter overlay, photo visible).
- Verified by testing agent iteration_2 (frontend 90%; only nit was bike size, since reduced).
