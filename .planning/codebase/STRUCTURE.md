# Codebase Structure

**Analysis Date:** 2026-02-24

## Directory Layout

```
mission-control/
├── src/
│   └── app/
│       ├── api/                          # API route handlers
│       │   ├── fireflies/
│       │   │   └── route.ts              # Fireflies API integration
│       │   └── todoist/
│       │       └── route.ts              # Todoist API integration
│       ├── components/                   # React components
│       │   ├── ClientCommandCenter.tsx   # Clients view component
│       │   ├── MeetingIntelligence.tsx   # Meetings view component
│       │   └── TaskMissionControl.tsx    # Tasks view component
│       ├── hooks/                        # Custom React hooks
│       │   └── useRealtimeData.ts        # Generic polling hook + specialized hooks
│       ├── fonts/                        # Font files
│       ├── globals.css                   # Global styles and design tokens
│       ├── layout.tsx                    # Root layout component
│       └── page.tsx                      # Main entry point (dashboard)
├── public/                               # Static assets
├── .next/                                # Next.js build output
├── node_modules/                         # Dependencies
├── .env.local                            # Environment variables (local)
├── .env.local.example                    # Environment variable template
├── .eslintrc.json                        # ESLint configuration
├── package.json                          # Project metadata and dependencies
├── tsconfig.json                         # TypeScript configuration
├── tailwind.config.ts                    # Tailwind CSS configuration
├── next.config.mjs                       # Next.js configuration
├── postcss.config.mjs                    # PostCSS configuration (for Tailwind)
└── README.md                             # Project documentation
```

## Directory Purposes

