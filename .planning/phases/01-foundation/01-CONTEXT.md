# Phase 1: Foundation - Context

**Gathered:** 2026-02-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Define warm color tokens in CSS custom properties and shift the background gradient from navy-indigo to deep brown-amber. Add ambient orbs for atmospheric depth. This phase produces the base that every downstream phase builds on — no component changes, no inline class replacements.

</domain>

<decisions>
## Implementation Decisions

### Warm palette character
- Primary accent tone: honey gold — rich, warm gold like aged whiskey or candlelight
- Tight gold spectrum: amber, gold, copper, and orange tokens stay close to each other (dark gold, honey gold, rose-gold, bright gold) rather than distinct separate hues
- Secondary/muted text shifts warm — no cool slate; warm gray-gold for --text-secondary
- Reference: smart home glassmorphism dashboard (screenshot provided) — warm amber glass over rich background, thin gold borders, background warmth showing through glass
- Palette range: golden sunset (richer, deeper) at one end to warm honey gold (lighter, brighter) at the other

### Ambient orb treatment
- Visible soft orbs — distinct warm glow spots behind the glass, like out-of-focus warm lights (not barely-noticeable haze)
- Warm sunset mix: gold tones plus warm rose and burnt sienna for depth (not all-gold monochrome)
- Slow drift animation (~30s cycle) — very subtle position/opacity shift to make the background feel alive
- Positioning: Claude's discretion — optimize for best atmospheric effect with the dark brown gradient and glass cards

### Accent vs semantic colors
- Warning shifts hotter: push --warning toward orange-red (#E8720C range) so it reads as caution, not decoration — clearly distinct from --accent-gold
- Success warms slightly: shift from pure green toward warm emerald (still reads as success)
- Danger warms slightly: shift from pure red toward warm coral/brick (still reads as danger)
- Gradients use warm multi-tone spectrum: amber → gold → copper (replacing current cyan → purple → pink)

### Claude's Discretion
- Interactive element accent brightness (same gold or brighter for buttons/toggles/links)
- Orb positioning relative to UI layout
- Exact token hex values within the honey gold / tight spectrum direction
- Gradient angles and stop percentages

</decisions>

<specifics>
## Specific Ideas

- Reference dashboard: smart home UI with warm amber glassmorphism — glass cards with warm brown-amber tint, very subtle thin gold border lines, background warmth visible through glass, orange accents on interactive toggles
- "Want to be able to go from golden sunset to warm honey gold" — the palette should span this range
- Orbs should feel like the warm atmospheric depth in the reference (which uses a photo background) but achieved with CSS radial gradients instead

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-02-24*
