# Phase 6: Fix incomplete design changes - header and nav - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the Mission Control dashboard responsive for mobile devices. This includes converting the sidebar to a hamburger drawer, compressing the header, adjusting spacing/fonts for mobile density, and making all view components (dashboard overview, clients, meetings, tasks) work on small screens. The breakpoint for mobile layout is 640px (sm).

</domain>

<decisions>
## Implementation Decisions

### Sidebar → Hamburger drawer
- Below `sm` (640px), hide the sidebar entirely
- Show a hamburger menu icon on the far left of the header
- Logo orb stays visible in the header next to the hamburger icon
- Tapping hamburger opens a **full-screen overlay drawer** with dark backdrop
- Drawer contains all 4 nav items (Overview, Clients, Meetings, Tasks) plus bell and settings icons (moved from header)
- Tap backdrop or X button to close drawer

### Header compression
- Below `sm`, header shows: hamburger icon + logo orb + search bar (smaller) + user avatar
- Bell and settings icons move into the hamburger drawer on mobile
- User name/status text hidden on mobile — just the avatar circle

### Spacing and typography
- Tight but breathable approach — not maximum density
- Main content padding: `p-8` → `p-4` on mobile
- Welcome heading: `text-4xl` → `text-2xl` on mobile
- Card padding: `p-6` → `p-4` on mobile
- Generally reduce font sizes and spacing proportionally for mobile

### Dashboard stats grid
- 2-column compact layout on mobile (2 cards per row)
- Smaller text and padding within stat cards
- All 4 stats visible without scrolling

### View components (Clients, Meetings, Tasks)
- Include mobile-responsive adjustments for all 3 view components in this phase
- Tables, cards, and charts should adapt to narrow screens

### Claude's Discretion
- Drawer animation style and duration
- Exact mobile font sizes and spacing values
- How to adapt tables/charts in view components for mobile (horizontal scroll, stacking, etc.)
- Header height adjustment on mobile
- Transition/animation for layout changes

</decisions>

<specifics>
## Specific Ideas

- User wants to maximize screen real estate on mobile — reduce fonts and display chrome
- Hamburger drawer should feel native and smooth (full overlay, not partial)
- Logo orb should remain a prominent visual anchor even on mobile

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-fix-incomplete-design-changes-header-and-nav*
*Context gathered: 2026-02-25*
