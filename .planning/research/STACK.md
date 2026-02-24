# Stack Research

**Domain:** Warm glassmorphism UI theme — Tailwind CSS 3.3 dashboard reskin
**Researched:** 2026-02-24
**Confidence:** HIGH

## Context

This is a reskin of an existing Next.js 14 + Tailwind CSS 3.3 dashboard. The stack does not change. This research covers the specific techniques, patterns, and configuration approaches required to implement a warm amber/gold/copper glassmorphism theme within Tailwind CSS 3.3 — replacing the current cool neon (cyan/purple/pink) palette. No new CSS framework, no styled-components, no new npm packages required.

## Recommended Stack

### Core Technologies (already installed — no changes)

| Technology | Version | Purpose | Why Relevant |
|------------|---------|---------|--------------|
| Tailwind CSS | 3.3.x | Utility-first styling | Already in use; 3.3 adds 950 shades + CSS var shorthand |
| CSS Custom Properties | Native | Semantic color tokens | The correct layer for theme values in Tailwind 3.x |
| `@layer components` | Native (Tailwind) | Custom component classes | Where `.glass-card`, `.gradient-text` etc. live |
| `backdrop-filter` | Native CSS | Frosted glass blur | 97%+ browser support; `-webkit-` prefix still needed |

### No New Packages Needed

The redesign requires zero new npm packages. Every technique below uses native CSS features and Tailwind's built-in utilities.

## Theming Approach: CSS Variables + Tailwind Config

### The Right Pattern (HIGH confidence)

For Tailwind 3.x, the correct approach for semantic color variables that support opacity modifiers (e.g., `bg-amber-card/60`) is:

**Step 1 — Define color channels in `:root` (not hex, not rgb() — just channels):**

```css
/* globals.css */
:root {
  /* Warm background */
  --color-bg-deep:        18 12 8;      /* #120c08 — near-black with warm cast */
  --color-bg-warm:        30 20 10;     /* #1e140a — deep amber-brown */
  --color-bg-mid:         45 28 12;    /* #2d1c0c — mid amber-brown */

  /* Glass card surface */
  --color-glass:          80 45 15;    /* amber-tinted dark glass */
  --color-glass-border:   212 160 70;  /* gold border */

  /* Accent spectrum */
  --color-amber:          245 158 11;  /* amber-500 */
  --color-gold:           212 160 70;  /* warm gold */
  --color-copper:         180 100 50;  /* copper */

  /* Text */
  --color-text-primary:   248 244 236; /* warm white */
  --color-text-secondary: 180 155 120; /* muted amber-cream */
}
```

