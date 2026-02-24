---
phase: 03-typography-page-frame
plan: 01
subsystem: ui
tags: [tailwind, css, warm-palette, amber, glassmorphism, typography]

# Dependency graph
requires:
  - phase: 02-glass-card-system
    provides: Glass card hover states and warm amber box-shadow system that this plan's page frame builds on top of
  - phase: 01-foundation
    provides: CSS custom properties (--accent-gold, --text-secondary, warm token system) consumed by globals.css utility classes
provides:
  - Warm globals.css utility classes: .gradient-text, .neon-text, .neon-border, .sidebar-item, .glow-cyan (warm in-place), .glow-purple (warm in-place), .text-glow (hover-only)
  - Fully warm page.tsx: sidebar, header, stats, quick actions, recent activity all use amber/gold/orange palette
  - Zero cool-color references in both files (grep verified)
affects: [04-view-components, 05-sidebar-restructure, 06-fix-incomplete-design-changes-header-and-nav]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - In-place warm rename: keep CSS class names (glow-cyan, glow-purple) and update color values to avoid JSX reference mismatches
    - Hover-only text glow: .text-glow uses text-shadow none at rest, .glass-card:hover .text-glow activates 8px warm amber glow
    - Consistent warm gradient direction: 90deg left-to-right for text gradients (amber-300 -> amber-500 -> orange-600), 135deg for border effects, 180deg for vertical sidebar indicator
    - Warm dark background hex: bg-[#1a0f00] replaces bg-[#0f172a] throughout page frame

key-files:
  created: []
  modified:
    - src/app/globals.css
    - src/app/page.tsx

key-decisions:
  - "In-place warm rename: .glow-cyan and .glow-purple class names retained to avoid JSX reference breaks — only color values updated"
  - ".text-glow moved from @layer utilities to @layer components to support :hover pseudo-class parent selector"
  - "Warm gradient direction: 90deg for text (left-to-right amber spectrum), 135deg for borders, 180deg for vertical sidebar bar"
  - "bg-[#1a0f00] replaces bg-[#0f172a] as the warm dark panel background throughout page frame"
  - "User visually approved full warm page frame conversion on 2026-02-25"

patterns-established:
  - "Pattern 1: CSS class in-place warm migration — update color values, keep class names, no JSX touches needed"
  - "Pattern 2: Hover-only glow via parent selector — .glass-card:hover .text-glow — keeps elements inert at rest"
  - "Pattern 3: Data-driven color keys use 'amber'/'orange' string literals in TypeScript (colorMap, stats, activity feed)"

requirements-completed: [TYPO-01, TYPO-02, TYPO-03, TYPO-04]

# Metrics
duration: ~15min
completed: 2026-02-25
---

# Phase 3 Plan 01: Typography & Page Frame Summary

**Warm amber/gold/copper conversion of globals.css utility classes and full page.tsx — zero cool-color (cyan/purple/pink/indigo) references remain in either file**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-02-25
- **Completed:** 2026-02-25
- **Tasks:** 3 (2 auto, 1 checkpoint)
- **Files modified:** 2

## Accomplishments
- Rewrote 7 CSS utility classes in globals.css from cool neon to warm amber (gradient-text, neon-text, neon-border, sidebar-item, glow-cyan, glow-purple, text-glow)
- Replaced all ~31 cool-color Tailwind class references in page.tsx across sidebar, header, stats, quick actions, and recent activity sections
- Achieved zero grep matches for cyan/purple/pink/indigo in page.tsx and zero cool hex values (06b6d4, 8b5cf6, ec4899) in globals.css
- User visually approved warm amber page frame — gradient headings, stat hover glows, amber borders, and warm interactive states all confirmed

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite globals.css utility classes from cool to warm** - `6ea78da` (feat)
2. **Task 2: Replace all inline cool-color Tailwind classes in page.tsx** - `ae21b24` (feat)
3. **Task 3: Visual verification of warm typography and page frame** - checkpoint approved (no code changes)

## Files Created/Modified
- `src/app/globals.css` - All 7 warm utility classes: gradient-text/neon-text/neon-border use amber-300->amber-500->orange-600 gradient; .text-glow is hover-only via .glass-card:hover parent selector
- `src/app/page.tsx` - All sidebar/header/stats/quick-actions/recent-activity use amber/orange/yellow palette; #0f172a replaced with #1a0f00; data-driven colorMap uses "amber"/"orange" keys

## Decisions Made
- In-place warm rename approach chosen for .glow-cyan and .glow-purple: retaining class names prevents JSX reference mismatches while updating color values achieves full warm conversion
- .text-glow relocated from @layer utilities to @layer components — required to support the .glass-card:hover parent selector pattern for hover-only activation
- Gradient directions differentiated by context: 90deg for horizontal text gradients, 135deg for border pseudo-element diagonal, 180deg for vertical sidebar active bar

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None — both files compiled cleanly. Grep verifications confirmed zero cool-color residuals.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Full page frame warm conversion complete — sidebar, header, dashboard overview all render in warm amber palette
- Phase 4 (view components) can build on the established colorMap pattern ("amber"/"orange" string keys) and warm utility classes
- .glow-cyan and .glow-purple available with warm colors for Phase 4 component use
- No blockers or concerns

---
*Phase: 03-typography-page-frame*
*Completed: 2026-02-25*
