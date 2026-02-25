# Phase 1: Foundation - Research

**Researched:** 2026-02-24
**Domain:** CSS custom properties, background gradients, backdrop-filter, CSS animation
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Primary accent tone: honey gold — rich, warm gold like aged whiskey or candlelight
- Tight gold spectrum: amber, gold, copper, and orange tokens stay close to each other (dark gold, honey gold, rose-gold, bright gold) rather than distinct separate hues
- Secondary/muted text shifts warm — no cool slate; warm gray-gold for --text-secondary
- Reference: smart home glassmorphism dashboard — warm amber glass over rich background, thin gold borders, background warmth showing through glass
- Palette range: golden sunset (richer, deeper) at one end to warm honey gold (lighter, brighter) at the other
- Visible soft orbs — distinct warm glow spots behind the glass, like out-of-focus warm lights (not barely-noticeable haze)
- Warm sunset mix: gold tones plus warm rose and burnt sienna for depth (not all-gold monochrome)
- Slow drift animation (~30s cycle) — very subtle position/opacity shift to make the background feel alive
- Warning shifts hotter: push --warning toward orange-red (#E8720C range) — clearly distinct from --accent-gold
- Success warms slightly: shift from pure green toward warm emerald
- Danger warms slightly: shift from pure red toward warm coral/brick
- Gradients use warm multi-tone spectrum: amber → gold → copper (replacing current cyan → purple → pink)

### Claude's Discretion

- Interactive element accent brightness (same gold or brighter for buttons/toggles/links)
- Orb positioning relative to UI layout
- Exact token hex values within the honey gold / tight spectrum direction
- Gradient angles and stop percentages

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FNDTN-01 | CSS custom properties defined for amber, gold, copper, and orange accent colors in `:root` | CSS custom property token patterns documented; naming convention and hex range established |
| FNDTN-02 | Background gradient shifted from navy-indigo to deep-brown/dark-amber (`#1a0f00 → #2d1a06 → #1f1208`) | Exact hex values from REQUIREMENTS.md; body gradient pattern in existing globals.css identified |
| FNDTN-03 | Backdrop filter includes `saturate(140%)` alongside `blur(12px)` for warm glass effect | backdrop-filter multi-value syntax confirmed; .glass-card class location identified in globals.css |
| FNDTN-04 | 2-3 ambient radial gradient orbs positioned behind UI for atmospheric depth | CSS-only orb technique documented; animation performance constraints (transform/opacity only) clarified |
</phase_requirements>

## Summary

Phase 1 is a pure CSS change — no React component logic, no new dependencies, no TypeScript changes. Everything happens in one file: `src/app/globals.css`. The existing file has a clear structure (`:root` tokens, `@layer base`, `@layer components`, `@layer utilities`) that Phase 1 extends in place.

The work has two distinct parts. First, replace the current cool-color token set in `:root` with a warm amber/gold palette and update the `body` background gradient in `@layer base`. Second, add 2-3 ambient orb `div` elements rendered in the layout or page, styled as fixed-position radial gradient blobs with a slow opacity/transform drift animation. The orbs must sit behind all UI content (z-index below glass cards) and must not use GPU-expensive properties for animation — only `transform` and `opacity` are composited by the GPU at 60fps.

The project uses Next.js 14 (App Router), Tailwind CSS v3, and has no test infrastructure. The `layout.tsx` currently hardcodes `bg-[#0a0e1a]` as a Tailwind class on `<body>` — this conflicts with the CSS body gradient and must be removed or overridden during FNDTN-02 implementation. Phase 1 does not touch any component `.tsx` files; all inline Tailwind class replacement is deferred to later phases.

**Primary recommendation:** Edit `globals.css` for all token/gradient/backdrop-filter work; add orb markup as a fixed wrapper in `layout.tsx` styled via a new `.ambient-orbs` component class.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS Custom Properties (`:root`) | CSS Level 4 / Baseline | Design token storage | Native browser feature; no build step; Tailwind can reference via `var()` |
| Tailwind CSS | v3.3 (installed) | Utility classes for layout | Already installed; config at `tailwind.config.ts` |
| Next.js App Router | 14.2.35 (installed) | File-based layout system | Already installed; `layout.tsx` is the global wrapper |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS `@keyframes` | Baseline | Orb drift animation | Animating only `transform` and `opacity` for GPU compositing |
| CSS `radial-gradient()` | Baseline | Orb color blobs | Layered backgrounds on fixed-position `div` elements |
| CSS `backdrop-filter` | Baseline 2024 (95.76% global support) | Warm glass effect on cards | Already used in `.glass-card`; add `saturate(140%)` alongside existing `blur(12px)` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Fixed-position CSS orb divs | SVG blur filters | CSS divs are simpler, no extra DOM complexity |
| CSS `@keyframes` drift | JS `requestAnimationFrame` | CSS animation is GPU-composited; JS would add main-thread overhead |
| Editing globals.css directly | CSS Modules or Tailwind `theme.extend` | globals.css is the existing single source of truth for tokens and component styles; stay consistent |

**Installation:** No new packages required. All work uses existing stack.

## Architecture Patterns

### Existing File Structure (relevant files only)

```
src/
├── app/
│   ├── globals.css          ← ALL Phase 1 CSS changes go here
│   ├── layout.tsx           ← Remove hardcoded bg-[#0a0e1a]; add orb wrapper markup
│   ├── page.tsx             ← No changes in Phase 1
│   └── components/          ← No changes in Phase 1
tailwind.config.ts           ← No changes needed in Phase 1
```

### Pattern 1: CSS Custom Property Token Replacement

**What:** Replace all 10 `:root` custom properties in globals.css with warm-palette equivalents. Add new warm-specific tokens. Keep token count lean — this phase defines the palette primitives only.

**When to use:** The canonical approach for design token management in CSS-first projects.

**Current state (to replace):**
```css
/* globals.css — current :root (REPLACE ALL) */
:root {
  --background: #0a0e1a;
  --card: rgba(15, 23, 42, 0.6);
  --card-border: rgba(99, 102, 241, 0.2);
  --accent-cyan: #06b6d4;
  --accent-purple: #8b5cf6;
  --accent-pink: #ec4899;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
}
```

**Target state (warm palette — exact hex values are Claude's discretion within the specified range):**
```css
/* globals.css — warm token set */
:root {
  /* Background */
  --background: #1a0f00;

  /* Warm amber/gold accent spectrum (tight range, honey gold center) */
  --accent-amber:  #d97706;   /* dark gold — deep end of spectrum */
  --accent-gold:   #f5a623;   /* honey gold — primary accent */
  --accent-copper: #c9752a;   /* rose-gold / copper */
  --accent-orange: #f59e0b;   /* bright gold — bright end */

  /* Card and borders — set to warm tints but Phase 2 owns final values */
  --card:         rgba(30, 16, 4, 0.65);
  --card-border:  rgba(251, 191, 36, 0.2);

  /* Text */
  --text-primary:   #fdf4e3;   /* warm off-white */
  --text-secondary: #c4a882;   /* warm gray-gold, no cool slate */

  /* Semantic — warmed but still readable */
  --success: #10b981;          /* warm emerald (preserved for Phase 4 semantic work) */
  --warning: #E8720C;          /* orange-red — clearly distinct from --accent-gold */
  --danger:  #dc6b4a;          /* warm coral/brick */
}
```

**Key constraint:** `--accent-gold` (~#f5a623 honey gold) vs `--warning` (~#E8720C orange-red) must be visually distinct when rendered side by side. Keeping warning below amber hue (~35°) and pushing it toward orange-red (~25°) achieves this separation.

### Pattern 2: Body Background Gradient Override

**What:** Replace the body gradient in `@layer base` and remove the conflicting Tailwind class `bg-[#0a0e1a]` in `layout.tsx`.

**Critical conflict:** `layout.tsx` line 19 has `bg-[#0a0e1a]` on `<body>`. Tailwind utility classes have higher specificity in Tailwind v3 than `@layer base` styles. **The Tailwind class must be removed from `layout.tsx`.**

**Current globals.css:**
```css
@layer base {
  body {
    background: linear-gradient(135deg, #0a0e1a 0%, #0f172a 50%, #1e1b4b 100%);
    min-height: 100vh;
  }
}
```

**Target:**
```css
@layer base {
  body {
    background: linear-gradient(135deg, #1a0f00 0%, #2d1a06 50%, #1f1208 100%);
    min-height: 100vh;
  }
}
```

**layout.tsx change:**
```tsx
/* Remove bg-[#0a0e1a] from body className */
<body className={`${inter.className} text-slate-100`}>
```

### Pattern 3: Backdrop-Filter Multi-Value (FNDTN-03)

**What:** Add `saturate(140%)` to the existing `backdrop-filter` on `.glass-card` in `@layer components`.

**Syntax** (verified via MDN — Baseline 2024, 95.76% support):
```css
/* Space-separated list — both filters apply */
backdrop-filter: blur(12px) saturate(140%);
-webkit-backdrop-filter: blur(12px) saturate(140%);
```

**Current state:**
```css
.glass-card {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

**Target state:**
```css
.glass-card {
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
}
```

**Note:** The `-webkit-` prefix is no longer required for Chrome/Edge/Firefox as of 2024, but Safari still uses it per caniuse.com data. Retain both lines for maximum compatibility.

**Why 140%?** Values above 100% increase color saturation. At 140%, the warm background colors bleed through the glass card more richly. Values above ~180% can look artificially oversaturated.

### Pattern 4: Ambient Orbs (FNDTN-04)

**What:** 2-3 fixed-position `div` elements with radial-gradient backgrounds, positioned behind all UI content, with slow drift animation on `transform` and `opacity` only.

**Performance constraint (HIGH confidence — verified via MDN):** Only `transform` and `opacity` are GPU-composited. Animating `background-position`, `filter`, or `width/height` triggers repaint on every frame. For a 30s cycle on a dashboard that runs continuously, this matters.

**Recommended approach:** Fixed-position orb divs in `layout.tsx`, styled via a `.ambient-orbs` block in `@layer components` in `globals.css`. Use `pointer-events: none` so orbs don't intercept clicks.

**Markup pattern (layout.tsx):**
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} text-slate-100`}>
        <div className="ambient-orbs" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        {children}
      </body>
    </html>
  );
}
```

**CSS pattern (globals.css @layer components):**
```css
.ambient-orbs {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  will-change: transform, opacity;
}

