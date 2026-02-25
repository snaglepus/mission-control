# Phase 5: Sidebar & Polish - Research

**Researched:** 2026-02-25
**Domain:** CSS layout restructuring, Tailwind styling, Next.js static assets, CSS animations
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Sidebar layout format**
- Single fixed slim width (~80px) — no collapse/expand toggle
- Remove the sidebar toggle button entirely
- Icon centered above small text label (12px) for each nav item
- Nav items grouped near the top below the logo — bottom area left empty
- Remove the "Mission Control" text that currently shows when expanded

**Active state & indicator**
- Left edge vertical bar on the active nav item (3-4px wide)
- Bar uses amber-to-orange gradient (top to bottom)
- Active item also gets a subtle gradient background fill (amber/orange at ~15-20% opacity)
- Active text/icon color: amber
- Inactive items: subtle hover glow effect (faint amber tint) for clickable feedback

**Logo orb treatment**
- Change from rounded square (rounded-xl) to circular orb shape
- Keep size at 40px — no increase
- Amber-to-orange gradient maintained
- Add subtle pulse glow animation (3-4 second breathing cycle)
- No text label below the orb — orb only at the top of the sidebar

**Background atmosphere**
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

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SIDE-01 | Sidebar active state uses amber/orange gradient colors and indicator bar | Existing `.sidebar-item::before` pseudo-element and active class pattern in globals.css already implements the left bar — needs refinement to match icon-above-label layout height; active background gradient already partially implemented in page.tsx |
| SIDE-02 | Logo orb uses amber-to-orange gradient with warm glow | Logo orb div already exists in page.tsx with `rounded-xl bg-gradient-to-br from-amber-400 to-orange-600` — change to `rounded-full`, add CSS keyframe pulse glow animation |
| SIDE-03 | Sidebar restructured to slim icon-above-label format with centered layout | `sidebarOpen` state and `w-64`/`w-20` toggle must be removed; sidebar fixed at ~80px; nav item button must switch from horizontal flex to vertical flex-col layout |
</phase_requirements>

## Summary

Phase 5 is a focused CSS and JSX refactor — no new libraries needed, no tech stack changes. The work falls into three distinct areas: (1) restructure the sidebar JSX from a toggling wide/collapsed layout to a fixed slim vertical layout with icons stacked above labels; (2) add a CSS keyframe pulse glow to the logo orb and change it from rounded-xl to rounded-full; (3) introduce a full-screen background image with a darken overlay and verify the existing ambient orbs still layer correctly on top.

The most important discovery is that the sidebar currently uses `sidebarOpen` state with conditional rendering (`{sidebarOpen && <span>...</span>}`) that must be completely removed, not just hidden. The collapse toggle button in the bottom actions div must be deleted entirely. The fixed width change from a responsive `w-64/w-20` to a constant `w-20` (or explicit `80px` via inline style) is a one-line change but has layout implications — the main content area `flex-1` will naturally expand to fill the remaining space.

The background image change overrides what was originally listed as "out of scope" in REQUIREMENTS.md. The user explicitly decided this during the discussion phase — CONTEXT.md locked decisions supersede REQUIREMENTS.md out-of-scope notes. The implementation approach (full-screen fixed `<img>` or CSS `background-image` with a pseudo-element or stacked `<div>` darken overlay) is straightforward and has no blocking complexity.

**Primary recommendation:** Three sequential tasks — (1) background image setup, (2) sidebar layout restructure + active states + logo orb, (3) visual verification. The image task is lowest risk and should go first since it affects the canvas everything else renders over.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | ^3.3.0 | Utility classes for layout, spacing, color | Already in project; JIT classes for arbitrary values |
| Next.js | 14.2.35 | Static asset serving from /public dir | Already in project; no config needed for static images |
| Lucide React | ^0.475.0 | Icons (LayoutDashboard, Users, Calendar, CheckSquare, Zap) | Already in project; current icon set retained |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS custom properties | N/A | Token references (`--accent-amber`, `--accent-gold`) | Use existing tokens from :root when specifying gradient colors |
| CSS @keyframes | N/A | Logo pulse glow animation, orb drift animations | Already established pattern in globals.css (see orb-drift-1/2/3) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS background-image | Next.js `<Image>` component | next/image adds LCP optimization but requires explicit width/height; for a decorative full-bleed background the CSS approach or a plain `<img>` with `object-cover` is simpler; CSS background-image on body is cleanest |
| Pseudo-element darken overlay | Stacked `<div>` overlay | Both work; pseudo-element on body keeps JSX clean; stacked div in layout.tsx is more explicit — both are valid |
| Inline `w-20` Tailwind | `style={{ width: '80px' }}` | Tailwind is consistent with project patterns; w-20 = 80px exactly |

