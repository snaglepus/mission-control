# Phase 2: Glass Card System - Research

**Researched:** 2026-02-24
**Domain:** CSS glassmorphism — shared component class updates in `globals.css @layer components`
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Glow & shadow intensity**
- Subtle warmth hover glow — soft amber halo, candlelight-behind-glass feel, not attention-grabbing
- Tight shadow bloom (15-25px spread) — shadow stays close to card edge, grounded lift feel
- Border brightens on hover alongside glow — opacity increases (e.g. 0.2 → 0.35) for double hover signal
- No resting glow — cards are clean and quiet at rest, glow only appears on hover

**Top-edge highlight**
- Thin 1px hairline gold/amber line along the top inside edge — mimics light catching real glass
- Clearly visible opacity (~0.3-0.4) — unmistakable gold accent that defines the top edge as a design element
- Always visible (not hover-only) — part of the card's resting state
- Full width edge-to-edge across the top — clean, uniform light accent
- Static on hover — highlight does not change when hovering, it's a structural accent

**Glass tint warmth**
- Noticeably warm tint — cards clearly read as amber-tinted glass at a glance
- Current opacity 0.65 is correct — semi-opaque, sense the background but content is clearly foreground
- Slightly brighter on hover — card background gets marginally lighter/warmer (e.g. 0.65 → 0.7) as subtle lift
- `rgba(30, 16, 4, 0.65)` base tint confirmed

**Transition & motion**
- Smooth & elegant ~300ms transitions — deliberate, polished, high-end UI feel
- Subtle -2px translateY lift on hover — card rises slightly, paired with tight shadow bloom
- Uniform ease-out easing — all properties (transform, shadow, border, background) transition together
- Top-edge highlight is static (no transition needed)

### Claude's Discretion
- Nested card tint handling (check codebase for nested patterns and adjust if needed)
- Exact shadow color values and spread within the "subtle warmth + tight bloom" parameters
- Implementation technique for top-edge highlight (inset shadow vs pseudo-element vs border-image)
- Exact hover background rgba values within the "slightly brighter" guideline

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

## Summary

Phase 2 is a pure CSS edit to `src/app/globals.css` — specifically the `.glass-card` and `.hover-lift` rules inside `@layer components`. No new files, no JavaScript changes, no component edits. The entire surface area is ~20 lines of CSS (`.glass-card` rest state, `.glass-card:hover`, `.hover-lift`, `.hover-lift:hover`), plus one new rule for the top-edge highlight implemented as an inset box-shadow.

The current state is already partially warm: Phase 1 set `--card: rgba(30, 16, 4, 0.65)` and `--card-border: rgba(251, 191, 36, 0.2)` as CSS custom properties, and `.glass-card` uses them. The existing `.glass-card:hover` already has an amber box-shadow at `rgba(245, 166, 35, 0.1)` but the spread is 30px (outside the 15-25px decision) and the border-color change is 0.2 → 0.3 (target is 0.2 → 0.35). The `.hover-lift:hover` still uses a neutral black `rgba(0,0,0,0.3)` shadow and `translateY(-4px)` (user wants -2px). The top-edge highlight does not yet exist. The `gradient-text`, `neon-text`, and `neon-border` classes still use `from-cyan`/`from-purple` and must be noted but are owned by Phase 3 — **only** `.glass-card`, `.hover-lift`, and the new top-edge inset rule are in Phase 2 scope.

**Primary recommendation:** Edit the four existing CSS rule blocks (`.glass-card`, `.glass-card:hover`, `.hover-lift`, `.hover-lift:hover`) plus add the top-edge inset shadow inside `.glass-card`. Use `box-shadow` with multiple comma-separated layers for the inset highlight — no pseudo-element needed, lower complexity, same visual result.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | ^3.3.0 | Utility classes; `@layer components` host | Already in use |
| PostCSS | ^8 | CSS processing pipeline | Configured in project |
| Next.js | 14.2.35 | CSS module loading via `globals.css` import | Already in use |

