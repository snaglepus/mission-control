# Phase 3: Typography & Page Frame - Research

**Researched:** 2026-02-25
**Domain:** Tailwind CSS class substitution, CSS gradient text, CSS text-shadow utilities
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Gradient text feel**
- Warm sunset glow character — soft, radiant warmth like golden hour light
- Color stops: amber-300 → amber-500 → orange-600 spectrum
- One consistent gradient across all gradient headings (no hierarchy variation)
- Direction: left-to-right (horizontal flow)
- Add subtle warm amber text-shadow behind gradient text for depth (not neon — faint ambient glow)

**Stat glow intensity**
- Subtle ambient warmth — barely visible amber halo, ~2px spread, low opacity
- Glow color matches the gradient text tone (same amber family) for unified palette
- Stat labels stay neutral/muted gray — only the numbers themselves get warm treatment
- Glow appears on hover only, not at rest — cleaner default state, rewarding on interaction

**Hover & focus states**
- Hover style: amber intensification — deepen the amber color and add subtle glow on hover
- Focus rings: custom amber/gold outline replacing browser default, for visual consistency with warm theme
- Transition timing: ~150-200ms ease for smooth, polished color shifts
- Tab/view switcher active indicator style: Claude's discretion (pick what fits current tab structure)

**Color mapping approach**
- Redesigned warmth — pick warm colors by visual intent, not shade-for-shade mapping
- Wide spectrum: use full range from yellow-300 to orange-700 for variety and visual hierarchy
- Preserve multi-tone: if an element had two cool colors, use two distinct warm colors (e.g., amber text + orange border)
- Main heading is the visual anchor — richest, most prominent warm element on the page; everything else supports it

### Claude's Discretion
- Tab/view switcher active indicator style (underline vs background fill — pick what fits current structure)
- Exact text-shadow values for gradient glow
- Specific shade choices per element within the wide amber-to-orange spectrum
- Transition easing curve details

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TYPO-01 | Gradient text headings use amber → gold → copper spectrum | `.gradient-text` and `.neon-text` CSS classes in `globals.css` both need warm gradient rewrites; one new `gradient-text-warm` pattern established |
| TYPO-02 | All ~45 inline cyan/purple/pink Tailwind classes replaced with amber/gold/orange equivalents | 31 lines in `page.tsx` carry cool colors; full audit below identifies every class and its warm replacement |
| TYPO-03 | Dividers and borders shifted from indigo tint to amber tint throughout | `border-indigo-500/10` appears 5× in `page.tsx`; `bg-[#0f172a]` hardcoded backgrounds appear in header and sidebar |
| TYPO-04 | Text glow utility uses warm amber shadow on stat values | `.text-glow` in `globals.css` currently `rgba(6,182,212,0.5)` — needs warm amber rewrite; hover-only behavior added via companion class |
</phase_requirements>

---

## Summary

Phase 3 is a CSS-only substitution phase with no functional changes. Two files own all the work: `src/app/globals.css` (utility class definitions) and `src/app/page.tsx` (inline Tailwind class strings and data-driven color strings). There are no new components, no new libraries, and no logic changes — only color token swaps and gradient rewrites.

The work splits cleanly into three buckets: (1) update CSS utility classes in `globals.css` — `.gradient-text`, `.neon-text`, `.neon-border`, `.sidebar-item::before`, `.glow-cyan`, `.glow-purple`, `.text-glow`; (2) replace inline Tailwind color classes throughout `page.tsx` — 31 affected lines covering borders, backgrounds, text colors, gradients, and glow shadows; (3) update hardcoded `bg-[#0f172a]` hex values in sidebar and header to match the warm dark background established in Phase 1.

The Tailwind v3 amber/orange/yellow palette provides all needed warm tones without any config changes. The existing CSS custom properties defined in Phase 1 (`--accent-amber`, `--accent-gold`, `--accent-copper`) are available as reference points for value matching.

**Primary recommendation:** Split into two tasks — (1) globals.css utility class rewrites, (2) page.tsx inline class substitutions. Both are mechanical but distinct files. Complete globals.css first so utility classes (`glow-cyan`, `.gradient-text`) have warm definitions before page.tsx references them.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | ^3.3.0 | Utility class color tokens | Already installed; amber/orange/yellow palettes built-in |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None needed | — | — | No new dependencies — pure CSS/class swap |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline Tailwind classes | CSS custom properties | Custom props are cleaner but this phase mirrors the existing pattern — keep inline for consistency with current codebase style |