**Step 2 — Register as Tailwind colors with `<alpha-value>` so opacity modifiers work:**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic colors — support opacity modifier syntax (bg-glass/60)
        "glass":         "rgb(var(--color-glass) / <alpha-value>)",
        "glass-border":  "rgb(var(--color-glass-border) / <alpha-value>)",
        "warm-amber":    "rgb(var(--color-amber) / <alpha-value>)",
        "warm-gold":     "rgb(var(--color-gold) / <alpha-value>)",
        "warm-copper":   "rgb(var(--color-copper) / <alpha-value>)",
        "text-warm":     "rgb(var(--color-text-primary) / <alpha-value>)",
        "text-muted":    "rgb(var(--color-text-secondary) / <alpha-value>)",
      },
      backgroundImage: {
        // Warm gradient backgrounds registered as Tailwind utilities
        "warm-base": "linear-gradient(135deg, rgb(18, 12, 8) 0%, rgb(30, 20, 10) 50%, rgb(45, 28, 12) 100%)",
        "warm-amber-gradient": "linear-gradient(135deg, #f59e0b 0%, #d4a017 50%, #b46432 100%)",
        "warm-gold-gradient":  "linear-gradient(135deg, #d4a017 0%, #f59e0b 100%)",
      },
      boxShadow: {
        "glow-amber": "0 0 20px rgba(245, 158, 11, 0.3)",
        "glow-gold":  "0 0 20px rgba(212, 160, 70, 0.3)",
        "glow-amber-lg": "0 0 40px rgba(245, 158, 11, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
```

**Why `<alpha-value>` is essential:** Without it, `bg-glass/60` breaks. The `<alpha-value>` placeholder is Tailwind's internal mechanism for composing opacity modifiers with custom colors. Hex or full `rgb()` values in the config do not support this syntax. (Source: Tailwind CSS v3.1+ docs, protailwind.com workshop)

## Glassmorphism Technique: Warm-Tinted Glass Cards

### The Replace for `.glass-card` in `globals.css`

```css
@layer components {
  .glass-card {
    /* Warm amber tint replaces the neutral dark background */
    background: rgba(80, 45, 15, 0.5);
    backdrop-filter: blur(12px) saturate(140%);
    -webkit-backdrop-filter: blur(12px) saturate(140%);
    border: 1px solid rgba(212, 160, 70, 0.2);
    border-radius: 16px;
  }

  .glass-card:hover {
    border-color: rgba(212, 160, 70, 0.4);
    box-shadow: 0 0 30px rgba(245, 158, 11, 0.15);
  }
}
```

**Why `saturate(140%)`:** Blurring desaturates whatever is behind the glass element, washing out the warm tones in the background gradient. Adding `saturate(140%)` to the backdrop-filter compensates for this, keeping the amber warmth visible through the card. This is the most important technique for warm glassmorphism — without it the glass looks grey and dull. (Source: Josh W. Comeau's backdrop-filter article)

**Why amber rgba for background, not `bg-white/10`:** White-tinted glass (the default glassmorphism tutorial approach) produces a cold silver-grey tint on dark backgrounds. Using a warm amber rgba (`rgba(80, 45, 15, 0.5)`) imparts the actual warm tint to the glass surface. The opacity (0.5) combined with backdrop-blur creates the translucency.

### Backdrop Blur Value Reference

| Class | px Value | Use Case |
|-------|----------|----------|
| `backdrop-blur-sm` | 8px | Subtle overlays, secondary cards |
| `backdrop-blur-md` | 12px | Primary glass cards (matches current) |
| `backdrop-blur-lg` | 16px | Modal overlays, sidebar |
| `backdrop-blur-xl` | 24px | Full-screen overlays |

**Recommendation:** Keep `backdrop-blur-md` (12px) for cards — this matches the current implementation and is the right balance between effect and performance. Reserve `backdrop-blur-lg` for modals.

### Browser Support

```css
/* Always include both — -webkit- is still required for Safari */
backdrop-filter: blur(12px) saturate(140%);
-webkit-backdrop-filter: blur(12px) saturate(140%);
```

Support is 97%+ across modern browsers. No `@supports` fallback needed for this project (personal dashboard, controlled environment). (Source: Josh W. Comeau, MDN compatibility data)

## Warm Color Palette: What to Replace

### Current → Replacement Mapping

| Current Token | Current Value | Replacement | Warm Value |
|--------------|---------------|-------------|------------|
| `--background` | `#0a0e1a` | Keep, update | `#120c08` |
| `--card` | `rgba(15,23,42,0.6)` | Warm rgba | `rgba(80,45,15,0.5)` |
| `--card-border` | `rgba(99,102,241,0.2)` | Gold border | `rgba(212,160,70,0.2)` |
| `--accent-cyan` | `#06b6d4` | Primary amber | `#f59e0b` |
| `--accent-purple` | `#8b5cf6` | Gold accent | `#d4a017` |
| `--accent-pink` | `#ec4899` | Copper accent | `#b46432` |
| `--text-secondary` | `#94a3b8` | Warm muted | `#b49b78` |

**Status colors (`--success`, `--warning`, `--danger`) stay as-is.** Green, yellow, and red are universal semantic signals — changing them breaks user comprehension. The current warning amber (`#f59e0b`) already aligns with the warm palette.

### Tailwind Built-in Amber Scale (HIGH confidence)

Tailwind 3.3 includes amber-50 through amber-950. Use these for components wherever possible — they produce cleaner output than custom arbitrary values.

Key values for this project:
- `amber-400` (#fbbf24) — bright highlights, hover states
- `amber-500` (#f59e0b) — primary accent
- `amber-600` (#d97706) — pressed/active states
- `amber-700` (#b45309) — muted amber, subtle borders
- `amber-900` (#78350f) — dark amber for card backgrounds
- `amber-950` (#451a03) — near-black amber for deepest backgrounds (added in v3.3)

## Gradient Text Technique

Replace the cyan/purple `.neon-text` and `.gradient-text` classes:

```css
@layer components {
  /* Replace .neon-text */
  .warm-text {
    background: linear-gradient(135deg, #f59e0b 0%, #d4a017 50%, #b46432 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Replace .gradient-text */
  .gradient-text {
    background: linear-gradient(135deg, #f59e0b 0%, #d4a017 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
```

**Note on clipping:** Add `leading-normal` or `pb-1` to elements using gradient text if descenders are clipped — this is a known Tailwind/Chrome issue with `bg-clip-text`. (Source: multiple sources, Tailwind community)

In JSX/TSX components, using Tailwind utilities directly is cleaner:

```tsx
// Tailwind 3.3 utility approach (no custom CSS class needed)
<h1 className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
  Mission Control
</h1>
```

## Glow Effects: Replace Cyan/Purple Glow

### `globals.css` Component Layer

```css
@layer components {
  /* Replace .glow-cyan and .glow-purple */
  .glow-amber {
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
  }

  .glow-gold {
    box-shadow: 0 0 20px rgba(212, 160, 70, 0.3);
  }
}
```

### Inline Tailwind (for one-off uses)

```tsx
// Tailwind 3.x shadow-color + opacity modifier
<button className="shadow-lg shadow-amber-500/40">
```

`shadow-amber-500/40` uses the built-in amber palette with the box-shadow color system added in Tailwind 3.x. This is HIGH confidence — verified with official docs.

## Sidebar Active State Indicator

Replace the cyan/purple gradient on `.sidebar-item::before`:

```css
@layer components {
  .sidebar-item::before {
    /* Was: linear-gradient(180deg, #06b6d4, #8b5cf6) */
    background: linear-gradient(180deg, #f59e0b, #d4a017);
  }
}
```

## Body Background: Warm Dark Gradient

Replace the navy-indigo gradient:

```css
@layer base {
  body {
    /* Was: linear-gradient(135deg, #0a0e1a 0%, #0f172a 50%, #1e1b4b 100%) */
    background: linear-gradient(135deg, #120c08 0%, #1a1005 50%, #2d1c0c 100%);
    min-height: 100vh;
  }
}
```

These values create a near-black warm brown → deep amber-brown progression. The gradient is subtle — this avoids the "Halloween orange" problem while still being unmistakably warm.

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `tailwindcss-theming` plugin | Unnecessary complexity for a single-theme reskin; adds bundle weight | Direct CSS variable replacement in globals.css |
| `next-themes` | Only needed for light/dark switching; this project is dark-only | Not applicable |
| `tailwindcss-glow` plugin | Extra dependency for a trivial custom box-shadow | `box-shadow` in `tailwind.config.ts` theme.extend.boxShadow |
| CSS `filter: hue-rotate()` on components | Cannot hue-rotate the current cool palette to warm — purple/cyan to amber needs different luminance values | Replace color values directly |
| Hex values in tailwind.config.ts colors | Breaks opacity modifier syntax (`bg-custom/50` stops working) | RGB channel format: `'rgb(var(--color-amber) / <alpha-value>)'` |
| `bg-opacity-*` utilities | Deprecated pattern (v2 era); produces separate opacity prop | Slash syntax: `bg-amber-500/50` |
| White-tinted glass (`bg-white/10`) | Produces cold silver-grey tint on dark backgrounds | Warm amber rgba: `rgba(80, 45, 15, 0.5)` |

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| Direct CSS variable replacement in globals.css | CSS-in-JS (emotion, styled-components) | Project constraint: must use existing Tailwind; no new frameworks |
| `<alpha-value>` pattern in tailwind.config | Hex colors in config | Breaks opacity modifier syntax |
| Amber rgba for glass tint | `bg-white/10` (standard glassmorphism) | White tint = cold grey appearance on dark backgrounds |
| `backdrop-filter: saturate(140%)` | No saturation | Blur alone desaturates warm tones; saturate compensates |
| Keep semantic status colors (green/yellow/red) | Warm-ify all colors | Status colors are semantic — changing them breaks comprehension |

## Implementation Order

This sequence minimises regression risk:

1. **globals.css CSS variables** — swap `:root` color tokens first; everything downstream inherits
2. **globals.css `@layer base`** — update body gradient
3. **globals.css `@layer components`** — update `.glass-card`, `.neon-text`, `.gradient-text`, `.glow-*`, `.sidebar-item` active indicator
4. **tailwind.config.ts** — add extended colors + backgroundImage + boxShadow if needed for new utility classes
5. **Component files** — find/replace inline Tailwind color classes (cyan/purple/indigo/blue → amber/yellow/orange)

The CSS variable change in step 1 propagates automatically to any component using `var(--accent-cyan)` etc., reducing the component-level diff.

## Version Compatibility

| Pattern | Tailwind Version | Notes |
|---------|-----------------|-------|
| `bg-amber-500/50` slash opacity | 3.0+ | HIGH confidence — official docs |
| `<alpha-value>` in config colors | 3.1+ | HIGH confidence — official release notes |
| `shadow-amber-500/50` shadow color | 3.0+ | HIGH confidence — official docs |
| `backdrop-blur-*` utilities | 3.0+ | HIGH confidence — no JIT config needed in v3 |
| `from-amber-400 via-yellow-300` gradient stops | 3.0+ | HIGH confidence |
| `bg-gradient-to-r from-5%` precise stops | 3.3+ | HIGH confidence — v3.3 release notes |
| `amber-950` shade | 3.3+ | HIGH confidence — added in v3.3 specifically |
| `bg-[--custom-var]` shorthand (no `var()`) | 3.3+ | HIGH confidence — v3.3 release notes |

## Sources

- https://v3.tailwindcss.com/docs/customizing-colors — Custom color palette config patterns (HIGH)
- https://tailwindcss.com/blog/tailwindcss-v3-3 — v3.3 features: amber-950, CSS var shorthand, gradient stop positions (HIGH)
- https://dev.natestephens.com/opacity-with-css-variable-color — `<alpha-value>` pattern for CSS variable colors with opacity modifiers (MEDIUM, verified against v3.1 release notes)
- https://www.protailwind.com/workshops/multi-theme-strategy/multi-theme-tailwind/implementing-color-opacity-with-css-variables — RGB channel format for CSS variables (MEDIUM)
- https://www.joshwcomeau.com/css/backdrop-filter/ — backdrop-filter saturate technique for warm glass; blur + saturate(140%) pattern (HIGH — Josh W. Comeau is authoritative on CSS)
- https://www.epicweb.dev/tips/creating-glassmorphism-effects-with-tailwind-css — Core glassmorphism utility classes and isolation pattern (MEDIUM)
- https://tailwindcss.com/docs/backdrop-filter-blur — Official backdrop-blur values and arbitrary value support (HIGH)
- https://v3.tailwindcss.com/docs/box-shadow-color — shadow-color with opacity modifier syntax (HIGH)

---
*Stack research for: Mission Control warm glassmorphism UI redesign*
*Researched: 2026-02-24*