### Supporting

No additional libraries needed. Phase 2 is vanilla CSS inside the existing `@layer components` block.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inset box-shadow for top highlight | `::before` pseudo-element | Pseudo-element gives more control (gradients, border-radius pinning) but adds DOM-like complexity to a simple 1px line. Inset shadow is sufficient for a full-width hairline on the top edge. |
| Single `transition: all` | Explicit properties | `all` catches unexpected properties; listing `transform, box-shadow, border-color, background-color` is more precise and recommended |

**Installation:** None required — stack is already in place.

---

## Architecture Patterns

### Recommended Project Structure

```
src/app/
└── globals.css          # The only file that changes in Phase 2
    └── @layer components
        ├── .glass-card          # rest state — background, border, backdrop-filter, top highlight
        ├── .glass-card:hover    # hover state — border-color, box-shadow (glow), background
        ├── .hover-lift          # transition definition
        └── .hover-lift:hover    # translateY, warm shadow bloom
```

### Pattern 1: Multi-layer box-shadow for combined effects

**What:** CSS `box-shadow` accepts comma-separated layers. Use this to combine the inset top-edge highlight and any outer glow in a single property, avoiding pseudo-elements.

**When to use:** When you need both an inset accent and an outer glow on the same element.

**Example:**
```css
/* Resting state: inset top-edge highlight only */
.glass-card {
  box-shadow:
    inset 0 1px 0 rgba(251, 191, 36, 0.35);   /* top-edge gold hairline */
}

/* Hover state: inset highlight KEPT + outer amber glow added */
.glass-card:hover {
  box-shadow:
    inset 0 1px 0 rgba(251, 191, 36, 0.35),   /* top-edge — static, same as rest */
    0 0 20px rgba(245, 166, 35, 0.2);          /* outer amber halo */
}
```

**Confidence:** HIGH — standard CSS3, no browser-specific concerns, no library dependency.

### Pattern 2: Merging .glass-card and .hover-lift hover effects

**What:** Currently `.glass-card:hover` and `.hover-lift:hover` are separate classes applied together. The hover effects should be cohesive. The correct approach is: `.hover-lift` defines the `transition` property, `.hover-lift:hover` defines `transform` + shadow bloom. `.glass-card:hover` handles border-color + glow shadow + background change. When both classes are present, both `:hover` rules fire together — this is the intended pattern.

**Critical:** The `transition` in `.hover-lift` currently only covers `transform` and `box-shadow`. It must be expanded to also cover `border-color` and `background-color` so all hover changes animate together at 300ms ease-out.

**Example:**
```css
.hover-lift {
  transition:
    transform 0.3s ease-out,
    box-shadow 0.3s ease-out,
    border-color 0.3s ease-out,
    background-color 0.3s ease-out;
}

.hover-lift:hover {
  transform: translateY(-2px);           /* user decision: -2px, not current -4px */
  box-shadow: 0 8px 20px rgba(251, 191, 36, 0.15);  /* tight warm bloom */
}
```

### Pattern 3: CSS custom property as the source of truth

**What:** The `:root` already defines `--card` and `--card-border`. For the hover background brightening, use an inline rgba value (not a new custom property) since it's a one-off hover override. For the border, override `border-color` directly in the hover rule.

**Example:**
```css
.glass-card {
  background: var(--card);              /* rgba(30, 16, 4, 0.65) */
  border: 1px solid var(--card-border); /* rgba(251, 191, 36, 0.2) */
}

.glass-card:hover {
  background: rgba(40, 22, 6, 0.70);   /* ~5% brighter/lighter than base */
  border-color: rgba(251, 191, 36, 0.35); /* 0.2 → 0.35 per user decision */
}
```

### Anti-Patterns to Avoid

