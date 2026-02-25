# Phase 6: Fix Incomplete Design Changes — Header and Nav - Research

**Researched:** 2026-02-25
**Domain:** Tailwind CSS responsive design, React state management for mobile drawer, Next.js 14 App Router
**Confidence:** HIGH

## Summary

Phase 6 is a pure front-end responsive design task with zero new dependencies required. The entire implementation uses Tailwind CSS responsive prefixes (`sm:`) already available in the project, React `useState` for drawer open/close state already used throughout the codebase, and Lucide React icons (already installed) for the hamburger (`Menu`) and close (`X`) icons.

The work is concentrated in two files: `src/app/page.tsx` (sidebar, header, dashboard overview grid) and the three view component files (`ClientCommandCenter.tsx`, `MeetingIntelligence.tsx`, `TaskMissionControl.tsx`). No new packages, no config changes, no API changes. This is a Tailwind class addition exercise — adding `sm:` prefix variants to existing class strings and introducing a `useState`-driven drawer overlay.

The primary design challenge is the hamburger drawer: it needs to feel native (full-screen overlay, dark backdrop, smooth transition) using only CSS transitions and React conditional rendering — the right approach for this stack.

**Primary recommendation:** Add `useState` for `drawerOpen` to `MissionControl` component in `page.tsx`, implement drawer as absolutely-positioned overlay div shown/hidden via conditional className, apply Tailwind `sm:` breakpoint variants throughout for all spacing/typography/layout changes.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Sidebar → Hamburger drawer**
- Below `sm` (640px), hide the sidebar entirely
- Show a hamburger menu icon on the far left of the header
- Logo orb stays visible in the header next to the hamburger icon
- Tapping hamburger opens a **full-screen overlay drawer** with dark backdrop
- Drawer contains all 4 nav items (Overview, Clients, Meetings, Tasks) plus bell and settings icons (moved from header)
- Tap backdrop or X button to close drawer

**Header compression**
- Below `sm`, header shows: hamburger icon + logo orb + search bar (smaller) + user avatar
- Bell and settings icons move into the hamburger drawer on mobile
- User name/status text hidden on mobile — just the avatar circle

**Spacing and typography**
- Tight but breathable approach — not maximum density
- Main content padding: `p-8` → `p-4` on mobile
- Welcome heading: `text-4xl` → `text-2xl` on mobile
- Card padding: `p-6` → `p-4` on mobile
- Generally reduce font sizes and spacing proportionally for mobile

**Dashboard stats grid**
- 2-column compact layout on mobile (2 cards per row)
- Smaller text and padding within stat cards
- All 4 stats visible without scrolling

**View components (Clients, Meetings, Tasks)**
- Include mobile-responsive adjustments for all 3 view components in this phase
- Tables, cards, and charts should adapt to narrow screens

### Claude's Discretion
- Drawer animation style and duration
- Exact mobile font sizes and spacing values
- How to adapt tables/charts in view components for mobile (horizontal scroll, stacking, etc.)
- Header height adjustment on mobile
- Transition/animation for layout changes

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

## Standard Stack

### Core (already installed — no new packages)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | ^3.3.0 | Responsive prefixes (`sm:`) for all mobile layout variants | Already the project's entire styling system |
| React | ^18.3.1 | `useState` for `drawerOpen` boolean state | Already used in every component |
| Lucide React | ^0.475.0 | `Menu` icon for hamburger, `X` icon for close | Already installed, icons available |
| Next.js | 14.2.35 | App Router — no changes needed | Existing framework |

### No New Packages Required

This phase requires zero new dependencies. Everything needed is already in the project:
- Tailwind `sm:` breakpoint is `640px` — matches the user decision exactly
- React `useState` manages drawer open/close
- CSS `transition` + Tailwind `translate-x` handles drawer slide animation
- Lucide's `Menu` and `X` icons are included in `lucide-react@0.475.0`

**Installation:**
```bash
# No installation needed
```

---

## Architecture Patterns

### Recommended File Structure (unchanged)

```
src/app/
├── page.tsx                          # Main layout — primary target for phase
├── globals.css                       # Add .mobile-drawer component class if needed
├── components/
│   ├── ClientCommandCenter.tsx       # Mobile responsive adjustments
│   ├── MeetingIntelligence.tsx       # Mobile responsive adjustments
│   └── TaskMissionControl.tsx        # Mobile responsive adjustments
└── layout.tsx                        # No changes needed
```

### Pattern 1: Tailwind Responsive Prefixes (Mobile-First)

