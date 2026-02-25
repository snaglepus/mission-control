# Phase 4: View Components - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace all ~60 inline cool-color Tailwind classes across ClientCommandCenter.tsx, MeetingIntelligence.tsx, and TaskMissionControl.tsx with warm equivalents. Update status indicator gradients to warm palette while preserving semantic clarity. No functional changes, no new components — CSS class substitutions only.

Note: COMP-05 (Recharts chart colors) does not apply — no Recharts usage exists in the codebase.

</domain>

<decisions>
## Implementation Decisions

### Two-tone accent system
- **Primary accent (replacing cyan):** amber-400/500 — rich golden amber for data icons, interactive text, buttons, hover states
- **Secondary accent (replacing purple):** orange-400/500 — deeper burnished warmth for AI-related elements, time/duration info, secondary stats
- **Accent gradients (replacing cyan-to-purple):** from-amber-500 to-orange-500 — smooth warm transition for icon backgrounds, decorative elements
- Preserve multi-tone: anywhere two cool colors distinguished categories, use two distinct warm colors (amber + orange)

### Semantic status gradients
- **Active/healthy:** green preserved as-is (from-emerald-500 to-green-500) — no change
- **At-risk/danger:** from-red-500 to-orange-500 — replace pink with orange, stays warm while reading as danger
- **Prospective/pending:** from-yellow-500 to-amber-500 — warm neutral replacing blue-to-cyan
- Traffic light progression: green / yellow-amber / red-orange — distinct at a glance
- **Decorative purple-to-pink gradients:** replaced with amber-to-orange (non-semantic follows standard warm mapping)

### Interactive element warmth
- **CTA buttons:** from-amber-500 to-amber-600 with shadow-amber-500/30 — consistent with Phase 3
- **Icon accent colors:** amber-400 for primary icons (Filter, Search, Clock, CheckSquare), orange-400 for secondary icons (AI, time, Activity)
- **Hover text:** group-hover:text-amber-400 across all interactive text (client names, task text, meeting titles)
- **Checkbox borders:** hover:border-amber-500 hover:bg-amber-500/20
- **Hover card borders:** hover:border-amber-500/30

### Detail panel styling
- **Dividers and borders:** border-amber-500/10 replacing border-indigo-500/10 — warm but subtle structural lines
- **Panel header icon:** standard amber-to-orange gradient (from-amber-500 to-orange-600) — consistency over special treatment
- **Panel interactive items:** hover:border-amber-500/30 — same pattern as list items
- **Decorative bullet dots:** from-amber-400 to-orange-500 — small gradient dots for AI insight lists

### Claude's Discretion
- Exact shadow spread and opacity values for button glows
- Transition timing for hover states (following Phase 3's ~150-200ms ease)
- Any edge cases where amber-400 vs amber-500 shade selection matters
- Loading spinner color (currently cyan-400)
- Specific shade choices within the amber/orange spectrum for elements not explicitly discussed

</decisions>

<specifics>
## Specific Ideas

- Carry forward Phase 3's "redesigned warmth" philosophy — pick warm colors by visual intent, not shade-for-shade mapping
- The two-tone system (amber + orange) should feel like a cohesive warm palette, not two random warm colors — golden and burnished working together
- Status colors should read instantly: green=good, yellow-amber=pending, red-orange=danger — traffic light intuition
- Consistency across all three components is more important than per-component customization

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-view-components*
*Context gathered: 2026-02-25*
