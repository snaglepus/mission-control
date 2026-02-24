# Requirements: Mission Control — UI Redesign

**Defined:** 2026-02-24
**Core Value:** The dashboard must remain fully functional while transforming the visual identity to warm amber/gold glassmorphism

## v1 Requirements

Requirements for the warm glassmorphism redesign. Each maps to roadmap phases.

### Color Foundation

- [x] **FNDTN-01**: CSS custom properties defined for amber, gold, copper, and orange accent colors in `:root`
- [x] **FNDTN-02**: Background gradient shifted from navy-indigo to deep-brown/dark-amber (`#1a0f00 → #2d1a06 → #1f1208`)
- [x] **FNDTN-03**: Backdrop filter includes `saturate(140%)` alongside `blur(12px)` for warm glass effect
- [ ] **FNDTN-04**: 2-3 ambient radial gradient orbs positioned behind UI for atmospheric depth

### Glass Card System

- [ ] **GLASS-01**: Card backgrounds use warm-tinted transparency (`rgba(30, 16, 4, 0.65)`)
- [ ] **GLASS-02**: Card borders use amber translucent color (`rgba(251, 191, 36, 0.2)`) with warmer hover state
- [ ] **GLASS-03**: Card hover glow uses amber shadow instead of indigo
- [ ] **GLASS-04**: Inset gold highlight on card top edge simulating light on glass
- [ ] **GLASS-05**: Hover-lift shadow uses warm amber bloom instead of neutral black

### Typography & Accents

- [ ] **TYPO-01**: Gradient text headings use amber → gold → copper spectrum
- [ ] **TYPO-02**: All ~105 inline cyan/purple/pink Tailwind classes replaced with amber/gold/orange equivalents
- [ ] **TYPO-03**: Dividers and borders shifted from indigo tint to amber tint throughout
- [ ] **TYPO-04**: Text glow utility uses warm amber shadow on stat values

### Sidebar & Navigation

- [ ] **SIDE-01**: Sidebar active state uses amber/orange gradient colors and indicator bar
- [ ] **SIDE-02**: Logo orb uses amber-to-orange gradient with warm glow
- [ ] **SIDE-03**: Sidebar restructured to slim icon-above-label format with centered layout

### View Components

- [ ] **COMP-01**: All hardcoded cool-color Tailwind classes replaced in ClientCommandCenter.tsx
- [ ] **COMP-02**: All hardcoded cool-color Tailwind classes replaced in MeetingIntelligence.tsx
- [ ] **COMP-03**: All hardcoded cool-color Tailwind classes replaced in TaskMissionControl.tsx
- [ ] **COMP-04**: Status indicators preserve semantic green/red while surrounding UI uses warm palette
- [ ] **COMP-05**: Recharts chart fills and strokes updated to amber/orange/gold warm colors

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Premium Animations

- **ANIM-01**: CSS animated gradient border on active sidebar item (slow 3s rotation)
- **ANIM-02**: Gold shimmer sweep on quick action card CTA hover

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Photo/video background | Performance cost, degrades glassmorphism readability |
| Animated background gradient | GPU idle prevention issues, battery drain |
| Blur above 15px | Exponentially GPU-expensive, 12px is optimal |
| Mouse-tracking glow effect | Hundreds of repaints/sec at dashboard scale |
| Glassmorphism on search input | Stacked backdrop-filters cause performance issues |
| New features or views | This is styling only — no functional changes |
| Tech stack changes | Keeping Next.js, Tailwind, Lucide, Recharts |
| Mobile-specific redesign | Maintain existing responsive behavior |
| Replacing semantic green/red status colors | Destroys meaning — status must communicate at a glance |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FNDTN-01 | Phase 1 | Complete |
| FNDTN-02 | Phase 1 | Complete |
| FNDTN-03 | Phase 1 | Complete |
| FNDTN-04 | Phase 1 | Pending |
| GLASS-01 | Phase 2 | Pending |
| GLASS-02 | Phase 2 | Pending |
| GLASS-03 | Phase 2 | Pending |
| GLASS-04 | Phase 2 | Pending |
| GLASS-05 | Phase 2 | Pending |
| TYPO-01 | Phase 3 | Pending |
| TYPO-02 | Phase 3 | Pending |
| TYPO-03 | Phase 3 | Pending |
| TYPO-04 | Phase 3 | Pending |
| SIDE-01 | Phase 5 | Pending |
| SIDE-02 | Phase 5 | Pending |
| SIDE-03 | Phase 5 | Pending |
| COMP-01 | Phase 4 | Pending |
| COMP-02 | Phase 4 | Pending |
| COMP-03 | Phase 4 | Pending |
| COMP-04 | Phase 4 | Pending |
| COMP-05 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0

---
*Requirements defined: 2026-02-24*
*Last updated: 2026-02-24 after roadmap creation — traceability complete*
