# Mission Control — Personal Consulting Dashboard

## What This Is

A personal command center for managing consulting clients, meetings (via Fireflies API), and tasks (via Todoist API). Features a warm amber/gold/copper glassmorphism UI with sunset ocean background, responsive mobile layout, and real-time data sync. Built with Next.js 14 App Router, TypeScript, and Tailwind CSS.

## Core Value

The dashboard must remain fully functional and usable — every view, filter, and real-time data feed must work correctly, wrapped in a warm amber glassmorphism aesthetic.

## Requirements

### Validated

- ✓ Warm CSS custom property token system (amber, gold, copper, orange) — v1.0
- ✓ Dark brown/amber background gradient with sunset ocean image — v1.0
- ✓ Saturated glass card backdrop-filter with warm amber tints — v1.0
- ✓ Ambient radial gradient orbs with drift animations — v1.0
- ✓ Glass card system with inset gold hairline, amber hover halo, warm hover-lift — v1.0
- ✓ Gradient text headings in amber/gold/copper spectrum — v1.0
- ✓ All ~105 inline cool-color Tailwind classes replaced across page frame and 3 view components — v1.0
- ✓ Semantic green/red status indicators preserved alongside warm palette — v1.0
- ✓ Slim icon-above-label sidebar with breathing logo orb pulse — v1.0
- ✓ Mobile hamburger drawer, compressed header, responsive grids at 640px breakpoint — v1.0
- ✓ Dashboard overview with stats grid, quick actions, and recent activity — existing
- ✓ Client Command Center with filters, client grid, and detail modals — existing
- ✓ Meeting Intelligence with real-time Fireflies sync — existing
- ✓ Task Mission Control with real-time Todoist sync — existing
- ✓ Sidebar navigation between 4 views — existing
- ✓ Header with search, notifications, settings, and user profile — existing
- ✓ Real-time polling (30s) for meetings and tasks — existing
- ✓ HTTP Basic Auth middleware — existing

### Active

(None — next milestone not yet planned)

### Out of Scope

- Photo/video background — performance cost, degrades glassmorphism readability
- Animated background gradient — GPU idle prevention issues, battery drain
- Blur above 15px — exponentially GPU-expensive, 12px is optimal
- Mouse-tracking glow effect — hundreds of repaints/sec at dashboard scale
- Glassmorphism on search input — stacked backdrop-filters cause performance issues
- Mobile-specific redesign beyond 640px breakpoint — Phase 6 delivered sm breakpoint; tablet breakpoints not in scope
- Replacing semantic green/red status colors — destroys meaning
- Adding new features or views — styling only in v1.0
- Changing data layer, API routes, or hooks — purely presentational in v1.0
- CSS animated gradient border on active sidebar item (deferred to v2 as ANIM-01)
- Gold shimmer sweep on quick action CTA hover (deferred to v2 as ANIM-02)

## Context

- **Shipped:** v1.0 Warm Amber/Gold Glassmorphism Redesign (2026-02-25)
- **Codebase:** 2,227 LOC TypeScript/CSS across ~10 source files
- **Tech stack:** Next.js 14 App Router, TypeScript, Tailwind CSS 3.3, Lucide React, Recharts (installed, unused)
- **Key files:** `globals.css` (tokens + component classes), `page.tsx` (main layout), 3 view components, 2 API routes
- **Styling approach:** CSS custom properties in `:root` + Tailwind `@layer components` in globals.css + inline Tailwind classes
- **Known tech debt:** Recharts installed but unused (warm palette must be applied if charts are added)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dependency-ordered phases (tokens → classes → page → views → sidebar → mobile) | Each layer builds on previous; prevents rework | ✓ Good — zero regressions between phases |
| Warm gradient background with sunset ocean image | Atmospheric depth without performance cost | ✓ Good — user approved, fast loading |
| Icon-above-label sidebar (not icon-only) | Preserves discoverability while slimming down | ✓ Good — readable at w-20 |
| All warm tone accents (no cool/warm mixing) | Cohesive aesthetic, no palette clash | ✓ Good — zero cool-color residuals confirmed by audit |
| saturate(140%) for backdrop-filter | Rich glass bleed-through without oversaturation | ✓ Good |
| --accent-gold (#f5a623) vs --warning (#E8720C) as distinct tokens | Prevent amber/warning collision | ✓ Good — visually distinct hues |
| bg-[#1a0f00]/95 for drawer (not backdrop-filter) | Avoid iOS Safari compositing issues with stacked backdrop-filters | ✓ Good — works cross-browser |
| grid-cols-2 on mobile (not grid-cols-1) | Maximize screen real estate | ✓ Good — user preference confirmed |
| sm: (640px) as single mobile breakpoint | Consistent, simple responsive system | ✓ Good — clean breakpoint across all components |
| MOBILE-01..05 backfilled as v1 requirements | Fully delivered by Phase 6, should be tracked | ✓ Good — 26/26 coverage |

## Constraints

- **Tech stack**: Must use existing Tailwind CSS — no new CSS framework
- **Functionality**: Zero regression — all features work identically after redesign
- **Layout**: Keep current grid structures — only restyle, don't restructure
- **Colors**: Fully warm palette — no cool blues/purples remaining
- **Performance**: GPU-composited animations only; no per-frame repaints

---
*Last updated: 2026-02-25 after v1.0 milestone*
