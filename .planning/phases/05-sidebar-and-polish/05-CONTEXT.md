# Phase 5: Sidebar & Polish - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Restructure the sidebar from a wide collapsible layout to a slim icon-above-label format with warm amber/orange active states and a logo orb. Add atmospheric depth using a background image with layered ambient orbs behind the glassmorphism panels. The four navigation items (Overview, Clients, Meetings, Tasks) and logo remain — no new nav capabilities.

</domain>

<decisions>
## Implementation Decisions

### Sidebar layout format
- Single fixed slim width (~80px) — no collapse/expand toggle
- Remove the sidebar toggle button entirely
- Icon centered above small text label (12px) for each nav item
- Nav items grouped near the top below the logo — bottom area left empty
- Remove the "Mission Control" text that currently shows when expanded

### Active state & indicator
- Left edge vertical bar on the active nav item (3-4px wide)
- Bar uses amber-to-orange gradient (top to bottom)
- Active item also gets a subtle gradient background fill (amber/orange at ~15-20% opacity)
- Active text/icon color: amber
- Inactive items: subtle hover glow effect (faint amber tint) for clickable feedback

### Logo orb treatment
- Change from rounded square (rounded-xl) to circular orb shape
- Keep size at 40px — no increase
- Amber-to-orange gradient maintained
- Add subtle pulse glow animation (3-4 second breathing cycle)
- No text label below the orb — orb only at the top of the sidebar

### Background atmosphere
- Replace pure CSS background with the provided sunset ocean image (luxury modern room with warm sunset over ocean)
- Image positioned as full-screen fixed background behind all UI panels
- Apply ~50-60% darken overlay so glass panels and text remain readable while sunset warmth shows through
- Layer 2-3 warm amber/gold CSS radial gradient orbs on top of the image
- Orbs should blend with the sunset tones — feels like light spilling from the scene
- Keep existing drift animations on the orbs (slow, organic movement)
- Glass panels should feel like looking through frosted windows at the warm scene behind

### Claude's Discretion
- Exact icon sizes for nav items
- Spacing/padding between nav items
- Hover animation timing and easing
- Orb sizes, exact positions, and opacity values
- Image object-fit/position for best visual result
- Darken overlay implementation (CSS gradient vs pseudo-element)

</decisions>

<specifics>
## Specific Ideas

- User provided a specific reference image: luxury modern living room with panoramic sunset over ocean. Warm amber/orange/gold sunset tones melting into deep blue ocean and sky. This exact image should be used as the background.
- The image file needs to be added to the project's public/assets directory
- The overall feel should be warm, luxurious, and atmospheric — glass panels floating over a warm sunset scene

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-sidebar-and-polish*
*Context gathered: 2026-02-25*