**What:** Tailwind uses mobile-first breakpoints. The unprefixed class applies at all sizes; `sm:` applies at 640px and above. To target mobile only, write the mobile value first and override with `sm:`.

**When to use:** Every spacing, font size, grid column, and padding adjustment.

**Example — main content padding:**
```tsx
// Mobile: p-4, Desktop: p-8
<main className="flex-1 overflow-auto p-4 sm:p-8">
```

**Example — dashboard stats grid:**
```tsx
// Mobile: 2 columns, lg: 4 columns
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
```

**Example — welcome heading:**
```tsx
// Mobile: text-2xl, Desktop: text-4xl
<h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
```

### Pattern 2: Conditional Sidebar/Drawer with useState

**What:** The sidebar is hidden on mobile (`hidden sm:flex`) and replaced by a hamburger icon in the header. A `drawerOpen` boolean controls a full-screen overlay drawer.

**When to use:** This is the core structural change.

**Example — sidebar hide on mobile:**
```tsx
// In MissionControl component:
const [drawerOpen, setDrawerOpen] = useState(false);

// Sidebar: hidden below sm
<aside className="hidden sm:flex w-20 bg-[#1a0f00]/40 backdrop-blur-xl border-r border-amber-500/10 flex-col">
  {/* existing content unchanged */}
</aside>
```

