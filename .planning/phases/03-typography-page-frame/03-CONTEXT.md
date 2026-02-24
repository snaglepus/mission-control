# Phase 3: Typography & Page Frame - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace all gradient text, dividers, and ~45 inline cool-color Tailwind classes in `page.tsx` with warm amber/gold/copper equivalents. The persistent header and dashboard overview section become fully warm. No functional changes, no new components — CSS class substitutions and gradient value changes only.

</domain>

<decisions>
## Implementation Decisions

### Gradient text feel
- Warm sunset glow character — soft, radiant warmth like golden hour light
- Color stops: amber-300 → amber-500 → orange-600 spectrum
- One consistent gradient across all gradient headings (no hierarchy variation)
- Direction: left-to-right (horizontal flow)
- Add subtle warm amber text-shadow behind gradient text for depth (not neon — faint ambient glow)

### Stat glow intensity
- Subtle ambient warmth — barely visible amber halo, ~2px spread, low opacity
- Glow color matches the gradient text tone (same amber family) for unified palette
- Stat labels stay neutral/muted gray — only the numbers themselves get warm treatment
- Glow appears on hover only, not at rest — cleaner default state, rewarding on interaction

### Hover & focus states
- Hover style: amber intensification — deepen the amber color and add subtle glow on hover
- Focus rings: custom amber/gold outline replacing browser default, for visual consistency with warm theme
- Transition timing: ~150-200ms ease for smooth, polished color shifts
- Tab/view switcher active indicator style: Claude's discretion (pick what fits current tab structure)

### Color mapping approach
- Redesigned warmth — pick warm colors by visual intent, not shade-for-shade mapping
- Wide spectrum: use full range from yellow-300 to orange-700 for variety and visual hierarchy
- Preserve multi-tone: if an element had two cool colors, use two distinct warm colors (e.g., amber text + orange border)
- Main heading is the visual anchor — richest, most prominent warm element on the page; everything else supports it

### Claude's Discretion
- Tab/view switcher active indicator style (underline vs background fill — pick what fits current structure)
- Exact text-shadow values for gradient glow
- Specific shade choices per element within the wide amber-to-orange spectrum
- Transition easing curve details

</decisions>

<specifics>
## Specific Ideas

- Gradient headings should feel like golden hour light — soft radiance, not metallic or shimmery
- Stats should feel understated at rest and come alive on hover — the glow is a reward for interaction
- The main dashboard heading should be the warmest, richest element — the visual anchor that sets the tone
- Multi-tone warm elements should feel intentional, not arbitrary — amber and orange working together like a warm palette, not random warm colors

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-typography-page-frame*
*Context gathered: 2026-02-25*