- **Adding `transition` to `.glass-card` directly:** The `.hover-lift` class owns transitions. Adding a separate transition on `.glass-card` will conflict when both classes are present. Keep transitions in `.hover-lift` only.
- **Using `!important` to override:** Not needed — specificity is equal for all component classes; rule order resolves any conflicts.
- **Removing the `::before` from `.neon-border`:** It is in scope for Phase 3, not Phase 2. Do not touch it here.
- **Changing backdrop-filter values:** `blur(12px) saturate(140%)` was locked in Phase 1. Do not modify.
- **Using `transition: all`:** Too broad — catches unintended properties. Use explicit property list.

---

## Codebase Findings (Critical for Planning)

### Current state of `.glass-card` in globals.css (lines 37-53)

```css
/* CURRENT — Phase 1 output */
.glass-card {
  background: var(--card);                        /* rgba(30, 16, 4, 0.65) ✓ */
  backdrop-filter: blur(12px) saturate(140%);     /* ✓ locked in Phase 1 */
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  border: 1px solid var(--card-border);           /* rgba(251, 191, 36, 0.2) ✓ */
  border-radius: 16px;
  /* MISSING: top-edge inset highlight */
  /* MISSING: transition (needed for bg color change) */
}

.glass-card:hover {
  border-color: rgba(251, 191, 36, 0.3);   /* needs: 0.35 not 0.3 */
  box-shadow: 0 0 30px rgba(245, 166, 35, 0.1);  /* needs: 15-25px not 30px; needs opacity increase */
  /* MISSING: background hover brightening */
  /* MISSING: inset shadow preservation */
}
```

### Current state of `.hover-lift` in globals.css (lines 173-180)

```css
/* CURRENT */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  /* needs: border-color, background-color; needs: ease-out not ease */
}

.hover-lift:hover {
  transform: translateY(-4px);              /* needs: -2px per user decision */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); /* needs: warm amber bloom, tight spread */
}
```

### Nested glass-card usage

Confirmed nested patterns exist (glass-card inside glass-card inside glass-card):
- Modal overlay (`.fixed.inset-0`) contains a top-level `.glass-card` (the modal panel)
- Inside that panel, child `.glass-card` elements render insight rows, action items, stat blocks
- Examples: `MeetingIntelligence.tsx` lines 275, 297-312, 329, 349; `ClientCommandCenter.tsx` lines 261, 303, 323-331

**Assessment:** The nested cards will stack backdrop-filter + background tints. `rgba(30,16,4,0.65)` stacked on itself inside a modal will look darker/denser than a top-level card — this is acceptable and expected glassmorphism behavior. The warm amber tint will compound, giving inner cards a slightly deeper amber tone. This is physically correct (glass on glass). No special handling required unless visual review shows it looks muddy.

**Claude's discretion guidance:** Inspect the modal visually after implementation. If nested cards look too dark, increase the base `rgba` lightness slightly (e.g., `rgba(35,18,4,0.60)`) only for a nested variant class, but only if the user flags it — don't preemptively add complexity.

### `.hover-lift` co-usage pattern

Every single `glass-card` that lifts uses both classes: `className="glass-card p-6 hover-lift"`. The shadow bloom from `.hover-lift:hover` and the glow from `.glass-card:hover` will both apply on hover. The plan must ensure both `box-shadow` values on hover are additive (comma-separated) or the `.hover-lift:hover` shadow overrides the `.glass-card:hover` glow. Since they're on the same element, the `:hover` rule that appears last in the CSS wins for `box-shadow`. **Solution:** Keep the outer warm bloom in `.hover-lift:hover` (since it appears after `.glass-card:hover` in the file), and use only the inset highlight in `.glass-card` base. The `.glass-card:hover` override handles glow + border + background, while `.hover-lift:hover` handles transform + shadow bloom. This requires `.glass-card:hover` `box-shadow` to include the inset preservation explicitly.

### Success criteria verification command