**Example — mobile drawer overlay:**
```tsx
{/* Mobile drawer — full screen overlay */}
{drawerOpen && (
  <div className="fixed inset-0 z-50 sm:hidden">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={() => setDrawerOpen(false)}
    />
    {/* Drawer panel */}
    <div className="absolute inset-0 bg-[#1a0f00]/95 backdrop-blur-xl flex flex-col">
      {/* Close button + logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-amber-500/10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center logo-orb">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>
        <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      {/* Nav items */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeView === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => { setActiveView(tool.id); setDrawerOpen(false); }}
              className={`w-full flex items-center py-4 px-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-600/15 text-amber-400"
                  : "text-slate-400 hover:text-amber-300 hover:bg-amber-500/5"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="text-base font-medium">{tool.name}</span>
            </button>
          );
        })}
      </nav>
      {/* Bell + Settings at bottom */}
      <div className="px-4 pb-8 flex items-center space-x-4 border-t border-amber-500/10 pt-6">
        <button className="relative p-3 rounded-xl text-slate-400 hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse" />
        </button>
        <button className="p-3 rounded-xl text-slate-400 hover:bg-white/5">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
)}
```

### Pattern 3: Mobile Header Layout

**What:** On mobile the header is compressed — hamburger on left, logo orb, compact search, avatar only (no name/status). Bell/settings icons are hidden from header on mobile.

**When to use:** The header in `page.tsx`.

**Example:**
```tsx
<header className="h-16 sm:h-20 bg-[#1a0f00]/60 backdrop-blur-xl border-b border-amber-500/10 flex items-center justify-between px-4 sm:px-8">
  {/* Mobile: hamburger + logo | Desktop: search bar */}
  <div className="flex items-center sm:flex-1 sm:max-w-xl">
    {/* Hamburger — mobile only */}
    <button
      className="sm:hidden p-2 rounded-xl text-slate-400 hover:text-white mr-3"
      onClick={() => setDrawerOpen(true)}
    >
      <Menu className="w-6 h-6" />
    </button>
    {/* Logo orb — mobile only (desktop logo is in sidebar) */}
    <div className="sm:hidden w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center logo-orb mr-3">
      <Zap className="w-4 h-4 text-white" />
    </div>
    {/* Search bar */}
    <div className="relative w-full hidden sm:block">
      {/* existing search input */}
    </div>
    {/* Mobile search — smaller */}
    <div className="relative flex-1 sm:hidden">
      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full bg-[#1a0f00]/50 border border-amber-500/20 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
      />
    </div>
  </div>
  <div className="flex items-center space-x-2 sm:space-x-4">
    {/* Bell + Settings — desktop only */}
    <button className="hidden sm:block relative p-3 ...">...</button>
    <button className="hidden sm:block p-3 ...">...</button>
    {/* User section */}
    <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-amber-500/20">
      {/* Name/status — desktop only */}
      <div className="hidden sm:block text-right">
        <p className="text-sm font-medium text-slate-200">Robbie</p>
        <p className="text-xs text-slate-500">Online</p>
      </div>
      {/* Avatar */}
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs sm:text-sm font-bold text-white glow-warm">
        RJ
      </div>
    </div>
  </div>
</header>
```

### Pattern 4: View Component Mobile Adjustments

**What:** Each of the three view components has stat grids, filter bars, and content lists/cards that need responsive treatment.

**When to use:** Apply to `ClientCommandCenter.tsx`, `MeetingIntelligence.tsx`, `TaskMissionControl.tsx`.

**Standard responsive adjustments per component:**

1. **Stats grid** — all three components use `grid-cols-1 md:grid-cols-4`:
   ```tsx
   // Change to: 2-column on mobile, 4 on md
   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
   ```

2. **Component heading** — `text-3xl` → reduce on mobile:
   ```tsx
   <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
   ```

3. **Card padding** — `p-6` → `p-4` on mobile:
   ```tsx
   <div className="glass-card p-4 sm:p-6 hover-lift">
   ```

4. **ClientCommandCenter client grid** — `lg:grid-cols-2` already wraps to 1 column on mobile; no change needed. Inner content (`flex items-start justify-between`) may need wrapping on very small screens.

5. **MeetingIntelligence meeting list items** — the `flex items-start justify-between` row with icon + text + buttons will overflow on mobile. Wrap buttons below content:
   ```tsx
   // Meeting list item: stack on mobile
   <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
   ```

6. **Filter bars** — `flex items-center space-x-4` → `flex flex-wrap gap-3` for mobile:
   ```tsx
   <div className="flex flex-wrap items-center gap-3">
   ```

7. **TaskMissionControl workload grid** — `grid-cols-3` stays fine on mobile (3 small cards), but reduce padding and text sizes.

### Pattern 5: Drawer Slide Animation (Claude's Discretion)

**What:** A slide-in from the left feels native on mobile. Use CSS transition with `translate-x`.

**Recommended approach:** Slide from left over 200ms ease-out — fast enough to feel snappy, slow enough to be perceived as intentional.

```css
/* In globals.css @layer components */
.mobile-drawer-panel {
  transform: translateX(-100%);
  transition: transform 200ms ease-out;
}
.mobile-drawer-panel.open {
  transform: translateX(0);
}
```

Or with Tailwind + React state — simpler approach using conditional classes:
```tsx
<div className={`absolute inset-0 bg-[#1a0f00]/95 backdrop-blur-xl flex flex-col
  transition-transform duration-200 ease-out
  ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
```

Note: If using this animated approach, render the drawer always in DOM (not conditional on `drawerOpen`) and control visibility via `translate-x`. This prevents mount/unmount flash. Alternatively, keep the `&&` conditional approach for simplicity — the full-screen backdrop makes the instant mount non-jarring.

**Recommendation:** Use the `&&` conditional approach (simpler, already shown in Pattern 2) with a CSS opacity/fade transition on the backdrop only. The panel itself appears instantly behind the fading backdrop, which looks clean. Avoid complexity of always-mounted drawer unless user specifically asks for slide animation.

### Anti-Patterns to Avoid

- **Using `md:` breakpoint for sidebar/drawer switch**: The user explicitly chose `sm` (640px). Use `sm:` prefix consistently, not `md:`.
- **Adding new npm packages**: No Headless UI, no Radix, no Framer Motion — all of these are overkill for a single animated drawer. Pure CSS transitions handle it.
- **Modifying the sidebar content structure**: The drawer replicates sidebar navigation items — don't refactor sidebar into a shared component. Duplicate the nav items in the drawer directly; the component is simple enough.
- **Removing the `sm:hidden` from drawer**: The drawer overlay must be `sm:hidden` (hidden at 640px+) to prevent it from appearing on desktop.
- **Forgetting `overflow-hidden` on body when drawer is open**: If the page content can scroll behind the overlay, add `overflow-hidden` to body (or use `fixed` positioning for the drawer) to prevent scroll bleed-through.
- **Breaking `flex` on the outer wrapper**: The outer `<div className="min-h-screen flex">` controls the sidebar+content layout. Hiding the sidebar on mobile must not break the flex layout of the main content area.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drawer state management | Custom event bus / context | `useState` in `MissionControl` component (already there) | Single component owns layout state, no prop drilling needed |
| Hamburger icon | SVG drawn by hand | `lucide-react` `Menu` icon | Already installed, consistent with rest of codebase |
| Animated drawer | Custom JS animation | CSS `transition` + Tailwind `translate-x` | GPU-composited, no JS frame loop |
| Responsive breakpoints | Custom media queries in globals.css | Tailwind `sm:` prefix | Tailwind's purging removes unused variants; adding media queries manually creates maintenance debt |

**Key insight:** Everything needed is already present. The only new thing added is a `drawerOpen` state and a conditional JSX block. All styling is existing Tailwind utilities with `sm:` prefixes added.

---

## Common Pitfalls

### Pitfall 1: `flex` vs `hidden sm:flex` on the aside

**What goes wrong:** Writing `hidden sm:flex` on an `<aside>` that has `flex flex-col` results in Tailwind applying `flex` at all sizes (because `flex` is unprefixed) then `hidden` overrides it at mobile, but then `sm:flex` re-enables flex.

**Why it happens:** The correct pattern in Tailwind for "hidden on mobile, flex on desktop" is `hidden sm:flex` (mobile `display:none`, sm+ `display:flex`). Don't add a bare `flex` class alongside it.

**How to avoid:**
```tsx
// CORRECT
<aside className="hidden sm:flex w-20 ...">
// WRONG — bare flex conflicts
<aside className="flex hidden sm:flex w-20 ...">
```

### Pitfall 2: Drawer z-index conflict with ambient orbs

**What goes wrong:** The `layout.tsx` renders `.ambient-orbs` at `z-index: 0` and the main content wrapper at `z-index: 1`. A drawer at `z-index: 50` renders above both. But if the drawer uses `backdrop-filter`, Safari on iOS can have compositing issues with stacked backdrop-filter elements.

**Why it happens:** The existing `.glass-card` and the drawer both use `backdrop-filter: blur()`. On iOS Safari, nested backdrop-filter contexts can render incorrectly.

**How to avoid:** Use `bg-[#1a0f00]/95` (95% opacity solid-ish background) on the drawer panel instead of relying on backdrop-filter for the drawer itself. The high opacity makes the drawer opaque enough without needing backdrop-filter.

### Pitfall 3: Body scroll not blocked when drawer is open

**What goes wrong:** On iOS, a fixed overlay with `overflow: hidden` on the overlay doesn't prevent the page body from scrolling behind it (inertia scroll continues).

**Why it happens:** iOS Safari treats `-webkit-overflow-scrolling: touch` differently from other browsers.

**How to avoid:** Apply `overflow-hidden` to the `<html>` or `<body>` element when drawer is open. In Next.js App Router, this can be done with `useEffect`:
```tsx
useEffect(() => {
  if (drawerOpen) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
  return () => document.body.classList.remove('overflow-hidden');
}, [drawerOpen]);
```

### Pitfall 4: Stats grid collapsing to 1 column on mobile

**What goes wrong:** `grid-cols-1 md:grid-cols-4` on the stats cards means mobile shows 4 cards stacked vertically, requiring scroll to see all stats.

**Why it happens:** The original grid was not designed for mobile.

**How to avoid:** Change to `grid-cols-2 md:grid-cols-4` — user decision explicitly requires 2-column layout on mobile. Also reduce card padding (`p-4 sm:p-6`) and stat value font size (`text-2xl sm:text-3xl`) within cards.

### Pitfall 5: Touch targets too small

**What goes wrong:** Mobile tap targets smaller than 44px are difficult to tap accurately.

**Why it happens:** Desktop icon buttons use `p-3` with a `w-5 h-5` icon = ~44px total. On mobile, compressed spacing can drop below this threshold.

**How to avoid:** Keep button padding at minimum `p-2` on mobile with `w-5 h-5` icons = ~36px. Slightly below guideline but acceptable for a personal tool. Nav items in the drawer should use `py-4 px-4` for comfortable targets.

### Pitfall 6: `space-x-4` filter bars overflow on narrow screens

**What goes wrong:** `flex items-center space-x-4` on filter bars (both ClientCommandCenter and MeetingIntelligence) overflows on screens narrower than ~400px when the search input is `flex-1 max-w-md`.

**How to avoid:** Change to `flex flex-wrap items-center gap-3` which naturally wraps to the next line on narrow screens.

---

## Code Examples

### Mobile-first outer layout (page.tsx)
```tsx
// Outer wrapper — unchanged, flex handles layout
<div className="min-h-screen flex">
  {/* Sidebar — hidden on mobile */}
  <aside className="hidden sm:flex w-20 bg-[#1a0f00]/40 backdrop-blur-xl border-r border-amber-500/10 flex-col">
    {/* unchanged sidebar content */}
  </aside>

  {/* Main content area — takes full width on mobile */}
  <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
    {/* Header — compressed on mobile */}
    <header className="h-16 sm:h-20 ...">
      {/* hamburger (sm:hidden) + logo orb (sm:hidden) + search + avatar */}
    </header>

    {/* Content — tighter padding on mobile */}
    <main className="flex-1 overflow-auto p-4 sm:p-8">
      {/* views */}
    </main>
  </div>

  {/* Mobile drawer — sm:hidden to prevent desktop render */}
  {drawerOpen && (
    <div className="fixed inset-0 z-50 sm:hidden">
      {/* backdrop + panel */}
    </div>
  )}
</div>
```

### New imports needed in page.tsx
```tsx
// Add to existing lucide-react import
import {
  // existing...
  Menu,   // hamburger icon
  X,      // close icon
} from "lucide-react";
```

### Dashboard stats — 2-column mobile grid
```tsx
// Before:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <div className="glass-card p-6 hover-lift">
    <p className="text-3xl font-bold text-white mb-2 text-glow">{stat.value}</p>

// After:
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  <div className="glass-card p-4 sm:p-6 hover-lift">
    <p className="text-2xl sm:text-3xl font-bold text-white mb-2 text-glow">{stat.value}</p>
```

### Welcome section heading
```tsx
// Before:
<h1 className="text-4xl font-bold text-white mb-2">
// After:
<h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
```

### Meeting list item — stack on mobile
```tsx
// Before:
<div className="flex items-start justify-between">
  <div className="flex items-start space-x-4">...</div>
  <div className="flex items-center space-x-2">...</div>
</div>

// After:
<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
  <div className="flex items-start space-x-4">...</div>
  <div className="flex items-center space-x-2 sm:flex-shrink-0">...</div>
</div>
```

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| JavaScript-driven slide panels | CSS `transition` + Tailwind translate | CSS transitions are GPU-composited, no JS needed |
| Separate mobile components | Responsive Tailwind prefixes on same JSX | Reduces code duplication significantly |
| `display: none` via inline styles | Tailwind `hidden sm:flex` | Utility-first, purge-safe |

**Deprecated/outdated in this context:**
- `window.innerWidth` JS checks: Replaced by Tailwind responsive prefixes — no JS media query listeners needed
- Separate mobile layout components: Tailwind responsive design handles this at the utility layer

---

## Open Questions

1. **Drawer animation approach**
   - What we know: User wants "smooth and native-feeling"; user has discretion on animation style
   - What's unclear: Whether to use conditional render (`&&`) with instant mount or always-mounted with CSS translate
   - Recommendation: Use conditional render (`&&`) for simplicity. The dark backdrop masks any mount flash. If user feedback requests smoother, upgrade to always-mounted translate approach in a follow-up task.

2. **ClientCommandCenter — client cards on mobile**
   - What we know: Cards use `grid-cols-1 lg:grid-cols-2` — on mobile they already stack to 1 column, which is fine
   - What's unclear: Whether the inner 2-column grid (`grid-cols-2 gap-6` for revenue + health score within each card) looks good on very narrow screens
   - Recommendation: Change inner grid to `grid-cols-1 sm:grid-cols-2` within each client card, or reduce gap to `gap-4`. The `grid-cols-2` with two narrow cells might get tight on 320px screens.

3. **MeetingIntelligence — attendee/meta row**
   - What we know: The `flex items-center space-x-6` row showing date, duration, attendee count may overflow on small screens
   - What's unclear: Whether to wrap or truncate
   - Recommendation: Change `space-x-6` to `flex-wrap gap-x-4 gap-y-1` to allow wrapping on narrow screens.

---

## Sources

### Primary (HIGH confidence)
- Tailwind CSS official docs — responsive design with `sm:` breakpoint (640px confirmed)
- React `useState` hook — standard pattern, well-established in codebase
- Lucide React v0.475.0 — `Menu` and `X` icons verified available in this version

### Secondary (MEDIUM confidence)
- iOS Safari backdrop-filter stacking pitfall — widely documented in CSS community
- Body scroll lock on iOS Safari — documented browser behavior

### Tertiary (LOW confidence)
- Specific px sizes for comfortable touch targets on mobile — approximated from general guidance, not project-specific validation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — entire implementation uses existing project dependencies
- Architecture: HIGH — patterns derived directly from codebase inspection of `page.tsx` and component files
- Pitfalls: MEDIUM — iOS Safari behavior pitfalls are widely documented; drawer z-index issue verified by inspecting existing `globals.css` z-index values

**Research date:** 2026-02-25
**Valid until:** 2026-03-25 (stable stack, 30-day validity)
