# Architecture

**Analysis Date:** 2026-02-24

## Pattern Overview

**Overall:** Next.js App Router with Client-Side Components and Backend API Routes

**Key Characteristics:**
- Server-side API routes for external integrations (Fireflies, Todoist)
- Client-side React components for UI with real-time data synchronization
- Monolithic dashboard-style application with tab-based navigation
- React hooks for data fetching and state management (no external state library)
- Glassmorphism design system with Tailwind CSS

## Layers

**Presentation Layer:**
- Purpose: Render UI components and handle user interactions
- Location: `src/app/components/`, `src/app/page.tsx`
- Contains: React components (ClientCommandCenter, MeetingIntelligence, TaskMissionControl), dashboard overview
- Depends on: useRealtimeData hook, React Lucide icons, Tailwind CSS
- Used by: Main entry point (page.tsx)

**Data Fetching Layer:**
- Purpose: Manage real-time data synchronization with polling
- Location: `src/app/hooks/useRealtimeData.ts`
- Contains: Generic useRealtimeData hook, useTodoistData, useFirefliesData specialized hooks
- Depends on: Fetch API, TypeScript interfaces
- Used by: All major components that display dynamic data

**API Integration Layer:**
- Purpose: Handle external service communication and data transformation
- Location: `src/app/api/todoist/route.ts`, `src/app/api/fireflies/route.ts`
- Contains: Next.js API route handlers, data transformation logic, error handling
- Depends on: External APIs (Todoist, Fireflies), process.env for credentials
- Used by: Client-side hooks via fetch calls

**Root Layout:**
- Purpose: Configure HTML metadata and global styling
- Location: `src/app/layout.tsx`
- Contains: Metadata configuration, CSS imports, font setup
- Depends on: Next.js Metadata type, Google Inter font
- Used by: All pages

## Data Flow

**Real-Time Data Synchronization:**

1. User navigates to view (Dashboard, Clients, Meetings, Tasks)
2. Component mounts → calls useRealtimeData or specialized hook
3. Hook executes initial fetch and sets 30-second polling interval
4. Fetch calls `/api/todoist` or `/api/fireflies` endpoint
5. API route authenticates with external service using env variables
6. External service returns data (raw API response)
7. API route transforms data into standardized format
8. Response returned to client as JSON
9. Hook updates component state with data, loading status, lastUpdated timestamp
10. Component renders with fetched data
11. On interval tick, hook refetches automatically
12. User can manually trigger refresh with button click

**State Management:**
- Component-level state only (useState)
- Data fetching state: loading, error, lastUpdated
- UI state: activeView, selectedItem, filters
- No external state management library (Redux, Zustand, etc.)

## Key Abstractions

**useRealtimeData Generic Hook:**
- Purpose: Encapsulate polling logic and error handling for any API endpoint
- Examples: `useTodoistData`, `useFirefliesData`
- Pattern: Generic function accepting endpoint URL and options; returns { data, loading, error, lastUpdated, refresh }

**API Route Handlers:**
- Purpose: Abstract external service communication away from frontend
- Examples: `GET /api/todoist`, `GET /api/fireflies`
- Pattern: Validate env config → fetch from external service → transform → return standardized response

**Component Container Pattern:**
- Purpose: Each view is a standalone component managing its own state and presentation
- Examples: `ClientCommandCenter`, `MeetingIntelligence`, `TaskMissionControl`
- Pattern: Component contains data hook call, filter/search state, conditional rendering, modal logic

**Glass-card Component Class:**
- Purpose: Consistent glassmorphism styling across all UI elements
- Pattern: CSS utility class (`.glass-card`) with backdrop blur, semi-transparent background, border

## Entry Points

**Web Application:**
- Location: `src/app/page.tsx` (MissionControl component)
- Triggers: Browser navigation to root URL
- Responsibilities: Main layout structure (sidebar + header + content), navigation state management, routing between views

**API Routes:**
- Location: `src/app/api/todoist/route.ts`, `src/app/api/fireflies/route.ts`
- Triggers: Client-side fetch calls from useRealtimeData hook
- Responsibilities: Authenticate with external services, fetch data, transform to standard format, error handling

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: All page navigation
- Responsibilities: Set metadata, apply global styles, load fonts, wrap children with body element

## Error Handling

**Strategy:** Try-catch at API layer with error propagation to components

**Patterns:**

- **API Route Error Handling (`src/app/api/*/route.ts`):**
  - Check for missing env variables → return 500 with specific error message
  - Catch fetch errors and GraphQL errors → log and return 500
  - Return error field in JSON response body
  - All errors include descriptive message for debugging

- **Hook Error Handling (`useRealtimeData`):**
  - Catch promise rejection during fetch
  - Store error in state for component consumption
  - Call optional onError callback for higher-level error tracking
  - Continue polling interval even on error (allows retry on next cycle)

- **Component Error Handling:**
  - Components check for error state and render error UI
  - Error UI includes AlertCircle icon and error message
  - Provide "Retry" button that calls refresh() to refetch

## Cross-Cutting Concerns

**Logging:**
- Console.error in API routes for debugging external service failures
- No structured logging framework

**Validation:**
- API responses validated with TypeScript interfaces
- URL parameter validation in API routes (extracting project IDs, client names)
- Required env variables checked at API route entry

**Authentication:**
- Bearer token authentication for both Fireflies (GraphQL) and Todoist (REST)
- Credentials stored in environment variables (.env.local)
- No session management or user authentication system

**Type Safety:**
- Full TypeScript strict mode enabled (tsconfig.json)
- Interfaces defined for API responses at multiple layers
- Generic hook with TypeScript generics for code reuse

---

*Architecture analysis: 2026-02-24*
