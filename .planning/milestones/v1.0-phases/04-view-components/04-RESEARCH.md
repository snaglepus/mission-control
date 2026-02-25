# Phase 4: View Components - Research

**Researched:** 2026-02-25
**Domain:** Tailwind CSS inline class substitution — warm amber/orange palette conversion across three React component files
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Two-tone accent system**
- Primary accent (replacing cyan): amber-400/500 — rich golden amber for data icons, interactive text, buttons, hover states
- Secondary accent (replacing purple): orange-400/500 — deeper burnished warmth for AI-related elements, time/duration info, secondary stats
- Accent gradients (replacing cyan-to-purple): from-amber-500 to-orange-500 — smooth warm transition for icon backgrounds, decorative elements
- Preserve multi-tone: anywhere two cool colors distinguished categories, use two distinct warm colors (amber + orange)

**Semantic status gradients**
- Active/healthy: green preserved as-is (from-emerald-500 to-green-500) — no change
- At-risk/danger: from-red-500 to-orange-500 — replace pink with orange, stays warm while reading as danger
- Prospective/pending: from-yellow-500 to-amber-500 — warm neutral replacing blue-to-cyan
- Traffic light progression: green / yellow-amber / red-orange — distinct at a glance
- Decorative purple-to-pink gradients: replaced with amber-to-orange (non-semantic follows standard warm mapping)

**Interactive element warmth**
- CTA buttons: from-amber-500 to-amber-600 with shadow-amber-500/30 — consistent with Phase 3
- Icon accent colors: amber-400 for primary icons (Filter, Search, Clock, CheckSquare), orange-400 for secondary icons (AI, time, Activity)
- Hover text: group-hover:text-amber-400 across all interactive text (client names, task text, meeting titles)
- Checkbox borders: hover:border-amber-500 hover:bg-amber-500/20
- Hover card borders: hover:border-amber-500/30

**Detail panel styling**
- Dividers and borders: border-amber-500/10 replacing border-indigo-500/10 — warm but subtle structural lines
- Panel header icon: standard amber-to-orange gradient (from-amber-500 to-orange-600) — consistency over special treatment
- Panel interactive items: hover:border-amber-500/30 — same pattern as list items
- Decorative bullet dots: from-amber-400 to-orange-500 — small gradient dots for AI insight lists

