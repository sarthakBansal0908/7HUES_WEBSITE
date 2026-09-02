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

## Redesign Pass 2 (2026-08-29) — clean professional layout (road removed)
- Per user feedback, REMOVED the winding road + motorcycle from the homepage (was causing awkward empty space).
- Rebuilt as one continuous warm cream canvas with UNIFORM vertical rhythm (py-24 md:py-32, max-w-[1400px]) via shared SectionHeader.
- Section order: 01 ABOUT US (intro + 4-person team), 02 WHAT WE DO? (image + 3 differentiators), 03 HOW WE DELIVER? (clean 4-col SOP grid), 04 WHY 7HUES? (balanced image + 4 points), 05 EXPERIENCES (Lusion-style 2-col staggered catalogue grid: image + tags + big title, no CTA), 06 FROM THE ROAD (3 external post links), 07 JOURNAL (3 stories).
- Hero cleaned earlier (no play/progress); mobile headline size reduced to avoid CTA overlap.
- New CMS-editable fields: about.team/team_title, what_we_do.points, experiences.items {title,tags,image}. Admin editors updated.
- Verified by testing agent iteration_6: 100% of 14 acceptance checks on desktop (1440) + mobile (390); road/bike fully gone; no empty-half issues; booking regression passes.
- Screenshot tool is flaky on this page (looping video keeps network busy); rely on testing agent for verification.

## Road + Motorcycle re-integration (2026-09-01) — DONE
- User reversed the earlier removal and asked to bring back the road + bike, done properly.
- `/app/frontend/src/components/RoadJourney.js` rewritten: SVG mountain-switchback path (viewBox 0 0 100 1200,
  preserveAspectRatio="none") drawn behind ALL homepage sections in Home.js. Subtle asphalt band (ink @0.05) +
  dashed centre lane marking (reads as a road, not a snake) + gold "travelled" trace that reveals with scroll.
- Motorcycle rides ALONG the path via arc-length mapping of scroll progress (getPointAtLength) — truly follows the
  road, not a linear glide. Heading = path tangent (atan2(dy,dx)+90, angular-smoothed) so the front wheel always
  points the direction of travel; the bike naturally drifts off/back into view on long near-horizontal traverses.
- New top-view ADV bike art generated (Gemini) + background cut out (PIL floodfill, thresh 60 + low-sat halo clean),
  saved to /app/frontend/public/moto-top.png (front wheel points UP by default). Old front-view moto.png kept unused.
- Responsive sizes: w-12 (mobile) / md:w-16 / lg:w-20. Hidden under prefers-reduced-motion (road still shows).
- Verified via screenshot tool at multiple scroll positions (desktop) — path weaves, bike follows & rotates correctly.

## Road/bike refinements (2026-09-01) — DONE
- Bike art now includes a RIDER (helmet + jacket + gloved hands on bars), top-down, matching illustration quality
  (regenerated via Gemini on white bg, cut out with PIL floodfill). Saved to /app/frontend/public/moto-top.png.
- Bike now rides BEHIND content: moved from z-20 to z-0 (below the z-10 content layer) so opaque photos/cards
  occlude it and it only shows in the negative space — no longer steals attention or covers text/images.
- Size reduced ~18%: w-[40px] / md:w-[52px] / lg:w-[66px].
- Heading now respects scroll direction: faces DOWN when scrolling down (~166\u00b0) and flips to face UP when scrolling
  up (~9\u00b0), via a debounced scroll-direction flag (+180 on reverse) with angular smoothing. Verified by screenshots.
- Footer now sits inside the RoadJourney wrap so the road leads into it. On arrival (p >= 0.9) the bike is brought to
  the FRONT (z-index 20) and clamped clear of the bottom edge, so it parks FULLY visible on the cinematic footer
  (fixed the earlier half-cut bike at the main/footer boundary). Elsewhere it stays behind content (z 0).

## Footer overlap fix v2 (2026-09-01) — DONE (final)
- Reverted the footer-into-wrap restructure + the position "parking" (which made the bike jump to vertical in the
  footer middle). Footer is back OUTSIDE the road wrap; main keeps bg-sand; bike keeps its natural motion/rotation.