**Installation:**
```bash
# No new packages needed
```

---

## Architecture Patterns

### Recommended Project Structure
```
src/app/
├── globals.css     # CSS utility classes — update here first
└── page.tsx        # Inline Tailwind classes — update second
```

### Pattern 1: Gradient Text in CSS
**What:** Reusable gradient text utility defined in `globals.css` using `-webkit-background-clip: text` + `-webkit-text-fill-color: transparent`
**When to use:** Applies to `.gradient-text` (used on "Robbie" heading) and `.neon-text` (used on "Mission Control" logo text)
**Example:**
```css
/* CURRENT (cool — replace) */
.gradient-text {
  background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* WARM REPLACEMENT — locked decision: amber-300 → amber-500 → orange-600, left-to-right */
.gradient-text {
  background: linear-gradient(90deg, #fcd34d 0%, #f59e0b 50%, #ea580c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  /* text-shadow does not apply to -webkit-text-fill-color elements directly;
     use drop-shadow filter instead for the faint ambient glow */
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.25));
}
```
Confidence: HIGH — this is the established cross-browser pattern for gradient text; verified by browser baseline, not stale.

### Pattern 2: Hover-Only Glow (stat values — TYPO-04)
**What:** Stat value numbers should have no glow at rest; warm amber halo appears on hover
**When to use:** The stat value `<p>` element inside `.glass-card`. The constraint says "stat labels stay neutral, only the numbers get warm treatment."
**Example:**
```css
/* In globals.css — TYPO-04 */
.text-glow {
  /* No glow at rest — hover-only per user decision */
  text-shadow: none;
  transition: text-shadow 150ms ease;
}

.text-glow:hover,
.glass-card:hover .text-glow {
  /* ~2px spread, low opacity, amber family */
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.35);
}
```
Note: The current `.text-glow` class is in `@layer utilities`. The hover state should live in `@layer components` or be added as a paired rule. Because `.text-glow` is currently a utility class, the cleanest approach is to move it to `@layer components` and add a `.glass-card:hover .text-glow` rule there.

### Pattern 3: Data-Driven Color Map Conversion (page.tsx)
**What:** Several sections in `page.tsx` use data arrays with a `color` string key that maps to Tailwind classes via an inline object or conditional. These are not individual class swaps — the whole color map must be replaced.
**When to use:** The `stats` array, `quickActions` array, and activity feed color conditionals.
**Example:**
```typescript
/* CURRENT (cool) */
const colorMap: Record<string, string> = {
  cyan: "from-cyan-500 to-cyan-600 shadow-cyan-500/30",
  purple: "from-purple-500 to-purple-600 shadow-purple-500/30",
  emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/30",
};

/* WARM REPLACEMENT — visual intent mapping (not shade-for-shade) */
const colorMap: Record<string, string> = {
  amber:   "from-amber-400 to-amber-600 shadow-amber-500/30",
  orange:  "from-orange-400 to-orange-600 shadow-orange-500/30",
  emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/30", // semantic — preserved
};
// Also update color: "cyan" → color: "amber", color: "purple" → color: "orange" in data arrays
```
Confidence: HIGH — this is a data/UI pattern, no external dependency.

### Pattern 4: Hardcoded Hex Background Migration
**What:** Sidebar (`bg-[#0f172a]/80`) and header (`bg-[#0f172a]/60`) use the old cool dark navy hex. Phase 1 established `#1a0f00` as the warm background. The opacity modifiers remain the same.
**Example:**
```tsx
/* CURRENT (cool navy) */
<aside className="... bg-[#0f172a]/80 ...">
<header className="... bg-[#0f172a]/60 ...">

/* WARM REPLACEMENT */
<aside className="... bg-[#1a0f00]/80 ...">
<header className="... bg-[#1a0f00]/60 ...">
```
Confidence: HIGH — Phase 1 STATE.md records `#1a0f00` as the warm dark background.