```bash
grep -n "from-indigo\|from-cyan\|from-purple" src/app/globals.css
```
The target is zero results inside `@layer components`. Currently `.gradient-text`, `.neon-text`, `.neon-border`, `.glow-cyan`, `.glow-purple`, `.sidebar-item::before` all contain cool colors — but **those are Phase 3-5 scope**. Phase 2 only touches `.glass-card` and `.hover-lift`. After Phase 2, the grep will still return hits from the Phase 3-5 rules; the success criterion as written applies to Phase 2's specific changes, not the entire file.

**Note for planner:** The success criterion "Running grep returns zero results in @layer components" cannot be fully achieved in Phase 2 alone — it will be achieved after Phase 3-5 complete. Phase 2's verifiable criterion is: `.glass-card` and `.hover-lift` contain no `from-indigo`, `from-cyan`, or `from-purple` patterns (which they don't currently, and won't after changes). The remaining hits (`gradient-text`, `neon-text`, `neon-border`, `glow-cyan`, `glow-purple`, `sidebar-item::before`) are deferred phases.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Top-edge highlight | Custom `::before` pseudo-element with absolute positioning | `inset 0 1px 0 rgba(...)` in `box-shadow` | Same 1px top-edge result, zero added markup or pseudo-element complexity |
| Hover transition orchestration | JavaScript event listeners for class toggling | Pure CSS `:hover` + `transition` | CSS GPU-composited transitions are smoother and correct for this use case |
| Color token management | Hardcoded rgba everywhere | CSS custom properties for base (`--card`, `--card-border`) + inline rgba for hover overrides | Tokens are already defined in `:root`; hover overrides are one-time values not worth tokenizing |

**Key insight:** This phase is intentionally simple. Every "clever" solution (pseudo-elements, JS, GSAP, CSS variables for hover states) adds complexity that the plain CSS approach doesn't need.

---

## Common Pitfalls

### Pitfall 1: box-shadow layer order conflict

**What goes wrong:** When `.glass-card:hover` sets `box-shadow` and `.hover-lift:hover` also sets `box-shadow`, only the last CSS rule wins. The inset highlight disappears on hover because the outer bloom replaces it.

**Why it happens:** `box-shadow` is not additive across rules on the same element. The last matching rule wins, replacing all layers from earlier rules.

**How to avoid:** Decide which rule owns the final `box-shadow` on hover. Two clean options:
1. Put all hover shadow layers in `.hover-lift:hover` (includes inset + outer bloom) and remove box-shadow from `.glass-card:hover`
2. Put all hover shadow layers in `.glass-card:hover` and remove from `.hover-lift:hover`

**Recommended:** Own all `box-shadow` in `.glass-card` (rest + hover), and let `.hover-lift:hover` only handle `transform`. This keeps glass appearance in one place.

**Warning signs:** On hover, the gold top-edge highlight disappears — means the inset layer was overwritten by the outer bloom rule.

### Pitfall 2: Transition not covering all hover-changed properties

**What goes wrong:** `border-color` or `background-color` change instantly on hover instead of smoothly over 300ms.

**Why it happens:** Current `.hover-lift` transition only covers `transform` and `box-shadow`. If border-color and background-color changes land in `.glass-card:hover` but `.hover-lift` doesn't include them in its transition property, they snap instantly.

**How to avoid:** Expand `.hover-lift` transition to include `border-color` and `background-color`. OR add a `transition` property directly to `.glass-card` for those two properties. Given that not all glass-cards have `hover-lift`, adding transition to `.glass-card` itself (for border-color and background-color) is safer — it ensures any `.glass-card:hover` changes animate regardless of whether `hover-lift` is also present.

**Warning signs:** Border or background snaps immediately on hover with no animation.

### Pitfall 3: translateY value discrepancy between decisions and current code

**What goes wrong:** Current `.hover-lift:hover` uses `translateY(-4px)`. User decision is `-2px`. Easy to overlook because it's a small number and the class name is generic.

**How to avoid:** Explicitly change `translateY(-4px)` to `translateY(-2px)` as part of this phase.

### Pitfall 4: Forgetting to update `ease` to `ease-out`