- Pure stacking fix: bike zIndex = 5; section content container is z-10; footer given `isolate` (own stacking context).
  So the bike sits ABOVE the whole footer (fully visible at the footer's upper edge) but BELOW mid-section content
  (stays behind photos/text in the middle). No reposition, no jump. Verified via screenshots (arrival + bottom).

## Refinement Pass 1 (2026-08-27) — homepage art direction
- Motorcycle now MUCH smaller and glides at the viewport vertical centre while moving horizontally along the road (banks with direction). Road drifts far across the page horizontally, creating negative space.
- Navbar trimmed to EXPERIENCES / INFO & FAQ / JOURNAL; more translucent over hero.
- Removed decorative divider lines next to section indices; larger, more confident condensed headlines; minimal borders/cards.
- Warmer paper background (#ECE4D6). Added feathered/organically-masked photography (.feather) on key images; larger, more asymmetric compositions.
- Seamless dark-hero → paper-journey transition band. Cinematic image-driven footer (lighter overlay, photo visible).
- Verified by testing agent iteration_2 (frontend 90%; only nit was bike size, since reduced).

## Brand wordmark image (2026-09-01) — DONE
- Added CMS field settings.brand_image (Site Settings tab, ImageInput). When set, it REPLACES the brand text
  ("7HUES / EXPEDITIONS") in the header (desktop + mobile menu) and the footer bottom bar; text remains the fallback.
- Rendered via <img class="h-9/h-8 w-auto object-contain"> (data-testid brand-wordmark-header / -footer). Circular
  logo (settings.logo) kept alongside. Backend already persists arbitrary settings keys ($set). Verified end-to-end
  by temporarily injecting an image (swap confirmed), then reverting to empty.

## Hero YouTube/Vimeo support (2026-09-02) — DONE
- Bug: Hero used a native <video src> tag, which cannot play a YouTube/Vimeo link (only direct file URLs / uploads).
- Fix: Hero.js now resolveVideo(url) — detects YouTube (youtu.be / watch / embed / shorts) & Vimeo IDs and renders a
  full-screen background <iframe> (autoplay+mute+loop+no-controls, cover via 177.78vh/56.25vw trick, origin param);
  falls back to <video> for direct/uploaded files; poster shown as underlay. testids: hero-video-embed / -file.
- Note: the automated preview/headless browser blocks YouTube playback (shows "Video unavailable" for ANY video incl.
  a known-embeddable control), so it cannot be visually verified here — plays in real browsers. If a specific video
  still says unavailable in a real browser, its owner disabled embedding → use a different link or upload the file.

## Info & FAQ page + CMS (2026-09-02) — DONE (tested 100%)
- New editorial page at /info (InfoFAQ.js): eyebrow/heading/intro, 14 category accordions (numbered, thin dividers),
  each expands to question sub-accordions with rich-text answers (paragraphs, "- " bullets, **bold**), Open all/Close
  all controls, cinematic contact ending (WhatsApp/Email/Instagram derived from Site Settings + Social), real Footer.
- Content stored under content.info_faq; parsed from supplied markdown into /app/backend/info_faq_seed.json (14 cats /
  33 Qs), seeded into DB and into default_content() for fresh installs. server.py: import json + _load_info_faq_seed().
- Full CMS: Admin.js 'Info & FAQ' tab (InfoFaqEditor) — edit eyebrow/heading/intro; add/remove/reorder/rename
  categories with Visible/Hidden toggle; nested add/remove/reorder questions with edit q&a + Visible/Hidden toggle;
  edit contact section (eyebrow/heading/body/labels/closing line). New Toggle field in AdminFields.js.
- Public page hides disabled categories, disabled questions, and empty-question rows. Route wired in App.js.
- Verified by testing_agent (iteration_8.json): all public interactions + CMS edit/toggle/save-persistence PASS.

## Code review response (2026-09-02)
- Applied 1 safe fix: Admin.js logout empty catch now logs via console.warn (was swallowing errors). Verified by
  testing_agent iteration_9.json — homepage/info/admin-logout all pass 100%, no regressions.
- Assessed the rest as FALSE POSITIVES / regression-risky and intentionally left unchanged:
  * "eval() security" = `mongo_eval()` helper running `mongosh --eval` via subprocess (test-only); no Python eval().
  * "is -> ==" = all are correct `is None` / `is True` / `is False` idioms (PEP8); changing would be an anti-pattern.
  * "missing hook deps" = intentional mount-once setup effects (scroll/Lenis/OAuth/content fetch); adding the (partly
    nonsensical, e.g. local vars) deps would break the scroll-motorcycle animation / cause loops.
  * component/function refactors + trivial useMemo = skipped to avoid regressions on a working, tested app.
  * array-index keys = public lists load wholesale and don't reorder at runtime (acceptable per report's own caveat).

## Book Your Ride polish (2026-09-02) — DONE (tested 100%)
- /book redesigned (Book.js): premium two-column editorial layout — left panel (heading, intro, "What happens next"
  3 steps, direct WhatsApp/Email/Instagram from settings/social); right grouped form ("About you" / "Your ride") with
  selects for riding experience & number of riders, placeholders, inline validation (required + email regex,
  data-testid booking-error) replacing alert(), and a richer personalised success screen with WhatsApp quick-contact.
- Admin Bookings tab (Admin.js): enriched table (Received date, Name+City, Contact, Expedition+Dates, Rider info,
  Message, per-row Status dropdown), enquiry/new counts, gold left-border highlight for 'new'.
- Backend: added PATCH /api/bookings/{id} (admin) to set status new|contacted|closed. POST/GET unchanged.
- Verified by testing_agent iteration_10.json: backend 8/8, frontend 100% (render, validation x2, happy path,
  admin list shows submitted enquiry end-to-end, status persist). Test bookings cleared afterwards (list = 0).