**Installation:** No new packages required.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── globals.css        # Add: logo-pulse keyframe, sidebar-slim classes, bg-image+overlay styles
│   ├── layout.tsx         # Add: bg-image element behind ambient-orbs (OR use CSS background-image on body)
│   └── page.tsx           # Modify: sidebar JSX — remove toggle state, restructure nav items to icon-above-label
public/
└── images/
    └── bg-sunset.jpg      # NEW: sunset ocean background image (user to provide)
```

### Pattern 1: Fixed Slim Sidebar (icon-above-label)

**What:** Replace the current width-toggling sidebar with a fixed `w-20` sidebar where each nav item uses a vertical flex column — icon centered, 12px label below.

**When to use:** Always for the sidebar nav items in Phase 5.

**Current code (to replace):**
```tsx
// Current: horizontal flex, toggling width
<aside className={`${sidebarOpen ? "w-64" : "w-20"} ...`}>
  <button className="w-full flex items-center px-4 py-3.5 ...">
    <div><Icon /></div>
    {sidebarOpen && <span className="ml-3 font-medium">{tool.name}</span>}
  </button>
</aside>
```

**New pattern:**
```tsx
// New: fixed w-20, vertical flex column per nav item
<aside className="w-20 bg-[#1a0f00]/80 backdrop-blur-xl border-r border-amber-500/10 flex flex-col">
  <button
    className={`w-full flex flex-col items-center py-3 px-1 rounded-xl transition-all duration-300 sidebar-item group ${
      isActive
        ? "bg-gradient-to-b from-amber-500/20 to-orange-600/15 text-amber-400 active"
        : "text-slate-400 hover:text-amber-300 hover:bg-amber-500/5"
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="mt-1 text-[11px] font-medium leading-tight">{tool.name}</span>
  </button>
</aside>
```

### Pattern 2: Active Indicator Bar via CSS (existing pattern, refined)

**What:** The existing `.sidebar-item::before` pseudo-element in globals.css already creates a left-edge vertical bar with amber-to-orange gradient. The current implementation sets `height: 0` by default and `height: 60%` on active/hover. With icon-above-label layout the button height will be taller (~70-80px) — the 60% height still works proportionally. The `::before` pseudo-element already has:

```css
/* Already exists in globals.css */
.sidebar-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: linear-gradient(180deg, #f59e0b, #ea580c);
  border-radius: 0 3px 3px 0;
  transition: height 0.3s ease;
}

.sidebar-item:hover::before,
.sidebar-item.active::before {
  height: 60%;
}
```

**Refinement needed:** The `.active` class must be applied conditionally in JSX (currently uses `active` in className — confirm this is passed to the button element and not just as a boolean attribute). In React, pass it as part of the className string: `${isActive ? "sidebar-item active" : "sidebar-item"}`.

### Pattern 3: Logo Orb Pulse Glow Animation

**What:** Add a CSS keyframe animation for a slow breathing glow to the logo orb.

**New CSS keyframe in globals.css:**
```css
@keyframes logo-pulse {
  0%, 100% {
    box-shadow: 0 0 12px rgba(251, 191, 36, 0.4), 0 0 24px rgba(234, 88, 12, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.7), 0 0 40px rgba(234, 88, 12, 0.35);
  }
}

.logo-orb {
  animation: logo-pulse 3.5s ease-in-out infinite;
  border-radius: 50%; /* circular, not rounded-xl */
}
```

**JSX change:**
```tsx
// From:
<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center glow-warm">

// To:
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center logo-orb">
```

### Pattern 4: Background Image with Darken Overlay

**What:** Next.js 14 serves files from `public/` at the root URL path. An image at `public/images/bg-sunset.jpg` is accessible as `/images/bg-sunset.jpg`.

**Recommended approach — CSS on body + pseudo-element overlay:**
```css
/* In globals.css, replace the @layer base body rule */
@layer base {
  body {
    /* Fallback gradient preserved for when image hasn't loaded */
    background: linear-gradient(135deg, #1a0f00 0%, #2d1a06 50%, #1f1208 100%);
    min-height: 100vh;
    position: relative;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url('/images/bg-sunset.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    /* Darken overlay: multiply + dark color OR just rgba overlay */
    z-index: -1;
  }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background: rgba(10, 5, 0, 0.55); /* ~55% darken */
    z-index: -1;
  }
}
```

**Concern:** `body::before` and `body::after` are both used — this is within spec for CSS pseudo-elements. However the `.ambient-orbs` div in layout.tsx is `position: fixed; z-index: 0` and the main content wrapper is `z-index: 1`. The image and overlay at `z-index: -1` will sit behind both correctly.

**Alternative approach — extra div in layout.tsx (more explicit):**
```tsx
// In layout.tsx, add before ambient-orbs:
<div
  className="fixed inset-0 bg-cover bg-center"
  style={{
    backgroundImage: "url('/images/bg-sunset.jpg')",
    zIndex: -2
  }}
  aria-hidden="true"
/>
<div
  className="fixed inset-0"
  style={{ background: 'rgba(10, 5, 0, 0.55)', zIndex: -1 }}
  aria-hidden="true"
/>
```

Discretion: The CSS pseudo-element approach is cleaner (no extra JSX nodes). Recommend it unless the image file isn't confirmed present.

### Pattern 5: Logo Section Cleanup

**What:** Remove `{sidebarOpen && <span>Mission Control</span>}` and the bottom actions div (toggle button). Logo section changes from left-aligned with text to centered orb only.

```tsx
// From: left-aligned with text
<div className="h-20 flex items-center px-6 border-b border-amber-500/10">
  <div className="w-10 h-10 rounded-xl ..."><Zap /></div>
  {sidebarOpen && <span className="ml-3 font-bold text-xl neon-text">Mission Control</span>}
</div>

// To: centered orb only
<div className="h-20 flex items-center justify-center border-b border-amber-500/10">
  <div className="w-10 h-10 rounded-full ... logo-orb"><Zap /></div>
</div>
```

### Anti-Patterns to Avoid

- **Hiding label with `hidden` class instead of removing conditional:** The `{sidebarOpen && <span>}` pattern must be replaced by unconditional label rendering — the label is always visible in the slim sidebar.
- **Leaving `sidebarOpen` state:** Remove the `useState(true)` for `sidebarOpen` and all references. Dead state causes confusion.
- **Leaving the `Menu`/`X` import:** Once the toggle button is removed, `Menu` and `X` from lucide-react should be cleaned up from the import list to avoid TypeScript unused variable warnings.
- **Using `background-attachment: fixed` on body background-image for Safari:** Safari has historically broken `background-attachment: fixed` inside scroll containers. Use `position: fixed` on a pseudo-element or separate div instead — this is already the recommended pattern above.
- **Setting z-index on the background image element higher than 0:** The ambient orbs sit at z-index 0 and must render on top of the image. Keep image z-index negative.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pulse glow animation | Custom JS animation loop | CSS @keyframes + animation property | GPU-composited, zero JS overhead, consistent with existing orb drift pattern |
| Active indicator bar | Extra JSX element | Existing `.sidebar-item::before` pseudo-element | Already implemented and styled in globals.css |
| Icon-above-label layout | Custom CSS grid | Tailwind `flex flex-col items-center` | Three utility classes accomplish this entirely |
| Background image serving | Custom API route | Next.js `public/` directory | Zero config, served at root URL automatically |

**Key insight:** Everything needed for this phase is already in the project (CSS patterns, animation infrastructure, Tailwind utilities). This phase is pure composition and cleanup, not new capability.

## Common Pitfalls

### Pitfall 1: React `active` Prop vs CSS Class

**What goes wrong:** In React, passing `active={true}` as a prop to a native element renders the boolean attribute `active` in the DOM, not the CSS class `.active`. The `.sidebar-item.active::before` CSS rule matches the CSS class, not the attribute.

**Why it happens:** Confusion between React props and CSS class names.

**How to avoid:** Always add `active` as part of the `className` string:
```tsx
// Correct — adds CSS class "active"
className={`sidebar-item ${isActive ? "active" : ""}`}

// Wrong — sets HTML attribute `active=""`
<button active={isActive}>
```

**Warning signs:** Indicator bar never appears even though `isActive` is true.

### Pitfall 2: Background Image Not Found / Blank Background

**What goes wrong:** Image placed anywhere other than the `public/` directory (e.g., in `src/`, `assets/`, or imported via JS) won't be served at a simple `/path` URL by Next.js.

**Why it happens:** Next.js static file serving only works from the `public/` directory root.

**How to avoid:** Place image at `public/images/bg-sunset.jpg`. Reference as `url('/images/bg-sunset.jpg')` in CSS or `src="/images/bg-sunset.jpg"` in JSX. The `public/` directory must be created if it doesn't exist (currently absent from the project).

**Warning signs:** Background shows fallback gradient only; browser DevTools shows 404 for the image URL.

### Pitfall 3: Removing `sidebarOpen` State Causes Type Errors

**What goes wrong:** After removing `useState(true)` for `sidebarOpen`, any remaining references to `sidebarOpen` in the JSX will throw TypeScript errors.

**Why it happens:** The `setSidebarOpen` call in the bottom actions button is removed but `sidebarOpen` may still appear in conditionals not yet cleaned up.

**How to avoid:** Do a full text search for `sidebarOpen` and `setSidebarOpen` before declaring the task done. Also remove `Menu` and `X` from the lucide-react imports since those icons are only used by the toggle button.

**Warning signs:** TypeScript compilation errors on `sidebarOpen is not defined`.

### Pitfall 4: The `body::before` / `::after` Z-Index Stack

**What goes wrong:** If the image pseudo-element has z-index >= 0, it will render on top of the ambient orbs (z-index: 0 in `.ambient-orbs`) and potentially obscure content.

**Why it happens:** Z-index stacking context on `<body>` when `position: relative` is set.

**How to avoid:** Use `z-index: -2` for the image layer and `z-index: -1` for the overlay. The body must have `position: relative` for negative z-index children to work correctly. The layout.tsx `.ambient-orbs` wrapper already uses `position: fixed; z-index: 0` — this is above any negative z-index so stacking is correct.

**Warning signs:** Background image covers glassmorphism panels or orbs disappear.

### Pitfall 5: Icon Sizing in Vertical Layout Affects Label Readability

**What goes wrong:** Icon too large (w-8 h-8) in the 80px wide sidebar leaves insufficient space for the text label, causing truncation on "Meetings" or "Overview".

**Why it happens:** 80px sidebar minus padding leaves ~60px max content width. "Meetings" at 12px font needs approximately 50px.

**How to avoid:** Keep icons at w-5 h-5 (20px). Use `text-[11px]` for labels (11px fits "Meetings" comfortably at 80px sidebar width). Verify all four labels: "Overview", "Clients", "Meetings", "Tasks" — "Overview" and "Meetings" are the longest.

**Warning signs:** Label text wraps to two lines or appears cut off.

## Code Examples

Verified patterns from the codebase:

### Complete Sidebar Restructure (page.tsx)
```tsx
// Remove from imports: Menu, X (no longer needed)
// Remove state: const [sidebarOpen, setSidebarOpen] = useState(true);

<aside className="w-20 bg-[#1a0f00]/80 backdrop-blur-xl border-r border-amber-500/10 flex flex-col">
  {/* Logo */}
  <div className="h-20 flex items-center justify-center border-b border-amber-500/10">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center logo-orb">
      <Zap className="w-5 h-5 text-white" />
    </div>
  </div>

  {/* Navigation */}
  <nav className="flex-1 py-6 px-2 space-y-1">
    {tools.map((tool) => {
      const Icon = tool.icon;
      const isActive = activeView === tool.id;
      return (
        <button
          key={tool.id}
          onClick={() => setActiveView(tool.id)}
          className={`w-full flex flex-col items-center py-3 px-1 rounded-xl transition-all duration-300 sidebar-item ${
            isActive
              ? "bg-gradient-to-b from-amber-500/20 to-orange-600/15 text-amber-400 active"
              : "text-slate-400 hover:text-amber-300 hover:bg-amber-500/5"
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="mt-1 text-[11px] font-medium">{tool.name}</span>
        </button>
      );
    })}
  </nav>
  {/* Bottom area intentionally empty */}