### Pattern 5: Focus Ring Replacement (search input)
**What:** The search input uses `focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20`. These must become warm amber equivalents.
**Example:**
```tsx
/* CURRENT */
className="... focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 ..."

/* WARM REPLACEMENT */
className="... focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 ..."
```
Confidence: HIGH — direct Tailwind class swap, v3 has `amber-*` as a full palette.

### Anti-Patterns to Avoid
- **Leaving `.glow-cyan` and `.glow-purple` as-is:** These are still used in `page.tsx` on the logo orb and nav dot. They need warm replacements in `globals.css` or the references in `page.tsx` need to switch to new warm equivalents.
- **Applying text-shadow directly to gradient-text elements:** `-webkit-text-fill-color: transparent` prevents `text-shadow` from being visible on the clipped text. Use `filter: drop-shadow()` instead for the ambient glow effect.
- **Keeping `bg-[#0f172a]` in header/sidebar:** This cool navy doesn't blend with the warm `#1a0f00` background. It will be visually inconsistent.
- **Using Tailwind's `text-shadow` plugin (doesn't exist in v3):** Tailwind v3 does not have a `text-shadow` utility. All text-shadow must be in CSS via `@layer components` or `@layer utilities` — exactly how it's already done.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Gradient text | Custom SVG/canvas solution | CSS gradient + background-clip pattern (already in codebase) | Cross-browser, performant, already established pattern |
| Text glow on hover | JS mouseenter/mouseleave | CSS `:hover` + `transition` | Zero JS overhead, matches existing transition pattern |

**Key insight:** Everything needed is already in the codebase pattern established by Phases 1-2. This phase extends and converts existing patterns, not builds new ones.

---

## Complete Audit: Cool-Color Elements in page.tsx

This is the definitive list of every line requiring change (31 lines total):

### Sidebar (lines 42–93)
| Line | Current | Warm Replacement |
|------|---------|-----------------|
| 42 | `border-r border-indigo-500/10`, `bg-[#0f172a]/80` | `border-r border-amber-500/10`, `bg-[#1a0f00]/80` |
| 45 | `border-b border-indigo-500/10` | `border-b border-amber-500/10` |
| 46 | `from-cyan-400 to-purple-600`, `glow-cyan` | `from-amber-400 to-orange-600`, `glow-amber` (new utility) |
| 65 | `from-cyan-500/20 to-purple-600/20 text-cyan-400` | `from-amber-500/20 to-orange-600/20 text-amber-400` |
| 70 | `bg-cyan-500/20` | `bg-amber-500/20` |
| 72 | `text-cyan-400` | `text-amber-400` |
| 78 | `bg-cyan-400 glow-cyan` | `bg-amber-400 glow-amber` |
| 86 | `border-t border-indigo-500/10` | `border-t border-amber-500/10` |

### Header (lines 99–128)
| Line | Current | Warm Replacement |
|------|---------|-----------------|
| 99 | `bg-[#0f172a]/60`, `border-b border-indigo-500/10` | `bg-[#1a0f00]/60`, `border-b border-amber-500/10` |
| 106 | `border-indigo-500/20`, `focus:border-cyan-500/50`, `focus:ring-cyan-500/20` | `border-amber-500/20`, `focus:border-amber-500/50`, `focus:ring-amber-500/20` |
| 113 | `from-pink-500 to-purple-500` | `from-amber-400 to-orange-500` (notification dot — two warm tones) |
| 118 | `border-l border-indigo-500/20` | `border-l border-amber-500/20` |
| 123 | `from-cyan-500 to-purple-600`, `glow-cyan` | `from-amber-500 to-orange-600`, `glow-amber` |

### DashboardOverview — Stats data (lines 150–175)
| Line | Current | Warm Replacement |
|------|---------|-----------------|
| 150–151 | `from-cyan-500 to-cyan-600`, `shadow-cyan-500/30` | `from-amber-400 to-amber-600`, `shadow-amber-500/30` |
| 158–159 | `from-purple-500 to-pink-500`, `shadow-purple-500/30` | `from-orange-400 to-orange-600`, `shadow-orange-500/30` |