/* Orb colors: warm sunset mix — gold, rose, burnt sienna */
.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(245, 166, 35, 0.6) 0%, transparent 70%);
  /* Positioning: Claude's discretion — top-left quadrant suggested */
  top: -10%;
  left: -5%;
  animation: orb-drift-1 30s ease-in-out infinite;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(180, 80, 60, 0.5) 0%, transparent 70%);
  /* Positioning: Claude's discretion — bottom-right suggested */
  bottom: -5%;
  right: -5%;
  animation: orb-drift-2 35s ease-in-out infinite;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(201, 117, 42, 0.4) 0%, transparent 70%);
  /* Positioning: Claude's discretion — center-right suggested */
  top: 30%;
  right: 20%;
  animation: orb-drift-3 28s ease-in-out infinite;
}

@keyframes orb-drift-1 {
  0%, 100% { transform: translate(0, 0);   opacity: 0.35; }
  50%       { transform: translate(40px, 30px); opacity: 0.5;  }
}

@keyframes orb-drift-2 {
  0%, 100% { transform: translate(0, 0);    opacity: 0.3;  }
  50%       { transform: translate(-30px, -20px); opacity: 0.45; }
}

@keyframes orb-drift-3 {
  0%, 100% { transform: translate(0, 0);   opacity: 0.25; }
  50%       { transform: translate(20px, -25px); opacity: 0.4;  }
}
```

**z-index layering:** Orbs at `z-index: 0`, main content at `z-index: 1` or higher, sidebar/header untouched. Verify glass cards render above orbs.

### Anti-Patterns to Avoid

- **Animating `background-position` for orbs:** Triggers repaint on every frame; use `transform: translate()` instead.
- **Setting `backdrop-filter` on the `<body>`:** Applies effect to the entire viewport which is never visible; effect requires a partially transparent element over a background.
- **Removing `-webkit-backdrop-filter`:** Safari still uses the prefixed property.
- **Removing the Tailwind `bg-[#0a0e1a]` class from `layout.tsx` without verifying body gradient loads first:** Could briefly show default white background on slow connections.
- **Making orb opacity too high (>0.6):** Glass cards must remain legible; background is atmospheric, not dominant.
- **Nesting `backdrop-filter` elements:** Stacked backdrop-filters (element with backdrop-filter inside another element with backdrop-filter) cause exponential GPU cost. This phase adds orbs behind cards, not inside them.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Color hex values for warm palette | Manual trial-and-error | Use the REQUIREMENTS.md anchors (`#1a0f00`, `#2d1a06`, `#1f1208` for bg; `#E8720C` for warning) as fixed points, then tune gold/amber around them | Requirements already specify key values |
| Orb blur effect | `filter: blur()` on box-shadow | `filter: blur(80px)` on a colored radial-gradient div | Shadow blur doesn't composite as well; radial gradient + CSS blur is the standard atmospheric orb pattern |
| Animation framework | Third-party animation library | Native CSS `@keyframes` | No dependencies; transform/opacity animations are already GPU-composited natively |

**Key insight:** This phase is entirely CSS — no JavaScript, no libraries. The existing globals.css structure (`:root`, `@layer base`, `@layer components`, `@layer utilities`) already provides the right extension points. Don't invent new architecture.

## Common Pitfalls

### Pitfall 1: Tailwind Class Overrides CSS Layer

**What goes wrong:** The body still shows `#0a0e1a` (navy) even after editing globals.css.
**Why it happens:** `layout.tsx` has `bg-[#0a0e1a]` as a Tailwind utility class. In Tailwind v3, utilities are injected at the `@tailwind utilities` layer, which has higher specificity than `@layer base`. The Tailwind class wins.
**How to avoid:** Remove `bg-[#0a0e1a]` from the `<body>` className in `layout.tsx` as part of FNDTN-02.
**Warning signs:** Background doesn't change after globals.css edit; DevTools shows Tailwind utility class winning the cascade.

### Pitfall 2: Dark Brown Background Reads as Black

**What goes wrong:** `#1a0f00` appears near-black at 100% opacity, failing the saturation visibility test in success criteria 3.
**Why it happens:** Very dark browns lose their hue in low ambient light or on uncalibrated monitors.
**How to avoid:** Test with backdrop-filter toggled OFF on a glass card. If the card is barely distinguishable from the background, the background needs more saturation — push stops toward `#2d1a06` and `#3d2210`, or add `saturate(110%)` to the body's own CSS filter. The STATE.md specifically flags this as a concern.
**Warning signs:** Glass card with `backdrop-filter: none` blends into background.

### Pitfall 3: --accent-gold and --warning Collision

**What goes wrong:** Amber gold at ~#f5a623 and warning at default Tailwind amber (#f59e0b) look identical when rendered side-by-side.
**Why it happens:** Current warning token (#f59e0b) is already amber — the very hue being adopted as the primary accent. No change = collision.
**How to avoid:** Push `--warning` to orange-red (#E8720C per REQUIREMENTS.md) which sits at a clearly different hue angle (~25° vs ~40° for gold). Verify by rendering both colors adjacent in DevTools.
**Warning signs:** Success criteria 4 fails — `--accent-gold` and `--warning` look the same shade.

### Pitfall 4: Orbs Intercept Mouse Events

**What goes wrong:** Clicking on dashboard elements does nothing because orb divs sit on top and absorb events.
**Why it happens:** Fixed-position divs with high z-index capture pointer events.
**How to avoid:** Always apply `pointer-events: none` to the `.ambient-orbs` wrapper and all `.orb` children.
**Warning signs:** Buttons in the main content area stop responding to clicks.

### Pitfall 5: Orb Animation Causes Jank

**What goes wrong:** The 30s drift animation stutters or drops frames on the dashboard.
**Why it happens:** Animating properties other than `transform` and `opacity` triggers repaint. Also: not using `will-change` means the browser may not promote the element to its own compositor layer.
**How to avoid:** Animate only `transform: translate()` and `opacity`. Set `will-change: transform, opacity` on `.orb` elements. Keep orbit displacement small (20-50px) to avoid large repaint areas.
**Warning signs:** Browser DevTools Performance tab shows "Paint" or "Layout" in the animation frames.

## Code Examples

Verified patterns from official sources and existing codebase:

### Existing globals.css Structure (do not change layers, only contents)

```css
/* Source: src/app/globals.css — existing structure to preserve */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { /* ← FNDTN-01: replace token values here */ }

@layer base {
  body { /* ← FNDTN-02: replace gradient here */ }
}

@layer components {
  .glass-card { /* ← FNDTN-03: add saturate() here */ }
  /* ← FNDTN-04: add .ambient-orbs and .orb styles here */
}

@layer utilities {
  .text-glow { /* leave for Phase 3 */ }
}
```

### backdrop-filter Multi-Value Syntax

```css
/* Source: MDN Web Docs — Baseline 2024 verified */
/* Space-separated, both filters apply simultaneously */
backdrop-filter: blur(12px) saturate(140%);
-webkit-backdrop-filter: blur(12px) saturate(140%);
```

### GPU-Composited Keyframe Pattern

```css
/* Source: MDN — only transform and opacity are compositor-thread safe */
@keyframes safe-drift {
  0%, 100% { transform: translate(0, 0); opacity: 0.35; }
  50%       { transform: translate(40px, 30px); opacity: 0.5; }
}
/* Use will-change to hint compositor layer promotion */
.orb { will-change: transform, opacity; }
```

### Radial Gradient Orb

```css
/* Source: MDN radial-gradient() docs — standard atmospheric orb pattern */
/* Solid center fading to transparent edge for soft glow */
background: radial-gradient(circle, rgba(245, 166, 35, 0.6) 0%, transparent 70%);
filter: blur(80px);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `-webkit-backdrop-filter` required everywhere | No prefix needed for Chrome/Edge/Firefox; Safari still needs `-webkit-` | Sep 2024 (Baseline 2024) | Keep both declarations for safety; don't drop webkit for Safari compat |
| Animate `background-position` for moving gradients | Animate `transform: translate()` on colored divs | Established best practice | GPU compositing — no repaint on each frame |
| CSS variables as display-only tokens | CSS variables as animatable values (with `@property`) | CSS `@property` gaining support ~2024 | Not needed for Phase 1; relevant for future gradient animation work |

**Deprecated/outdated:**
- Animating `background-position` for orb movement: This approach triggers layout/paint on every frame. Use `transform: translate()` instead.
- Stacking `backdrop-filter` on parent and child: Creates exponential GPU cost. Phase 1 must not apply backdrop-filter to any element that contains another backdrop-filter element.

## Open Questions

1. **Exact hex values for warm gold spectrum**
   - What we know: Requirements anchor `--warning` at `#E8720C` and background at `#1a0f00 → #2d1a06 → #1f1208`
   - What's unclear: Exact hex values for `--accent-gold`, `--accent-amber`, `--accent-copper`, `--accent-orange` (Claude's discretion per CONTEXT.md)
   - Recommendation: Start with `--accent-gold: #f5a623`, then visually validate side-by-side with `--warning: #E8720C` and adjust. The hue gap between #f5a623 (~40° hue) and #E8720C (~25° hue) should be visually obvious.

2. **Background saturation level — near-black risk**
   - What we know: `#1a0f00` is very dark; STATE.md explicitly flags this as a concern
   - What's unclear: Whether the gradient will have enough visible warmth at this darkness level
   - Recommendation: Implement FNDTN-02 first, then immediately run the `backdrop-filter: none` visibility test before proceeding. If the card blends into background, add a slightly lighter midpoint stop (e.g., `#3d2210` at 75%) or shift the darkest stop lighter.

3. **Orb positioning for best atmospheric effect**
   - What we know: 2-3 orbs required; Claude has discretion on positioning
   - What's unclear: Optimal layout without seeing the actual rendered sidebar+header+cards composition
   - Recommendation: Top-left (behind sidebar), bottom-right (behind main content), and a subtle center-right floating orb. Adjust after visual inspection.

## Sources

### Primary (HIGH confidence)

- MDN Web Docs — backdrop-filter (https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter) — syntax, browser support, multi-value usage
- MDN Web Docs — animation performance note (https://developer.mozilla.org/en-US/docs/Web/CSS/animation) — only transform and opacity are GPU composited
- caniuse.com — css-backdrop-filter (https://caniuse.com/css-backdrop-filter) — 95.76% global support, Safari still needs -webkit-
- Project source file: `src/app/globals.css` — existing token names, layer structure, .glass-card definition
- Project source file: `src/app/layout.tsx` — hardcoded bg-[#0a0e1a] conflict identified
- Project requirements: `.planning/REQUIREMENTS.md` — FNDTN-01 through FNDTN-04 exact specs, anchor hex values

### Secondary (MEDIUM confidence)

- Smashing Magazine — GPU Animation (https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/) — transform/opacity compositing, will-change usage — confirmed by MDN
- caniuse.com Safari -webkit-prefix note — still required for Safari per 2025 data
- MDN radial-gradient() docs — orb pattern (transparent edge, circle keyword)

### Tertiary (LOW confidence)

- DEV Community — CSS orb with custom properties (https://dev.to/alishata128/creating-a-dynamic-css-orb-with-custom-properties-and-gradients-one-element-43en) — orb technique overview, not verified against a spec

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — existing project files directly inspected; no new dependencies
- Architecture: HIGH — existing globals.css structure confirmed; CSS layer model is well-understood
- Pitfalls: HIGH — Tailwind class conflict (layout.tsx) directly observed in codebase; backdrop-filter spec confirmed via MDN
- Orb animation performance: HIGH — GPU compositing rules confirmed via MDN + Smashing Magazine (aligned)
- Exact hex values: MEDIUM — anchors from REQUIREMENTS.md are HIGH; final discretionary hex values require visual validation

**Research date:** 2026-02-24
**Valid until:** 2026-03-24 (stable CSS spec — 30-day window appropriate)
