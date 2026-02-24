---
phase: 01-foundation
plan: 02
subsystem: ui
tags: [css, animation, glassmorphism, ambient-orbs, keyframes, gpu-composited]

# Dependency graph
requires:
  - phase: 01-01
    provides: "Warm amber/gold CSS token system, dark brown body gradient, saturated glass card backdrop-filter"
provides:
  - "3 ambient radial gradient orbs (gold, rose/burnt sienna, copper) in layout.tsx"
  - "Ambient orb CSS with position: fixed, z-index: 0, pointer-events: none"
  - "3 staggered @keyframes orb-drift animations (~28-35s cycles, GPU-composited)"
  - "Complete Phase 1 warm foundation visually verified by user"
affects: [02-glass-morphism, 03-page-frame, 04-view-components, 05-sidebar]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Ambient orbs via position: fixed wrapper with pointer-events: none to avoid click interception"
    - "GPU-composited animations — only transform and opacity animated, never filter/background/layout properties"
    - "will-change: transform, opacity on animated elements for compositor layer promotion"
    - "aria-hidden=true on purely decorative DOM elements"
    - "z-index layering: orbs at z-0, page content above"

key-files:
  created: []
  modified:
    - src/app/globals.css
    - src/app/layout.tsx

key-decisions:
  - "Orb opacity range 0.25-0.5 — visible as distinct warm glow spots but not dominant over UI content"
  - "Three warm sunset colors (gold #f5a623, burnt sienna #b4503c, copper #c9752a) for depth variety vs monochrome"
  - "Drift displacement 20-40px max — stays in single compositor tile, avoids large repaint areas"
  - "filter: blur(80px) set statically (not animated) — set once, no per-frame repaint cost"
  - "Phase 1 foundation visually approved by user — warm background, orbs, glass saturation, and token distinction all pass"

patterns-established:
  - "Decorative DOM: aria-hidden=true on all non-content ambient/atmospheric elements"
  - "Animation performance: only transform and opacity for any animated UI element — never width/height/filter/background"
  - "Layering: decorative background elements use position: fixed with z-index: 0, content always above"

requirements-completed: [FNDTN-04]

# Metrics
duration: ~5min
completed: 2026-02-24
---

# Phase 1 Plan 2: Ambient Orbs Summary

**3 warm atmospheric orbs (gold, rose, copper) with GPU-composited drift animations positioned behind glass UI panels — Phase 1 warm foundation visually approved**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-24T09:35:00Z
- **Completed:** 2026-02-24T09:39:48Z
- **Tasks:** 2 (1 auto, 1 human-verify checkpoint)
- **Files modified:** 2

## Accomplishments

- Added `.ambient-orbs` wrapper with 3 `.orb` divs to layout.tsx as first child of `<body>` before `{children}`, with `aria-hidden="true"`
- Added 3 orb CSS classes with warm radial gradients: gold (600px, top-left), burnt sienna (500px, bottom-right), copper (400px, center-right)
- Implemented 3 staggered `@keyframes orb-drift-N` animations (28s/30s/35s) using only `transform` and `opacity` for GPU-composited, paint-free animation
- Applied `pointer-events: none` to wrapper — orbs do not intercept any dashboard clicks
- Applied `will-change: transform, opacity` on `.orb` for compositor layer promotion
- User visually approved complete Phase 1 foundation: warm background, distinct orb glow spots, warm glass bleed-through, and token distinction

## Task Commits

Each task was committed atomically:

1. **Task 1: Add ambient orb markup and CSS with drift animations** - `c19d53a` (feat)
2. **Task 2: Visual verification checkpoint** - User approved (no code changes — verification gate)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified

- `src/app/globals.css` - `.ambient-orbs`, `.orb`, `.orb-1/2/3` classes with warm radial gradients; `@keyframes orb-drift-1/2/3` animations
- `src/app/layout.tsx` - Added `<div className="ambient-orbs" aria-hidden="true">` wrapper with 3 orb child divs before `{children}`

## Decisions Made

- Opacity range 0.25-0.5 chosen — visible as distinct warm glow spots, not background haze or dominant overlay
- Three distinct warm sunset colors (gold, rose/burnt sienna, copper) rather than monochrome gold for atmospheric depth variation
- Drift displacement kept to 20-40px max to stay within single compositor tile and avoid repaints
- `filter: blur(80px)` applied statically (not animated) — zero per-frame cost, GPU handles static blur once
- Phase 1 foundation approved after user visual verification: warm background confirmed not navy/indigo, orbs visible with distinct colors, glass cards show warm bleed-through, click interactions unaffected

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Complete Phase 1 warm foundation is done and visually approved — all downstream phases can build on this base
- Phase 2 (glass morphism) can proceed: warm tokens, gradient background, saturated glass cards, and ambient orbs are all in place
- Concern from Phase 1 STATE.md (near-black background, backdrop-filter visibility) is now resolved — user approved the visual foundation in this checkpoint
- z-index layering established: decorative layer at z-0, content above — Phase 3+ page frame should respect this layering

---
*Phase: 01-foundation*
*Completed: 2026-02-24*