**src/app/api/**
- Purpose: Backend API routes that integrate with external services
- Contains: Next.js API route handlers (.ts files exporting GET/POST methods)
- Key files:
  - `src/app/api/fireflies/route.ts`: Queries Fireflies GraphQL API for meetings
  - `src/app/api/todoist/route.ts`: Queries Todoist REST API for tasks

**src/app/components/**
- Purpose: Reusable React components for different dashboard views
- Contains: Client-side components using useState, rendering UI with Lucide icons
- Key files:
  - `src/app/components/ClientCommandCenter.tsx`: Displays client list with filtering
  - `src/app/components/MeetingIntelligence.tsx`: Shows Fireflies meetings with modal detail view
  - `src/app/components/TaskMissionControl.tsx`: Displays Todoist tasks with workload overview

**src/app/hooks/**
- Purpose: Custom React hooks for data fetching and state management
- Contains: Generic useRealtimeData hook and specialized variants
- Key files:
  - `src/app/hooks/useRealtimeData.ts`: Generic hook with polling, TypeScript response types

**src/app/**
- Purpose: App Router configuration and entry points
- Key files:
  - `src/app/page.tsx`: Main dashboard component with sidebar navigation, view routing
  - `src/app/layout.tsx`: Root HTML layout, metadata, global fonts
  - `src/app/globals.css`: Global styles, CSS variables, design system utilities

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Main React component rendering dashboard layout and orchestrating views
- `src/app/layout.tsx`: Next.js root layout wrapping all pages
- `src/app/api/fireflies/route.ts`: Fireflies data endpoint
- `src/app/api/todoist/route.ts`: Todoist data endpoint

**Configuration:**
- `tsconfig.json`: TypeScript strict mode, path aliases (`@/*` maps to `src/*`)
- `next.config.mjs`: Next.js build configuration (minimal)
- `tailwind.config.ts`: Tailwind CSS content scanning and theme extension
- `postcss.config.mjs`: PostCSS with Tailwind plugin for CSS generation
- `.eslintrc.json`: ESLint config (extends Next.js recommended rules)

**Core Logic:**
- `src/app/hooks/useRealtimeData.ts`: Data synchronization with 30-second polling intervals
- `src/app/api/fireflies/route.ts`: Fireflies GraphQL query, data transformation (meeting extraction)
- `src/app/api/todoist/route.ts`: Todoist REST API call, project mapping, task transformation

**Testing:**
- No test files currently in repository

**Styling:**
- `src/app/globals.css`: Design tokens (CSS variables), glassmorphism utilities, animations
- Tailwind CSS applied inline via className attributes in components

## Naming Conventions

**Files:**
- React components: PascalCase with .tsx (e.g., `ClientCommandCenter.tsx`)
- Hooks: camelCase with .ts, prefixed with "use" (e.g., `useRealtimeData.ts`)
- API routes: `route.ts` (Next.js convention)
- Styles: `globals.css` for global, co-located with components

**Directories:**
- Component directory: lowercase plural (e.g., `components/`, `hooks/`)
- Feature directories: lowercase (e.g., `api/`)
- Nested API routes: feature name (e.g., `api/fireflies/`, `api/todoist/`)

**Variables:**
- React component state: camelCase (e.g., `activeView`, `selectedClient`)
- TypeScript types/interfaces: PascalCase (e.g., `Client`, `Meeting`, `Task`)
- Constants: UPPER_SNAKE_CASE (e.g., `FIREFLIES_API_KEY`, `TODOIST_API_TOKEN`)
- CSS classes: lowercase with hyphens (e.g., `.glass-card`, `.sidebar-item`)

**Functions:**
- Component functions: PascalCase (React components render)
- Custom hooks: camelCase with "use" prefix (e.g., `useRealtimeData`)
- Utility functions: camelCase (e.g., `extractClientFromTitle`, `formatDuration`)
- Event handlers: camelCase with "handle" prefix (e.g., `handleClick`)

## Where to Add New Code

**New Feature/View:**
1. Create new component file: `src/app/components/[FeatureName].tsx`
   - Use "use client" directive for interactivity
   - Import icons from lucide-react
   - Use useState for local state
   - Apply glass-card classes for UI elements
2. Import component in `src/app/page.tsx`
3. Add navigation entry to tools array in page.tsx
4. Handle routing in activeView conditional rendering

**New API Integration:**
1. Create new route file: `src/app/api/[service]/route.ts`
   - Export GET function returning NextResponse.json()
   - Validate env variables at start
   - Transform external data to standardized format
   - Include error handling with console.error
2. Create specialized hook in `src/app/hooks/useRealtimeData.ts`
   - Export function calling useRealtimeData with correct endpoint
   - Export TypeScript interface for response type
3. Implement in component using hook

**Utility Functions:**
- Place shared utility functions in new file: `src/app/utils/[utility-name].ts`
- Import and use in components and API routes
- Include JSDoc comments for visibility

**Styling:**
- Add global styles to `src/app/globals.css` as @layer components
- Use CSS custom properties (--accent-cyan, --text-primary, etc.)
- Apply Tailwind utilities inline via className
- Use hover-lift, glass-card for consistent patterns

**Hooks:**
- Add new hooks to `src/app/hooks/useRealtimeData.ts` file
- Use generic useRealtimeData as base when possible
- Export TypeScript interface for hook response
- Follow pattern: specialized hook calls useRealtimeData with endpoint

## Special Directories

**src/app/api/**
- Purpose: Next.js App Router API routes
- Generated: No
- Committed: Yes
- Note: Only GET endpoints currently; no middleware or auth layer

**src/app/fonts/**
- Purpose: Font files for typography
- Generated: No
- Committed: Yes
- Note: Google fonts loaded in layout.tsx

**.next/**
- Purpose: Next.js build output and cache
- Generated: Yes (on build)
- Committed: No (in .gitignore)

**node_modules/**
- Purpose: Installed dependencies
- Generated: Yes (on npm install)
- Committed: No (in .gitignore)

## Module Organization

**No barrel files** - Components imported directly from their files

**Import pattern:**
```typescript
// Component imports
import ClientCommandCenter from "./components/ClientCommandCenter";

// Hook imports
import { useRealtimeData, useTodoistData } from "@/app/hooks/useRealtimeData";

// Type imports
import type { Client, Meeting, Task } from "@/types"; // Note: types currently inline

// Icon imports
import { Users, Calendar } from "lucide-react";
```

**Path aliases:**
- `@/*` resolves to `src/*` (configured in tsconfig.json)
- Used for imports from root-relative paths (e.g., `@/app/hooks/useRealtimeData`)

---

*Structure analysis: 2026-02-24*