**What goes wrong:** Current transitions use `ease` (slow-fast-slow). User decision is `ease-out` (starts fast, decelerates to rest). Feels subtly wrong — cards seem to "stick" on exit.

**How to avoid:** Replace `ease` with `ease-out` in all `.hover-lift` transition values.

### Pitfall 5: inset shadow and border-radius clipping

**What goes wrong:** If `border-radius: 16px` is on `.glass-card` and `inset 0 1px 0 rgba(...)` is the box-shadow, the inset shadow renders inside the border-radius and looks correct — the 1px line follows the rounded top edge naturally. This is expected behavior, not a bug.

**Confirmation:** Inset box-shadows respect `border-radius` on the element — the top line will be gently curved at the corners matching the 16px radius. This is the desired physical-glass look.

---

## Code Examples

### Final target state for .glass-card

```css
/* Source: codebase analysis + user decisions from CONTEXT.md */
.glass-card {
  background: var(--card);                           /* rgba(30, 16, 4, 0.65) */
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  border: 1px solid var(--card-border);              /* rgba(251, 191, 36, 0.2) */
  border-radius: 16px;
  transition: border-color 0.3s ease-out, background-color 0.3s ease-out, box-shadow 0.3s ease-out;
  box-shadow:
    inset 0 1px 0 rgba(251, 191, 36, 0.35);         /* top-edge gold hairline — always visible */
}

.glass-card:hover {
  background: rgba(40, 22, 6, 0.70);                /* slightly lighter/warmer: 0.65 → 0.70 */
  border-color: rgba(251, 191, 36, 0.35);            /* 0.20 → 0.35 */
  box-shadow:
    inset 0 1px 0 rgba(251, 191, 36, 0.35),          /* top-edge preserved — unchanged */
    0 0 20px rgba(251, 191, 36, 0.18);               /* outer amber halo — 20px tight bloom */
}
```

### Final target state for .hover-lift

```css
/* Source: user decisions from CONTEXT.md */
.hover-lift {
  transition:
    transform 0.3s ease-out,
    box-shadow 0.3s ease-out,
    border-color 0.3s ease-out,
    background-color 0.3s ease-out;
}

.hover-lift:hover {
  transform: translateY(-2px);                        /* -2px per user decision (was -4px) */
  /* box-shadow handled by .glass-card:hover when co-present */
  /* If .hover-lift used standalone (no .glass-card), could add shadow here */
}
```

**Note on `.hover-lift:hover` box-shadow:** Because all `.hover-lift` usages in the codebase also have `.glass-card`, the shadow bloom is fully owned by `.glass-card:hover`. The `.hover-lift:hover` rule only needs `transform: translateY(-2px)`. This is the clean separation. If a future element uses `.hover-lift` without `.glass-card`, it will get the lift without the shadow — acceptable, no neutral black shadow is better than a wrong one.

### Verification commands

