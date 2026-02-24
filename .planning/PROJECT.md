# Mission Control — UI Redesign

## What This Is

A visual redesign of the Mission Control consulting dashboard, shifting from a cool neon/indigo glassmorphism aesthetic to a warm amber/gold/copper glassmorphism theme. The app is a personal command center for managing consulting clients, meetings (Fireflies), and tasks (Todoist). This redesign preserves all existing functionality while transforming the visual identity to match a warm, luxurious aesthetic inspired by premium smart home interfaces.

## Core Value

The dashboard must remain fully functional and usable — every view, modal, filter, and real-time data feed must work exactly as before, just wrapped in a warm amber glassmorphism skin.

## Requirements

### Validated

<!-- Existing capabilities confirmed from codebase -->

- ✓ Dashboard overview with stats grid, quick actions, and recent activity — existing
- ✓ Client Command Center with filters, client grid, and detail modals — existing
- ✓ Meeting Intelligence with real-time Fireflies sync, stats, filters, and detail modals — existing
- ✓ Task Mission Control with real-time Todoist sync, workload overview, and task management — existing
- ✓ Sidebar navigation between 4 views — existing
- ✓ Header with search, notifications, settings, and user profile — existing
- ✓ Real-time polling (30s) for meetings and tasks — existing
- ✓ HTTP Basic Auth middleware — existing
- ✓ Responsive grid layouts — existing

### Active

<!-- UI redesign scope -->

- [ ] Replace cool neon color palette (cyan/purple/pink) with warm amber/gold/copper spectrum
- [ ] Shift background from navy-indigo gradient to warm dark brown/amber gradient
- [ ] Restyle glassmorphism cards with warm-tinted transparency and gold/amber borders
- [ ] Redesign sidebar to slim icon + label format (icons above small labels)
- [ ] Replace all accent colors with warm equivalents (amber toggles, gold highlights, copper accents)
- [ ] Update status indicator colors to warm-toned variants while preserving semantic meaning
- [ ] Restyle typography gradients and text colors to warm palette
- [ ] Update hover/glow effects from cyan/purple to amber/gold
- [ ] Restyle modals, badges, buttons, and interactive elements to warm theme
- [ ] Maintain all existing responsive breakpoints and grid layouts
- [ ] Use the frontend-design skill for implementation quality

### Out of Scope

- Adding new features or views — this is styling only
- Changing the data layer, API routes, or hooks — purely presentational
- Replacing the tech stack (keeping Next.js, Tailwind, Lucide, Recharts)
- Photo backgrounds or image-based wallpapers — gradient only
- Changing the bento/grid card layout structure — keep current layouts
- Mobile-specific redesign — maintain existing responsive behavior

## Context

- **Current design:** Dark navy glassmorphism with cyan/purple/pink neon accents
- **Target design:** Warm amber/gold/copper glassmorphism inspired by premium smart home UI
- **Inspiration:** Luxurious smart home dashboard with translucent cards, warm amber toggles, gold-tinted borders, and a cozy sophisticated feel
- **Tech stack:** Next.js 14 App Router, TypeScript, Tailwind CSS 3.3, Lucide React, Recharts
- **Styling:** All styles in `globals.css` (CSS variables + Tailwind @layer components) and inline Tailwind classes in components
- **Key files to modify:** `globals.css`, `page.tsx`, `ClientCommandCenter.tsx`, `MeetingIntelligence.tsx`, `TaskMissionControl.tsx`

## Constraints

- **Tech stack**: Must use existing Tailwind CSS — no new CSS framework or styled-components
- **Functionality**: Zero regression — all features must work identically after redesign
- **Layout**: Keep current grid structures — only restyle, don't restructure card layouts
- **Sidebar**: Change to slim icon + label format but keep same navigation items
- **Colors**: Fully warm palette — no cool blues/purples remaining in the final design

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Warm gradient background (no photo) | Cleaner, faster loading, easier to maintain | — Pending |
| Icon + label sidebar (not icon-only) | Preserves discoverability while slimming down | — Pending |
| All warm tone accents | Cohesive warm aesthetic, no cool/warm clash | — Pending |
| Keep current grid layouts | Minimize structural changes, focus on visual quality | — Pending |
| Use frontend-design skill | Ensures high design quality in implementation | — Pending |

---
*Last updated: 2026-02-24 after initialization*