### DashboardOverview — Quick Actions (lines 185–264)
| Line | Current | Warm Replacement |
|------|---------|-----------------|
| 185 | `color: "cyan"` | `color: "amber"` |
| 192 | `color: "purple"` | `color: "orange"` |
| 245 | `cyan: "from-cyan-500 to-cyan-600 shadow-cyan-500/30"` | `amber: "from-amber-400 to-amber-600 shadow-amber-500/30"` |
| 246 | `purple: "from-purple-500 to-purple-600 shadow-purple-500/30"` | `orange: "from-orange-400 to-orange-600 shadow-orange-500/30"` |
| 260 | `text-cyan-400` | `text-amber-400` |

### DashboardOverview — Recent Activity (lines 274–303)
| Line | Current | Warm Replacement |
|------|---------|-----------------|
| 274 | `text-cyan-400` (Clock icon) | `text-amber-400` |
| 277 | `text-cyan-400 hover:text-cyan-300` | `text-amber-400 hover:text-amber-300` |
| 283 | `color: "cyan"` | `color: "amber"` |
| 285 | `color: "purple"` | `color: "orange"` |
| 288 | `border-b border-indigo-500/10` | `border-b border-amber-500/10` |
| 290 | `item.color === "cyan" ? "bg-cyan-400"` | `item.color === "amber" ? "bg-amber-400"` |
| 292 | `item.color === "purple" ? "bg-purple-400"` | `item.color === "orange" ? "bg-orange-400"` |
| 300 | `"bg-cyan-500/20 text-cyan-400"` | `"bg-amber-500/20 text-amber-400"` |
| 302 | `"bg-purple-500/20 text-purple-400"` | `"bg-orange-500/20 text-orange-400"` |

---

## Complete Audit: globals.css Utility Classes Needing Warm Rewrites

| Class | Current (cool) | Required Change |
|-------|----------------|-----------------|
| `.gradient-text` | `linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)` | Warm: `linear-gradient(90deg, #fcd34d 0%, #f59e0b 50%, #ea580c 100%)` + `filter: drop-shadow(0 0 8px rgba(251,191,36,0.25))` |
| `.neon-text` | `linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)` | Warm: same amber-to-orange spectrum (used for "Mission Control" logo — but NOTE: sidebar is Phase 5 scope per SIDE-02) |
| `.neon-border::before` | `linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899)` | Warm amber-to-orange |
| `.sidebar-item::before` | `linear-gradient(180deg, #06b6d4, #8b5cf6)` | Warm: `linear-gradient(180deg, #f59e0b, #ea580c)` |
| `.glow-cyan` | `box-shadow: 0 0 20px rgba(6,182,212,0.3)` | Rename to `.glow-amber` OR update in-place: `rgba(251,191,36,0.3)` |
| `.glow-purple` | `box-shadow: 0 0 20px rgba(139,92,246,0.3)` | No longer needed after page.tsx purge; can be deleted or kept dormant |
| `.text-glow` | `text-shadow: 0 0 20px rgba(6,182,212,0.5)` | `text-shadow: none` at rest; hover rule: `text-shadow: 0 0 8px rgba(251,191,36,0.35)` |

---

## Common Pitfalls

### Pitfall 1: text-shadow Invisible on Gradient Text
**What goes wrong:** Developer adds `text-shadow` to `.gradient-text` but the glow is invisible.
**Why it happens:** `-webkit-text-fill-color: transparent` makes the text transparent; `text-shadow` renders behind the fill — it exists but the transparent pixels obscure it. Also, some browsers suppress text-shadow entirely when background-clip: text is active.
**How to avoid:** Use `filter: drop-shadow(0 0 8px rgba(251,191,36,0.25))` on the element instead. This applies the shadow as a post-render filter effect.
**Warning signs:** Added shadow rule but no visible glow in browser.

### Pitfall 2: glow-cyan Still Referenced After Rename
**What goes wrong:** `.glow-cyan` is renamed or replaced with `.glow-amber` in `globals.css`, but `page.tsx` still has `glow-cyan` in className strings.
**Why it happens:** Disconnected rename — CSS and JSX not updated together.
**How to avoid:** Either rename the class AND update all references in the same task, or update the CSS definition in-place (keeping `.glow-cyan` as the class name but changing its value to warm amber). In-place update is safer for a migration phase.
**Warning signs:** Logo orb and nav indicator dot lose their glow entirely.

