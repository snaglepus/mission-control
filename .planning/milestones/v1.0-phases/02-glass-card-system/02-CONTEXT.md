# Phase 2: Glass Card System - Context

**Gathered:** 2026-02-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Update shared glassmorphism classes in `globals.css @layer components` to warm amber tints, borders, and glow effects. Every card that uses `.glass-card` inherits the warm look without per-card changes. No new components, no functional changes — CSS values only.

</domain>

<decisions>
## Implementation Decisions

### Glow & shadow intensity
- Subtle warmth hover glow — soft amber halo, candlelight-behind-glass feel, not attention-grabbing
- Tight shadow bloom (15-25px spread) — shadow stays close to card edge, grounded lift feel
- Border brightens on hover alongside glow — opacity increases (e.g. 0.2 → 0.35) for double hover signal
- No resting glow — cards are clean and quiet at rest, glow only appears on hover

### Top-edge highlight
- Thin 1px hairline gold/amber line along the top inside edge — mimics light catching real glass
- Clearly visible opacity (~0.3-0.4) — unmistakable gold accent that defines the top edge as a design element
- Always visible (not hover-only) — part of the card's resting state
- Full width edge-to-edge across the top — clean, uniform light accent
- Static on hover — highlight does not change when hovering, it's a structural accent

### Glass tint warmth
- Noticeably warm tint — cards clearly read as amber-tinted glass at a glance
- Current opacity 0.65 is correct — semi-opaque, sense the background but content is clearly foreground
- Slightly brighter on hover — card background gets marginally lighter/warmer (e.g. 0.65 → 0.7) as subtle lift
- `rgba(30, 16, 4, 0.65)` base tint confirmed

### Transition & motion
- Smooth & elegant ~300ms transitions — deliberate, polished, high-end UI feel
- Subtle -2px translateY lift on hover — card rises slightly, paired with tight shadow bloom
- Uniform ease-out easing — all properties (transform, shadow, border, background) transition together
- Top-edge highlight is static (no transition needed)

### Claude's Discretion
- Nested card tint handling (check codebase for nested patterns and adjust if needed)
- Exact shadow color values and spread within the "subtle warmth + tight bloom" parameters
- Implementation technique for top-edge highlight (inset shadow vs pseudo-element vs border-image)
- Exact hover background rgba values within the "slightly brighter" guideline

</decisions>

<specifics>
## Specific Ideas

- Cards should feel like looking through warm glass with light catching the top edge — not glowing neon boxes
- The hover state should feel like the card is gently lifting off a warm surface (translateY + tight shadow + border brighten)
- All effects should serve the glassmorphism illusion — subtle, physical, not digital/flashy

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-glass-card-system*
*Context gathered: 2026-02-24*