</aside>
```

### Logo Orb Animation (globals.css)
```css
@keyframes logo-pulse {
  0%, 100% {
    box-shadow: 0 0 12px rgba(251, 191, 36, 0.4), 0 0 24px rgba(234, 88, 12, 0.2);
  }
  50% {
    box-shadow: 0 0 22px rgba(251, 191, 36, 0.7), 0 0 44px rgba(234, 88, 12, 0.35);
  }
}

.logo-orb {
  animation: logo-pulse 3.5s ease-in-out infinite;
}
```

### Background Image + Overlay (globals.css — @layer base body replacement)
```css
@layer base {
  body {
    background: linear-gradient(135deg, #1a0f00 0%, #2d1a06 50%, #1f1208 100%);
    min-height: 100vh;
    position: relative;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url('/images/bg-sunset.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -2;
  }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background: rgba(10, 5, 0, 0.55);
    z-index: -1;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Collapsible sidebar (w-64/w-20 toggle) | Fixed slim sidebar (w-20 constant) | Phase 5 | Eliminates toggle state, simplifies JSX conditionals |
| Rounded square logo (rounded-xl) | Circular orb (rounded-full) | Phase 5 | Matches "orb" design language used for ambient orbs |
| Pure CSS gradient background | CSS gradient + background image + orb overlay | Phase 5 | Overrides original REQUIREMENTS.md out-of-scope entry — user decision during discussion |
| Static glow-warm on logo | CSS keyframe pulse animation | Phase 5 | Consistent with "breathing" motion language of ambient orbs |

**Overrides from original REQUIREMENTS.md:**
- "Photo/video background" was listed as out of scope: **User decision in CONTEXT.md supersedes this**. The sunset ocean image is a locked decision. The concern in REQUIREMENTS.md was about performance and glassmorphism readability — the 50-60% darken overlay addresses readability, and a static image has no animation performance cost.

## Open Questions

1. **Background image file — user must provide it**
   - What we know: The user described "a luxury modern living room with panoramic sunset over ocean" and said it needs to be added to `public/assets` (CONTEXT.md specifics section).
   - What's unclear: The image file itself is not yet in the project. The plan will need a task that instructs the user to provide the file and drop it into `public/images/` (or `public/assets/`). The CSS path reference must match wherever it's placed.
   - Recommendation: Plan for a user-action task: "Drop the sunset image into `public/images/bg-sunset.jpg`" and a verification step that confirms the image loads before proceeding to visual approval.

2. **Existing `.sidebar-item::before` height with new layout**
   - What we know: Currently `height: 60%` on active state. With icon-above-label buttons the total button height will be ~72px (16px icon + 4px gap + 11px text + padding). 60% of 72px = 43px — this may look short.
   - What's unclear: Whether 60% works visually or should be increased to 70-80% for the taller button.
   - Recommendation: Start with 70% in the implementation; adjust during visual verification.

3. **CONTEXT.md says `public/assets` vs research recommendation of `public/images`**
   - What we know: CONTEXT.md "Specifics" section says "added to the project's public/assets directory".
   - What's unclear: The user may have a preference for the folder name.
   - Recommendation: Use `public/assets/bg-sunset.jpg` to match the user's stated preference in CONTEXT.md. Update CSS reference accordingly.

## Validation Architecture

> Skipping — `workflow.nyquist_validation` not present in `.planning/config.json` (only `research`, `plan_check`, `verifier` keys present, no `nyquist_validation` key). Nyquist validation is not enabled.

## Sources

### Primary (HIGH confidence)
- Direct codebase read — `src/app/page.tsx`: Full sidebar JSX structure, `sidebarOpen` state, toggle button, logo div, nav items with conditional rendering — current state confirmed
- Direct codebase read — `src/app/globals.css`: Full CSS including `.sidebar-item`, `.sidebar-item::before`, `.orb`, `@keyframes orb-drift-*`, `@layer base body` rule — all existing patterns confirmed
- Direct codebase read — `src/app/layout.tsx`: `.ambient-orbs` structure, z-index layer (z-index: 0 for orbs, z-index: 1 for content wrapper) — stacking confirmed
- Next.js 14 docs (known): `public/` directory serves files at root URL — standard Next.js static serving, unchanged since v9+

### Secondary (MEDIUM confidence)
- CSS pseudo-element z-index behavior on body: Standard CSS specification behavior; `position: relative` on body enables negative z-index children to display behind body background — consistent across modern browsers
- Safari background-attachment: fixed bug: Well-documented long-standing Safari limitation with fixed background on scroll containers — avoid it by using `position: fixed` on pseudo-element (verified by standard web dev practice)

### Tertiary (LOW confidence)
- Logo pulse timing (3.5s): Claude discretion recommendation based on the existing orb drift timings (28s, 30s, 35s) and the user's requested 3-4 second breathing cycle — specific value should be confirmed during visual verification

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already in project, no new dependencies
- Architecture: HIGH — full codebase read confirms exact current state of every file that needs changing
- Pitfalls: HIGH — identified from direct code inspection (React active class vs prop, public/ directory requirement, sidebarOpen state cleanup, z-index stacking)
- Image path: MEDIUM — user confirmed public/assets in CONTEXT.md specifics, actual file not yet present

**Research date:** 2026-02-25
**Valid until:** 2026-03-25 (stable stack — Next.js 14, Tailwind 3, Lucide — no breaking changes expected in 30 days)
