# Coding Conventions

**Analysis Date:** 2026-02-24

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `ClientCommandCenter.tsx`, `MeetingIntelligence.tsx`, `TaskMissionControl.tsx`)
- Utilities and hooks: camelCase with descriptive prefix (e.g., `useRealtimeData.ts`, `middleware.ts`)
- API routes: lowercase with forward slashes in path structure (e.g., `/api/fireflies/route.ts`, `/api/todoist/route.ts`)

**Functions:**
- Components: PascalCase (e.g., `DashboardOverview`, `MissionControl`)
- Helper functions: camelCase (e.g., `extractClientFromTitle()`, `formatDuration()`, `getProjectType()`)
- Hook functions: camelCase with `use` prefix (e.g., `useRealtimeData()`, `useTodoistData()`, `useFirefliesData()`)

**Variables:**
- State variables: camelCase (e.g., `activeView`, `selectedClient`, `sidebarOpen`, `filteredClients`)
- Constants: camelCase with optional UPPER_CASE for environment variables (e.g., `FIREFLIES_API_KEY`, `TODOIST_API_TOKEN`)
- Type aliases for state: PascalCase with suffix or descriptive (e.g., `ToolView`, `Client`, `Meeting`, `Task`)
- Booleans: prefix with `is`, `has`, or `can` (e.g., `isOliviaTask`, `isActive`, `isComing`)

**Types:**
- Interface names: PascalCase (e.g., `Client`, `Meeting`, `Task`, `FirefliesTranscript`, `TodoistTask`)
- Record maps: camelCase (e.g., `colorMap`, `projectMap`, `prefixes`)
- Discriminant union types: use string literals (e.g., `"active" | "at-risk" | "completing" | "prospective"`)

## Code Style

**Formatting:**
- ESLint enforces Next.js standards via `eslint-config-next` and `eslint-config-next/typescript`
- Next.js built-in linting handles code style and TypeScript checking
- Line length appears to follow standard conventions (no strict visible limit enforced in config)
- Indentation: 2 spaces consistently throughout codebase

**Linting:**
- Tool: ESLint with Next.js Core Web Vitals configuration
- Config file: `.eslintrc.json` extending `["next/core-web-vitals", "next/typescript"]`
- Run command: `npm run lint` → `next lint`
- Strictness: TypeScript strict mode enabled in `tsconfig.json`

**Spacing & Structure:**
- Component files consistently separate imports, types, constants, and JSX
- Component declarations followed by internal utility functions (helpers below components)
- Multiple utility functions within single file (e.g., `extractClientFromTitle`, `formatDuration`, `isThisWeek` in fireflies route)
- Blank lines between major sections (imports → types → components → utilities)

## Import Organization

**Order:**
1. React and Next.js imports
2. External libraries (lucide-react, date-fns, etc.)
3. Relative imports (components, hooks, utilities)
4. Type imports grouped separately if multiple

**Example from codebase:**
```typescript
import { useState } from "react";
import { Video, CheckSquare, Clock, Users } from "lucide-react";
import { useFirefliesData } from "../hooks/useRealtimeData";
```

**Path Aliases:**
- Configured in `tsconfig.json`: `"@/*": ["./src/*"]`
- Not actively used in current codebase (uses relative imports instead)
- Recommended for new code: use `@/app/components/`, `@/app/hooks/` instead of relative paths

## Error Handling

**Patterns:**
- Thrown errors caught and logged with `console.error()` in API routes
- Error messages passed to frontend as JSON response with `error` field
- Components check for error state and display error UI with retry button
- Try-catch in async functions with specific error messaging
- API responses use `NextResponse.json()` for both success and error cases

**Examples:**
```typescript
// API route error handling
if (!FIREFLIES_API_KEY) {
  return NextResponse.json(
    { error: 'FIREFLIES_API_KEY not configured' },
    { status: 500 }
  );
}

// Hook error handling
catch (err) {
  const error = err instanceof Error ? err : new Error('Unknown error');
  setError(error);
  onError?.(error);
}

// Component error display
if (error) {
  return (
    <div className="space-y-6">
      <div className="glass-card p-8 border-red-500/30">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-red-400 text-lg">{error.message}</p>
        <button onClick={refresh}>Retry</button>
      </div>
    </div>
  );
}
```