### Pitfall 3: Missing the data-driven color strings
**What goes wrong:** The raw Tailwind class strings in the stats array, quickActions colorMap, and activity feed conditionals are left as `"cyan"` / `"purple"` strings — the `grep` check will catch these even though they're in JS string values, not className props.
**Why it happens:** Searching for className JSX attributes misses plain string values in data arrays.
**How to avoid:** The `grep -n "cyan\|purple\|pink\|indigo"` success criterion checks ALL occurrences, not just className — audit covers data arrays too.
**Warning signs:** `grep` check still returns results after className updates.

### Pitfall 4: `bg-[#0f172a]` left in sidebar/header
**What goes wrong:** Sidebar and header have `bg-[#0f172a]/80` and `bg-[#0f172a]/60` — the old cool dark navy. These are NOT caught by the `grep` check (hex, not named color), but they visually conflict with the warm `#1a0f00` body background.
**Why it happens:** The success criteria grep misses hex values.
**How to avoid:** Explicitly include these two lines in the page.tsx substitution task.
**Warning signs:** Sidebar and header appear as cool-tinted panels against warm background.

### Pitfall 5: emerald colors in stats treated as "cool"
**What goes wrong:** `from-emerald-500 to-teal-500` (Meetings stat) and `from-emerald-500 to-emerald-600 shadow-emerald-500/30` (Quick Actions) are in the cool-adjacent range but are *semantic* (used for "Meetings" which doesn't have a semantic color meaning).
**Why it happens:** Emerald/teal isn't in the grep check targets (cyan/purple/pink/indigo), so they won't fail the test.
**How to avoid:** The phase success criterion only checks for `cyan|purple|pink|indigo`. Emerald/teal can stay or be converted — per CONTEXT.md color mapping: "Wide spectrum, use full range from yellow-300 to orange-700 for variety." These are ambiguous. Safest choice: convert Meetings stat to an amber-adjacent warm tone and mark it clearly in the plan.
**Warning signs:** None from the grep check — this is a visual judgment call.

---

## Code Examples

### Warm Gradient Text (TYPO-01)
```css
/* Source: established CSS pattern in globals.css — rewrite only the gradient values */
.gradient-text {
  background: linear-gradient(90deg, #fcd34d 0%, #f59e0b 50%, #ea580c 100%);
  /* amber-300 → amber-500 → orange-600 per locked decision */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.25));
  /* drop-shadow instead of text-shadow — works with transparent fill */
}
```

### Warm Text Glow Utility (TYPO-04)
```css
/* Source: globals.css @layer utilities → move to @layer components to support hover */
/* TYPO-04: hover-only, ~2px spread, low opacity, amber family */
.text-glow {
  text-shadow: none;
  transition: text-shadow 150ms ease;
}

.glass-card:hover .text-glow {
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.35);
}
```

### Warm Sidebar Active State (inline TSX)
```tsx
/* Sidebar nav button — active state */
className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 sidebar-item group ${
  isActive
    ? "bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-400"
    : "text-slate-400 hover:text-amber-300 hover:bg-amber-500/5"
}`}
```

### Warm Focus Ring (search input)
```tsx
className="w-full bg-[#1a0f00]/50 border border-amber-500/20 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
```

### New glow-amber Utility
```css
/* Replace glow-cyan used on logo orb and nav indicator */
.glow-amber {
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
}
```
OR update `.glow-cyan` in-place (safer — avoids missing any reference):
```css
.glow-cyan {
  /* Renamed intent: warm amber glow */
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
}
```

### Warm Activity Badge (conditional in JSX)
```tsx
{/* Activity feed color conditional — data-driven */}
item.color === "amber" ? "bg-amber-400" :
item.color === "orange" ? "bg-orange-400" :
"bg-emerald-400"