### Claude's Discretion
- Exact shadow spread and opacity values for button glows
- Transition timing for hover states (following Phase 3's ~150-200ms ease)
- Any edge cases where amber-400 vs amber-500 shade selection matters
- Loading spinner color (currently cyan-400)
- Specific shade choices within the amber/orange spectrum for elements not explicitly discussed

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| COMP-01 | All hardcoded cool-color Tailwind classes replaced in ClientCommandCenter.tsx | Full class-by-class substitution map documented below; 18 lines affected |
| COMP-02 | All hardcoded cool-color Tailwind classes replaced in MeetingIntelligence.tsx | Full class-by-class substitution map documented below; 23 lines affected |
| COMP-03 | All hardcoded cool-color Tailwind classes replaced in TaskMissionControl.tsx | Full class-by-class substitution map documented below; 19 lines affected |
| COMP-04 | Status indicators preserve semantic green/red while surrounding UI uses warm palette | getStatusColor() and getHealthColor() functions audited — existing amber/emerald/red returns already correct; only pink→orange substitution needed in gradient map |
| COMP-05 | Recharts chart fills and strokes updated to amber/orange/gold warm colors | CONFIRMED NOT APPLICABLE — no Recharts usage exists in any of the three files; requirement is satisfied by its absence |
</phase_requirements>

---

## Summary

Phase 4 is a pure inline Tailwind class substitution exercise across three React component files. No new packages are needed, no architectural changes required — only string replacements following a deterministic mapping from cool (cyan/purple/pink/indigo/blue) to warm (amber/orange). The pattern is identical to Phase 3's page.tsx conversion, which is already proven and approved.

The three target files contain a combined 60 lines carrying cool-color Tailwind references. The dominant patterns are: `text-cyan-400` (19 occurrences total), `from-cyan-500`/`to-cyan-600` CTA button gradients (9 occurrences), `border-indigo-500/10` structural dividers (7 occurrences), and `from-purple-500 to-pink-500` decorative icon backgrounds (3 occurrences). Every pattern maps cleanly to an already-decided warm equivalent from the CONTEXT.md locked decisions.

COMP-05 (Recharts chart colors) is confirmed NOT APPLICABLE. No Recharts import or usage exists in any of the three component files. The requirement is automatically satisfied and requires no implementation work.

**Primary recommendation:** Execute as a single plan with three sequential tasks (one file per task) plus a grep verification task. Each file is small (~350 lines) and fully self-contained; no cross-file dependencies between components.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | v3 (already installed) | Utility class styling | Already the project's sole styling mechanism — no additions needed |
| React/Next.js | Already installed | Component framework | No version changes; this is CSS string replacement only |

### Supporting
No additional packages needed. This phase uses zero new libraries.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline class substitution | CSS custom property overrides | Custom props require globals.css changes and may not reach all Tailwind utility patterns — direct substitution is simpler and already proven in Phase 3 |
| Manual editing | Automated sed/replace | Automated replace risks touching non-Tailwind strings; manual substitution (guided by the map below) is safe at this file size |

**Installation:**
```bash
# No installation required — no new dependencies
```

---

## Architecture Patterns

### Recommended Project Structure
No structural changes. Files remain at their existing locations:
```
src/app/components/
├── ClientCommandCenter.tsx   # ~367 lines — 18 lines with cool colors
├── MeetingIntelligence.tsx   # ~391 lines — 23 lines with cool colors
└── TaskMissionControl.tsx    # ~367 lines — 19 lines with cool colors
```

### Pattern 1: Direct Inline Class String Substitution
**What:** Replace cool-color Tailwind utility strings in JSX className values one-for-one with warm equivalents. No refactoring, no new abstractions.
**When to use:** All occurrences in this phase. The files are small enough that exhaustive manual substitution per the map below is the correct approach.
**Example (established in Phase 3, page.tsx):**
```tsx
// BEFORE (cool)
<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">

// AFTER (warm) — applying locked decision: primary icon gradient
<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
```

### Pattern 2: TypeScript Color Map Update (getProjectStyle)
**What:** TaskMissionControl contains a `getProjectStyle()` function that returns Tailwind color class strings. The `"day"` case returns `"text-purple-400"` — this is TypeScript logic, not a JSX class directly, but must be updated.
**When to use:** Any time cool colors appear inside switch/case string returns.
**Example:**
```tsx
// BEFORE
case "day": return "text-purple-400";

// AFTER — orange-400 for secondary/time-related element per locked decision
case "day": return "text-orange-400";
```

### Pattern 3: Status Gradient Conditional
**What:** Both ClientCommandCenter and MeetingIntelligence compute avatar icon gradients conditionally in JSX based on status. The at-risk path contains `from-red-500 to-pink-500` — pink must become orange per locked decision.
**When to use:** Any conditional className expression containing cool colors.
**Example:**
```tsx
// BEFORE
client.status === "at-risk" ? "bg-gradient-to-br from-red-500 to-pink-500" :

// AFTER — locked decision: at-risk/danger = from-red-500 to-orange-500
client.status === "at-risk" ? "bg-gradient-to-br from-red-500 to-orange-500" :
```

### Pattern 4: P3 Priority Style (getPriorityStyle — TaskMissionControl only)
**What:** The `getPriorityStyle()` function in TaskMissionControl has a P3 case using `from-blue-500 to-cyan-500 border-blue-500/50`. P3 is "medium-low" priority — not semantically critical. The warm equivalent should differentiate from P1 (red) and P2 (amber-orange).
**When to use:** This is a Claude's Discretion case per CONTEXT.md.
**Recommendation:** Use `from-amber-400 to-amber-500 border-amber-400/50` (lighter amber to distinguish from P2's `from-amber-500 to-orange-500`). This preserves visual hierarchy while staying warm.

### Anti-Patterns to Avoid
- **Changing semantic green/red:** emerald-500, teal-500, red-400, red-500 references in status/health indicators must NOT be touched — COMP-04 explicitly requires preservation
- **Touching non-color Tailwind classes:** rounded-xl, flex, items-center, shadow-lg etc. are not part of this phase and must not be altered
- **Changing functional logic:** getStatusColor(), getHealthColor(), getPriorityStyle() function signatures and return structures stay unchanged — only the color string values inside them are updated
- **Over-mapping:** Do not force every amber instance to be amber-500. The locked decisions specify per-use-case shades (amber-400 for icons, amber-500 for gradients)

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Verifying zero cool-color residuals | Custom verification script | `grep -n "cyan\|purple\|pink\|indigo" src/app/components/ComponentName.tsx` | Already proven as the verification command in Phases 1-3; zero-result grep IS the success gate |
| Color palette decisions | Per-element judgment calls | The substitution map below | All decisions are locked in CONTEXT.md; following the map produces correct results without re-deciding |

**Key insight:** This phase is solved by a substitution map, not design judgment. All decisions were made in the /gsd:discuss-phase session. The executor's job is accurate application of the map, not creative color selection.

---

## Common Pitfalls

### Pitfall 1: Missing the `border-indigo-500/10` Dividers
**What goes wrong:** The structural dividers (`border-t border-indigo-500/10`, `divide-y divide-indigo-500/10`) are easy to miss because "indigo" doesn't read as "accent color" — it reads as a structural element. There are 7 of these across the three files.
**Why it happens:** Grep for `cyan\|purple\|pink` passes; grep misses `indigo` if the tester forgets it's in the pattern.
**How to avoid:** The success criterion explicitly includes `indigo` in the grep pattern: `grep -n "cyan\|purple\|pink\|indigo"`. Run this exact command as the verification step.
**Warning signs:** After substitution, if the modal panels still show a faint cool-tinted divider, this pitfall has been hit.

### Pitfall 2: Leaving Hover State Cool Colors Orphaned
**What goes wrong:** A CTA button's base classes are converted (`from-cyan-500 to-cyan-600 shadow-cyan-500/30`) but the hover states (`hover:from-cyan-400 hover:to-cyan-500 hover:shadow-cyan-500/50`) are missed. The button looks warm at rest but flashes cyan on hover.
**Why it happens:** The hover classes appear on the same line but may be glossed over when scanning.
**How to avoid:** The substitution map below lists hover variants explicitly. Process each line in its entirety rather than scanning for just the base color name.
**Warning signs:** The post-substitution grep will catch these — `hover:from-cyan-400` will still match `cyan`.

### Pitfall 3: Breaking the At-Risk Avatar Logic (ClientCommandCenter)
**What goes wrong:** The conditional avatar gradient `from-red-500 to-pink-500` is changed incorrectly, losing the red base, and the card appears wrong for at-risk clients.
**Why it happens:** It might seem like the whole gradient needs warm conversion, but the locked decision is `from-red-500 to-orange-500` — red-500 is PRESERVED as the start because red is semantically correct for danger.
**How to avoid:** The map below makes this explicit. Only `to-pink-500` → `to-orange-500`; leave `from-red-500` unchanged.
**Warning signs:** At-risk client cards look fully orange/amber rather than red-leaning.

### Pitfall 4: COMP-05 "Chart Colors" Wasting Time
**What goes wrong:** An executor searches for Recharts color props, finds nothing, and questions whether the audit was missed.
**Why it happens:** REQUIREMENTS.md and ROADMAP.md both mention COMP-05 as part of Phase 4 scope.
**How to avoid:** COMP-05 is explicitly confirmed inapplicable in CONTEXT.md: "COMP-05 (Recharts chart colors) does not apply — no Recharts usage exists in the codebase." No Recharts import exists in any of the three component files. Skip and mark satisfied.

### Pitfall 5: P3 Priority Blue Creating a Contrast Issue
**What goes wrong:** If P3 is mapped to a light amber shade (e.g., amber-300), it may fail contrast against white text or the glass card background.
**Why it happens:** The existing P3 uses blue-500/cyan-500 which is naturally saturated; lighter amber shades can be too pale.
**How to avoid:** Use `from-amber-400 to-amber-500` (not amber-200/300) to maintain sufficient contrast. The executor can verify in DevTools.

---

## Code Examples

Verified substitution map based on direct source audit:

### Master Substitution Map (applies across all three files)

```
COOL CLASS                          → WARM REPLACEMENT
─────────────────────────────────────────────────────────────────────────────
CTA Buttons (primary action)
  from-cyan-500                     → from-amber-500
  to-cyan-600                       → to-amber-600
  hover:from-cyan-400               → hover:from-amber-400
  hover:to-cyan-500                 → hover:to-amber-500
  shadow-cyan-500/30                → shadow-amber-500/30
  hover:shadow-cyan-500/50          → hover:shadow-amber-500/50

Icon container gradients (primary/data)
  bg-gradient-to-br from-cyan-500 to-cyan-600   → from-amber-500 to-orange-500
  shadow-lg shadow-cyan-500/30                   → shadow-lg shadow-amber-500/30

Icon container gradients (secondary/AI)
  bg-gradient-to-br from-purple-500 to-pink-500  → from-amber-500 to-orange-500
  shadow-lg shadow-purple-500/30                 → shadow-lg shadow-amber-500/30

Detail panel header icon (modal header)
  bg-gradient-to-br from-cyan-500 to-purple-600  → from-amber-500 to-orange-600

Hover text on interactive items
  group-hover:text-cyan-400          → group-hover:text-amber-400
  hover:text-cyan-400                → hover:text-amber-400

Icon accent colors (primary — Filter, Search, Clock, Calendar)
  text-cyan-400                      → text-amber-400

Icon accent colors (secondary — AI/time/Activity elements)
  text-purple-400                    → text-orange-400

Structural dividers and borders
  border-indigo-500/10               → border-amber-500/10
  divide-indigo-500/10               → divide-amber-500/10

Deliverable count "more" link
  text-cyan-400 (inline +N more)     → text-amber-400

Checkbox hover state
  hover:border-cyan-500              → hover:border-amber-500
  hover:bg-cyan-500/20               → hover:bg-amber-500/20

Deliverable item hover border
  hover:border-cyan-500/30           → hover:border-amber-500/30
  bg-cyan-500/20                     → bg-amber-500/20
  group-hover:bg-cyan-500/30         → group-hover:bg-amber-500/30
  text-cyan-400 (CheckCircle2 icon)  → text-amber-400

Status-conditional avatar: at-risk
  to-pink-500 (in "at-risk" branch)  → to-orange-500   [keep from-red-500]

Decorative bullet dot (key insights)
  from-cyan-400 to-purple-500        → from-amber-400 to-orange-500

Loading spinner
  text-cyan-400 (Loader2)            → text-amber-400

Refresh button hover
  hover:text-cyan-400                → hover:text-amber-400

External link hover
  hover:text-cyan-400                → hover:text-amber-400

TaskMissionControl getProjectStyle() — "day" case
  text-purple-400                    → text-orange-400

TaskMissionControl getPriorityStyle() — P3 case
  from-blue-500 to-cyan-500 border-blue-500/50   → from-amber-400 to-amber-500 border-amber-400/50
```

### Status Indicators Already Correct (DO NOT CHANGE)
```tsx
// getStatusColor() in ClientCommandCenter — already warm or semantic-correct:
case "active":     "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"  // ✅ keep
case "at-risk":    "bg-red-500/20 text-red-400 border-red-500/30"               // ✅ keep
case "prospective":"bg-amber-500/20 text-amber-400 border-amber-500/30"         // ✅ keep (already warm)
case "completing": "bg-slate-500/20 text-slate-400 border-slate-500/30"         // ✅ keep

// getHealthColor() — already warm or semantic-correct:
if health >= 80: "bg-emerald-500"    // ✅ keep
if health >= 60: "bg-amber-500"      // ✅ keep (already warm)
else:            "bg-red-500"        // ✅ keep
```

### Exact Lines Requiring Changes Per File

**ClientCommandCenter.tsx (18 affected lines → 17 substitutions):**
```
L143: CTA button — from-cyan-500 to-cyan-600 shadow-cyan-500/30 (hover states too)
L153: Active clients icon — from-cyan-500 to-cyan-600 shadow-cyan-500/30
L167: Weekly revenue icon — from-purple-500 to-pink-500 shadow-purple-500/30
L205: Filter icon — text-cyan-400
L218: Search icon — text-cyan-400
L239: At-risk avatar — to-pink-500 (keep from-red-500)
L246: Client name hover — group-hover:text-cyan-400
L279: Card bottom border — border-indigo-500/10
L281: Clock icon — text-cyan-400
L286: FileText icon — text-purple-400
L290: "+N more" span — text-cyan-400
L304: Modal header border — border-indigo-500/10
L306: Modal header icon — from-cyan-500 to-purple-600
L339: Briefcase icon — text-cyan-400
L344: Deliverable hover border — hover:border-cyan-500/30
L345: Deliverable icon bg — bg-cyan-500/20 group-hover:bg-cyan-500/30
L346: CheckCircle2 icon — text-cyan-400
L356: Activity icon — text-purple-400
```

**MeetingIntelligence.tsx (23 affected lines → 23 substitutions):**
```
L89:  Loader2 spinner — text-cyan-400
L102: Refresh button hover — hover:text-cyan-400
L112: Meetings stat icon — from-cyan-500 to-cyan-600 shadow-cyan-500/30
L148: AI Processed icon — from-purple-500 to-pink-500 shadow-purple-500/30
L151: AI badge — text-purple-400
L161: Filter icon — text-cyan-400
L173: Search icon — text-cyan-400
L200: Meeting title hover — group-hover:text-cyan-400
L212: Calendar icon — text-cyan-400
L216: Clock icon — text-purple-400
L229: "View" CTA button — from-cyan-500 to-cyan-600 shadow-cyan-500/30 (hover states too)
L237: External link hover — hover:text-cyan-400
L246: Meeting card border — border-indigo-500/10
L254: Action items CheckSquare — text-cyan-400
L276: Modal header border — border-indigo-500/10
L278: Modal header icon — from-cyan-500 to-purple-600
L298: Calendar meta icon — text-cyan-400
L302: Clock meta icon — text-purple-400
L314: AI Summary Sparkles — text-cyan-400
L324: Key Insights Sparkles — text-purple-400
L330: Bullet dot — from-cyan-400 to-purple-500
L373: Transcript section border — border-indigo-500/10
L379: Transcript CTA — from-cyan-500 to-cyan-600 shadow-cyan-500/30 (hover states too)
```

**TaskMissionControl.tsx (19 affected lines → 20 substitutions):**
```
L69:  getPriorityStyle P3 — from-blue-500 to-cyan-500 border-blue-500/50
L79:  getProjectStyle "day" — text-purple-400
L118: Loader2 spinner — text-cyan-400
L132: Refresh button hover — hover:text-cyan-400
L136: Add Task CTA — from-cyan-500 to-cyan-600 shadow-cyan-500/30 (hover states too)
L147: Active Tasks icon — from-cyan-500 to-cyan-600 shadow-cyan-500/30
L158: P1 Priority icon — from-red-500 to-pink-500 (keep red, change to-pink)
L193: Zap icon (Daily Workload) — text-cyan-400
L214: Day Tasks icon — from-purple-500 to-pink-500 shadow-purple-500/30
L235: Filter icon — text-cyan-400
L248: Clock4 icon — text-cyan-400
L261: Search icon — text-cyan-400
L272: Tasks header border — border-indigo-500/10
L274: CheckSquare header icon — text-cyan-400
L279: Task list divider — divide-indigo-500/10
L283: Checkbox hover — hover:border-cyan-500 hover:bg-cyan-500/20
L287: Task text hover — group-hover:text-cyan-400
L344: Completed header border — border-indigo-500/10
L350: Completed divider — divide-indigo-500/10
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Cool neon palette (cyan/purple/pink) | Warm amber/orange palette | This phase | View components complete the warm conversion started in Phases 1-3 |
| Recharts assumed to be present | No Recharts in codebase | CONTEXT.md confirms | COMP-05 requires no work |

**Deprecated/outdated:**
- COMP-05 chart colors: Roadmap listed Recharts work; confirmed inapplicable — no charts exist in the three target files.

---

## Open Questions

1. **Loading spinner (Loader2) color assignment**
   - What we know: Currently `text-cyan-400` in both MeetingIntelligence and TaskMissionControl
   - What's unclear: CONTEXT.md's discretion section lists spinner color as Claude's decision
   - Recommendation: Use `text-amber-400` — consistent with primary icon accent color; spinners are data-loading indicators which fit the primary accent role

2. **P3 Priority contrast on glass card**
   - What we know: P3 currently uses blue/cyan which reads as "low-medium" — lighter than P1 red and P2 amber-orange
   - What's unclear: Whether `from-amber-400 to-amber-500` will be visually distinct enough from P2's `from-amber-500 to-orange-500` in white-text badge form
   - Recommendation: Use `from-amber-400 to-amber-500` (lighter amber center vs P2's amber-to-orange) and verify visually; if insufficient distinction, consider `from-yellow-500 to-amber-400` for a lighter warm tone

---

## Validation Architecture

> `workflow.nyquist_validation` is not set in `.planning/config.json` — field is absent, treating as false. Skipping Validation Architecture section.

*(Note: config.json has `workflow.research`, `workflow.plan_check`, `workflow.verifier` — no `nyquist_validation` key.)*

---

## Sources

### Primary (HIGH confidence)
- Direct source audit: `/src/app/components/ClientCommandCenter.tsx` — full file read, all 367 lines
- Direct source audit: `/src/app/components/MeetingIntelligence.tsx` — full file read, all 391 lines
- Direct source audit: `/src/app/components/TaskMissionControl.tsx` — full file read, all 367 lines
- Direct source audit: `/src/app/globals.css` — warm utility classes confirmed in Phase 3
- Direct source audit: `/src/app/page.tsx` — Phase 3 substitution patterns confirmed
- `.planning/phases/03-typography-page-frame/03-01-SUMMARY.md` — confirmed substitution pattern effectiveness and Phase 3 decisions
- `.planning/phases/04-view-components/04-CONTEXT.md` — locked decisions source of truth

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — accumulated project decisions used to cross-check color choices
- `.planning/REQUIREMENTS.md` — requirement traceability confirmed

### Tertiary (LOW confidence)
- None required — all findings are based on direct code inspection, no web research needed for this domain

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages; existing Tailwind v3 confirmed in use
- Architecture: HIGH — substitution map derived from direct file audit; zero inference
- Pitfalls: HIGH — identified from actual source code patterns, not hypothetical scenarios
- COMP-05 status: HIGH — confirmed via grep; no Recharts import in any target file

**Research date:** 2026-02-25
**Valid until:** Until any of the three component files are modified outside this phase (stable — pure CSS strings, no API surface)