```bash
# Success criterion from requirements: zero cool-color results in glass-card and hover-lift rules
grep -n "from-indigo\|from-cyan\|from-purple" src/app/globals.css

# Spot-check the specific values changed
grep -n "translateY\|ease-out\|inset 0 1px\|rgba(40" src/app/globals.css

# Verify top-edge inset is present
grep -n "inset 0 1px" src/app/globals.css
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Neutral `rgba(0,0,0,0.3)` shadow | Warm amber `rgba(251,191,36,0.x)` shadow | Phase 2 | Cards feel grounded in warm palette |
| `translateY(-4px)` lift | `translateY(-2px)` lift | Phase 2 | Subtler, more refined hover signal |
| `ease` timing | `ease-out` timing | Phase 2 | Snappier lift, elegant settle |
| No top-edge highlight | Inset 1px amber hairline | Phase 2 | Structural glass illusion |
| No resting glow | No resting glow (preserved) | Phase 2 | Clean quiet cards at rest |

**Deprecated/outdated after Phase 2:**
- `.hover-lift:hover` `box-shadow: 0 20px 40px rgba(0,0,0,0.3)` — removed (too large, neutral color)
- `.glass-card:hover` `box-shadow: 0 0 30px rgba(245,166,35,0.1)` — replaced (spread corrected to ~20px, moved to inset+outer multi-layer)

---

## Open Questions

1. **Is `.hover-lift` used anywhere without `.glass-card`?**
   - What we know: All grep results show `glass-card ... hover-lift` co-usage in component files
   - What's unclear: Whether any future or dynamic usage applies `.hover-lift` alone
   - Recommendation: Remove `box-shadow` from `.hover-lift:hover` entirely — let `.glass-card:hover` own it. If a lone `.hover-lift` case appears, it will simply have no shadow on hover, which is acceptable.

2. **Hover background rgba — how much lighter?**
   - What we know: User said "slightly brighter" with example `0.65 → 0.7` (opacity, not lightness)
   - What's unclear: Increasing opacity makes it *darker* (more opaque brown). "Brighter/warmer" likely means slightly higher lightness in the rgb values plus slightly lower opacity, or just a marginal opacity increase is fine as the "lift" signal.
   - Recommendation: Use `rgba(40, 22, 6, 0.70)` — slightly higher RGB values (warmer, lighter brown) AND slight opacity increase to 0.70. The user approved the base tint visually; this hover is a ~5% shift that will read as a subtle lift.

3. **Should `.glass-card` own `transition` for border-color and background-color?**
   - What we know: `.hover-lift` owns `transform` and `box-shadow` transitions. `.glass-card:hover` will change `border-color` and `background-color`.
   - Recommendation: Add `transition: border-color 0.3s ease-out, background-color 0.3s ease-out, box-shadow 0.3s ease-out` to `.glass-card` itself. This ensures ALL glass cards animate those properties on hover, whether or not they also have `.hover-lift`.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase read: `src/app/globals.css` — current implementation state
- Direct codebase read: `src/app/page.tsx`, `src/app/components/*.tsx` — class usage patterns
- `.planning/phases/02-glass-card-system/02-CONTEXT.md` — locked user decisions
- `.planning/REQUIREMENTS.md` — GLASS-01 through GLASS-05 definitions
- CSS specification: `box-shadow` multi-layer and inset behavior — well-established CSS3

### Secondary (MEDIUM confidence)
- CSS `box-shadow` specificity/cascade behavior — training knowledge, consistent with observed codebase behavior

### Tertiary (LOW confidence)
- None

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| GLASS-01 | Card backgrounds use warm-tinted transparency `rgba(30, 16, 4, 0.65)` | Already implemented via `var(--card)` in Phase 1. Phase 2 adds hover brightening to `rgba(40, 22, 6, 0.70)`. |
| GLASS-02 | Card borders use amber translucent color `rgba(251, 191, 36, 0.2)` with warmer hover state | Base `var(--card-border)` already set. Phase 2 adds `.glass-card:hover { border-color: rgba(251,191,36,0.35) }`. |
| GLASS-03 | Card hover glow uses amber shadow instead of indigo | Current `.glass-card:hover` has amber shadow but wrong spread (30px → target 20px) and low opacity. Phase 2 corrects spread and adds proper multi-layer with inset preservation. |
| GLASS-04 | Inset gold highlight on card top edge simulating light on glass | Not yet implemented. Added as `box-shadow: inset 0 1px 0 rgba(251,191,36,0.35)` in `.glass-card` rest state. |
| GLASS-05 | Hover-lift shadow uses warm amber bloom instead of neutral black | Current `.hover-lift:hover` has `box-shadow: 0 20px 40px rgba(0,0,0,0.3)`. Phase 2 removes this and moves warm bloom ownership to `.glass-card:hover`. |
</phase_requirements>

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries, pure CSS edits to existing file
- Architecture: HIGH — codebase fully read, patterns confirmed, exact line numbers known
- Pitfalls: HIGH — identified from direct code analysis, not speculation

**Research date:** 2026-02-24
**Valid until:** 2026-06-01 (stable CSS, no external dependencies)