## Logging

**Framework:** `console` object (no external logging library)

**Patterns:**
- Errors logged with `console.error()` in API routes before throwing
- GraphQL errors logged with `console.error('Fireflies GraphQL errors:', responseData.errors)`
- API errors logged descriptively: `console.error('Fireflies API error:', error)`
- Loading states shown to user via UI (spinners, text) rather than logged
- No debug-level logging observed; only error-level logging used

**Examples from API routes:**
```typescript
console.error('Fireflies API error response:', responseData);
console.error('Fireflies GraphQL errors:', responseData.errors);
console.error('Fireflies API error:', error);
console.error('Todoist API error:', error);
```

## Comments

**When to Comment:**
- Used sparingly; code is primarily self-documenting through naming and structure
- No JSDoc/TSDoc comments observed in current codebase
- Inline comments used rarely (only observed in middleware for clarity on auth flow)

**Example from middleware:**
```typescript
// Check if the request is for an API route - allow those
if (request.nextUrl.pathname.startsWith('/api/')) {
  return NextResponse.next()
}

// Check for static assets - allow those
if (request.nextUrl.pathname.startsWith('/_next/')) {
  return NextResponse.next()
}
```

**Recommendation for new code:**
- Add JSDoc for exported functions and components to document parameters and return types
- Add inline comments for non-obvious logic or workarounds
- Keep comments close to the code they describe

## Function Design

**Size:**
- Small, focused functions (10-50 lines typical)
- Helper functions extracted to bottom of component files
- Hook logic separated into dedicated hook files (`useRealtimeData.ts`)

**Parameters:**
- Functions accept single parameter objects when multiple params needed (e.g., `options: UseRealtimeDataOptions`)
- Optional parameters marked with `?` and destructured with defaults
- Type definitions provided for all parameters

**Return Values:**
- Hooks return objects with related state: `{ data, loading, error, lastUpdated, refresh }`
- API routes return `NextResponse.json()` with consistent shape: `{ data?, error?, ...metadata }`
- Components return JSX only; no conditional render logic outside JSX blocks when possible
- Helper functions return primitive types or well-typed objects

**Example hook return pattern:**
```typescript
return { data, loading, error, lastUpdated, refresh };
```

**Example API response pattern:**
```typescript
return NextResponse.json({ meetings, stats });
// or on error:
return NextResponse.json(
  { error: 'message', meetings: [], stats: {} },
  { status: 500 }
);
```

## Module Design

**Exports:**
- Default export for components: `export default function ClientCommandCenter() { ... }`
- Named exports for types and interfaces: `export interface Client { ... }`
- Named exports for hook functions: `export function useRealtimeData<T>(...) { ... }`
- Single responsibility per file

**Barrel Files:**
- Not used in current codebase
- Recommendation: Consider creating `src/app/components/index.ts` with barrel exports if component count grows

**File Organization:**
- Component file structure: imports → types → constants/mock data → default component → internal helpers
- Hook file structure: imports → interfaces → hook function → type exports → specialized hook variants

## Tailwind CSS Usage

**Patterns:**
- All styling done with Tailwind utility classes (no separate CSS modules)
- Custom reusable components via `@layer components`: `.glass-card`, `.neon-text`, `.gradient-text`, `.hover-lift`
- CSS custom properties for theme colors in `:root`
- Responsive classes used: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Dynamic class strings built with template literals and ternary operators

**Example:**
```typescript
className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all ${
  isActive
    ? "bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-400"
    : "text-slate-400 hover:text-slate-200"
}`}
```

**Custom Components (in globals.css `@layer components`):**
- `.glass-card`: Frosted glass effect with backdrop blur
- `.neon-text`: Cyan-purple-pink gradient text
- `.neon-border`: Gradient border on hover
- `.sidebar-item`: Animated sidebar indicator
- `.glow-cyan`, `.glow-purple`: Shadow glow effects
- `.status-dot`: Pulsing status indicators
- `.hover-lift`: Elevation effect on hover

---

*Convention analysis: 2026-02-24*
