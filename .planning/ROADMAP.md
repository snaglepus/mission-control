# Roadmap: Mission Control — UI Redesign

## Overview

A targeted visual reskin of the Mission Control dashboard from cool neon (cyan/purple/pink on navy-indigo) to warm amber/gold/copper glassmorphism. The redesign proceeds in dependency order: color tokens and background first, then shared CSS classes, then the page frame, then view components, then sidebar restructure and final polish. Every visual change is isolated to CSS values and Tailwind class substitutions — no functional changes, no new components, no new packages.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** - Define warm color tokens in CSS variables and shift background gradient to deep brown-amber (completed 2026-02-24)
- [x] **Phase 2: Glass Card System** - Update shared glassmorphism CSS classes to warm amber tints, borders, and glow effects (completed 2026-02-24)
- [x] **Phase 3: Typography & Page Frame** - Replace gradient text and all inline cool-color classes in page.tsx (header, dashboard overview) (completed 2026-02-25)
- [x] **Phase 4: View Components** - Replace all cool-color inline classes in ClientCommandCenter, MeetingIntelligence, and TaskMissionControl (completed 2026-02-25)
- [x] **Phase 5: Sidebar & Polish** - Restructure sidebar to slim icon-above-label format and apply warm active states and logo orb (completed 2026-02-25)

## Phase Details

### Phase 1: Foundation
**Goal**: The warm color token system is defined and the background gradient is warm — every downstream change has a correct base to build on
**Depends on**: Nothing (first phase)
**Requirements**: FNDTN-01, FNDTN-02, FNDTN-03, FNDTN-04
**Success Criteria** (what must be TRUE):
  1. Visiting the app shows a warm dark brown-amber background gradient instead of the navy-indigo background
  2. CSS custom properties for amber, gold, copper, and warm-text are defined in `:root` and visible in DevTools
  3. A glass card with `backdrop-filter` toggled off is still visible against the background (confirms background has sufficient saturation)
  4. `--accent-gold` and `--warning` are distinct tokens with visually different shades (no amber/warning collision)
**Plans:** 2/2 plans complete
Plans:
- [ ] 01-01-PLAN.md — Warm color tokens, background gradient, and glass card saturate
- [ ] 01-02-PLAN.md — Ambient atmospheric orbs with drift animation

### Phase 2: Glass Card System
**Goal**: All shared glassmorphism classes in `globals.css @layer components` use warm amber tints, borders, and glow effects so every card inherits the warm look without per-card changes
**Depends on**: Phase 1
**Requirements**: GLASS-01, GLASS-02, GLASS-03, GLASS-04, GLASS-05
**Success Criteria** (what must be TRUE):
  1. Glass cards render with a warm brown-amber tint background instead of the previous cool-dark tint
  2. Card borders glow amber on hover instead of indigo
  3. Cards show an inset gold highlight on the top edge simulating light on glass
  4. Hovering a card produces an amber warm shadow bloom instead of a neutral shadow
  5. Running `grep -n "from-indigo\|from-cyan\|from-purple" src/app/globals.css` returns zero results in `@layer components`
**Plans:** 1/1 plans complete
Plans:
- [ ] 02-01-PLAN.md — Warm glass card rest/hover states, top-edge gold highlight, and hover-lift refinement

### Phase 3: Typography & Page Frame
**Goal**: All gradient text, dividers, and the ~45 inline cool-color Tailwind classes in `page.tsx` are replaced with warm equivalents — the persistent header and dashboard overview are fully warm
**Depends on**: Phase 2
**Requirements**: TYPO-01, TYPO-02, TYPO-03, TYPO-04
**Success Criteria** (what must be TRUE):
  1. Gradient text headings display amber → gold → copper spectrum instead of cyan/purple
  2. Stat values show a warm amber text glow instead of cool glow
  3. Dividers and borders throughout the page frame use amber tint instead of indigo tint
  4. Keyboard-navigating the header and dashboard overview produces zero cyan/purple/pink color flashes on hover or focus
  5. `grep -n "cyan\|purple\|pink\|indigo" src/app/page.tsx` returns zero results
**Plans:** 1 plan

Plans:
- [ ] 03-01-PLAN.md -- Warm utility class rewrites (globals.css) + inline Tailwind class substitutions (page.tsx) + visual verification

### Phase 4: View Components
**Goal**: All three view components (ClientCommandCenter, MeetingIntelligence, TaskMissionControl) have their ~60 inline cool-color Tailwind classes replaced with warm equivalents, and Recharts chart colors are updated to the warm palette
**Depends on**: Phase 3
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04, COMP-05
**Success Criteria** (what must be TRUE):
  1. Switching to any view shows a fully warm amber/gold color palette with no remaining cyan, purple, or pink elements
  2. Status indicators (active/prospective/at-risk) remain visually distinct and semantically legible — green/red semantic colors preserved
  3. Charts and data visualizations render in warm amber/orange/gold colors instead of cool neon colors
  4. Running `grep -rn "cyan\|purple\|pink\|indigo" src/components/` returns zero results across all three view files
  5. Chrome DevTools accessibility audit on any rendered view card passes contrast ratio requirements
**Plans:** 2/2 plans complete

Plans:
- [x] 04-01-PLAN.md — Warm color substitution across all three view components (ClientCommandCenter, MeetingIntelligence, TaskMissionControl)
- [x] 04-02-PLAN.md — Cross-file grep verification and visual checkpoint

### Phase 5: Sidebar & Polish
**Goal**: The sidebar is restructured to slim icon-above-label format with warm active states and logo orb, a sunset ocean background image adds atmospheric depth behind glassmorphism panels, and ambient orbs layer on top for warm depth
**Depends on**: Phase 4
**Requirements**: SIDE-01, SIDE-02, SIDE-03
**Success Criteria** (what must be TRUE):
  1. The sidebar displays icons centered above small text labels — not side-by-side — and all four navigation items are readable without truncation
  2. The active sidebar item shows an amber/orange gradient background and indicator bar instead of indigo
  3. The logo orb uses an amber-to-orange gradient with warm glow instead of cool colors
  4. A sunset ocean background image is visible behind glass panels with a darken overlay, and ambient orbs float on top
**Plans:** 2/2 plans complete

Plans:
- [x] 05-01-PLAN.md — Background image CSS, sidebar restructure to slim icon-above-label layout, logo orb pulse animation (includes visual verification at Task 3 human-verify checkpoint)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete   | 2026-02-24 |
| 2. Glass Card System | 1/1 | Complete   | 2026-02-24 |
| 3. Typography & Page Frame | 1/1 | Complete   | 2026-02-25 |
| 4. View Components | 2/2 | Complete   | 2026-02-25 |
| 5. Sidebar & Polish | 2/2 | Complete   | 2026-02-25 |

### Phase 6: Fix incomplete design changes - header and nav

**Goal:** The Mission Control dashboard is fully responsive for mobile devices — sidebar converts to a hamburger drawer, header compresses to essential elements, spacing/fonts tighten for mobile density, stats grids show 2 columns, and all view components work on narrow screens (640px breakpoint)
**Depends on:** Phase 5
**Requirements:** MOBILE-01, MOBILE-02, MOBILE-03, MOBILE-04, MOBILE-05
**Plans:** 2/2 plans complete

Plans:
- [ ] 06-01-PLAN.md — Sidebar-to-drawer conversion, header compression, dashboard overview responsive
- [ ] 06-02-PLAN.md — All three view components (Clients, Meetings, Tasks) responsive for mobile

---
*Roadmap created: 2026-02-24*