{/* Activity badge pill */}
item.type === "meeting" ? "bg-amber-500/20 text-amber-400" :
item.type === "task" ? "bg-amber-500/20 text-amber-400" :
item.type === "deliverable" ? "bg-orange-500/20 text-orange-400" :
"bg-emerald-500/20 text-emerald-400"
```

---

## Recommended Task Split

Based on file ownership and logical grouping:

**Task 1 — globals.css warm utility rewrites**
- Rewrite `.gradient-text` (warm gradient + drop-shadow filter)
- Rewrite `.neon-text` (warm gradient)
- Rewrite `.neon-border::before` (warm gradient)
- Rewrite `.sidebar-item::before` (warm gradient indicator)
- Update `.glow-cyan` in-place to amber (safest — no JSX rename needed)
- Delete or retain `.glow-purple` (no longer used after Task 2)
- Rewrite `.text-glow` (hover-only, warm amber, move to @layer components)

**Task 2 — page.tsx inline class substitutions**
- Sidebar borders: 4× `border-indigo-500/10` → `border-amber-500/10`
- Header borders: 2× `border-indigo-500/10`, 1× `border-indigo-500/20` → amber
- Hardcoded backgrounds: `bg-[#0f172a]/80` → `bg-[#1a0f00]/80`, `bg-[#0f172a]/60` → `bg-[#1a0f00]/60`
- Logo orb: `from-cyan-400 to-purple-600` → `from-amber-400 to-orange-600`
- Sidebar active: `from-cyan-500/20 to-purple-600/20 text-cyan-400` → warm
- Nav icon active: `bg-cyan-500/20`, `text-cyan-400` → amber
- Nav indicator dot: `bg-cyan-400` → `bg-amber-400`
- Notification dot: `from-pink-500 to-purple-500` → `from-amber-400 to-orange-500`
- Header avatar: `from-cyan-500 to-purple-600` → `from-amber-500 to-orange-600`
- Search focus: `border-indigo-500/20`, `focus:border-cyan-500/50`, `focus:ring-cyan-500/20` → amber
- Stats data: two cool gradient/glow entries → warm
- Quick actions colorMap: cyan/purple → amber/orange
- Recent activity: Clock icon color, View All button, color strings, border, dot colors, badge colors

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS text-shadow for gradient glow | `filter: drop-shadow()` | Always been the case with `background-clip: text` | text-shadow doesn't work with transparent fills |
| Tailwind v2 color names | Tailwind v3 color names (same amber/orange palette) | Tailwind v3 (already in use) | No change needed |

**Deprecated/outdated:**
- `.glow-purple`: No warm equivalent needed — purple is not in the warm palette. Class can be deleted after page.tsx purge confirms no remaining references.
- `.card-gradient` class in globals.css: Currently uses cool colors (`#0f172a`, `#1e1b4b`) but is NOT referenced in page.tsx — out of scope for this phase, but worth noting for Phase 4.

---

## Open Questions

1. **Emerald/teal in stats and quick actions**
   - What we know: `from-emerald-500 to-teal-500` (Meetings stat) and `from-emerald-500 to-emerald-600` (Quick Actions) are not caught by the grep success check
   - What's unclear: Should "Meetings" use a warm amber tone or stay emerald as a quasi-semantic color?
   - Recommendation: Convert Meetings stat to `from-yellow-400 to-amber-500` for full warm palette — or retain emerald as a visual contrast note. User decision left to Claude's discretion per CONTEXT.md ("Specific shade choices per element within the wide amber-to-orange spectrum").

2. **`.neon-text` scope**
   - What we know: `.neon-text` is used on the "Mission Control" logo text (line 50 of page.tsx). Sidebar visual redesign is Phase 5 (SIDE-01, SIDE-02, SIDE-03).
   - What's unclear: Should `.neon-text` be warm-converted now (TYPO-02 says "all ~105 inline classes"), or deferred because the sidebar is Phase 5?
   - Recommendation: Rewrite `.neon-text` in globals.css now (TYPO-01/02 scope) — the text color conversion is typography work. Phase 5 owns layout restructure, not the color of the text. Converting the gradient now prevents a cool flash during sidebar interaction.

---

## Sources

### Primary (HIGH confidence)
- Codebase direct audit — `src/app/page.tsx`, `src/app/globals.css`, `src/app/layout.tsx` — read in full
- `package.json` — Tailwind CSS ^3.3.0 confirmed
- `.planning/STATE.md` — Phase 1 background color `#1a0f00` confirmed

### Secondary (MEDIUM confidence)
- CSS background-clip text + filter:drop-shadow pattern — established browser behavior, no external source needed

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Tailwind v3 confirmed, no new deps, all patterns in existing codebase
- Architecture: HIGH — two-file scope, audit complete with exact line numbers
- Pitfalls: HIGH — identified from direct codebase inspection, not speculation

**Research date:** 2026-02-25
**Valid until:** Stable (CSS-only, no external dependency changes)
