# Codebase Concerns

**Analysis Date:** 2026-02-24

## Tech Debt

**Hardcoded Project IDs and Client Mappings:**
- Issue: Client names and project IDs are hardcoded as magic strings in route handlers instead of using a configuration system
- Files: `src/app/api/todoist/route.ts` (lines 88-93), `src/app/api/fireflies/route.ts` (lines 109-118)
- Impact: Adding new clients requires code changes and redeploy; no runtime flexibility; breaks maintainability as client list grows
- Fix approach: Create a `config/clients.json` or database schema to store client mappings; load dynamically in API routes

**Mocked Client Data Hardcoded in Component:**
- Issue: All client data is mock data stored directly in component state in `ClientCommandCenter.tsx` (lines 33-100)
- Files: `src/app/components/ClientCommandCenter.tsx`
- Impact: Component is not connected to any real data source; search and filter features are non-functional with real data; no persistence layer
- Fix approach: Create API endpoint `/api/clients` to fetch real client data; integrate with `useRealtimeData` hook pattern

**Missing Test Suite:**
- Issue: No test files exist in repository; zero test coverage
- Files: N/A (test directory structure doesn't exist)
- Impact: Regressions will occur silently; API routes have no validation coverage; component rendering has no coverage
- Fix approach: Create `__tests__` directories parallel to source; add Jest/Vitest setup; write tests for API routes and custom hooks

**Oversized Components:**
- Issue: Components exceed 350 lines, mixing logic, styling, and state management
- Files: `src/app/components/MeetingIntelligence.tsx` (391 lines), `src/app/components/ClientCommandCenter.tsx` (367 lines), `src/app/components/TaskMissionControl.tsx` (366 lines), `src/app/page.tsx` (313 lines)
- Impact: Components become hard to test and maintain; rendering performance degrades with large lists; logic reuse is difficult
- Fix approach: Extract stat cards into `<StatsCard>` component; extract filter UI into `<FilterBar>`; separate modal content into sub-components

**Duplicate API Response Transformation Logic:**
- Issue: Each API route implements its own response transformation pattern (Todoist in `route.ts` lines 52-75, Fireflies in `route.ts` lines 77-89)
- Files: `src/app/api/todoist/route.ts`, `src/app/api/fireflies/route.ts`
- Impact: Updates to response shape require changes in multiple places; inconsistency in error handling; difficult to add new endpoints
- Fix approach: Create `lib/apiTransformers.ts` with reusable transformation functions; centralize response formatting

**No Environment Validation:**
- Issue: Required environment variables are checked at runtime but only when API routes are called, not at startup
- Files: `src/app/api/todoist/route.ts` (line 30), `src/app/api/fireflies/route.ts` (line 46)
- Impact: Application starts successfully but fails at runtime when env vars are missing; unclear startup status
- Fix approach: Create `lib/validateEnv.ts` that runs on server startup; throw error with helpful message on missing vars

---

## Known Bugs

**Date Comparison Bug - Todoist Today Filter:**
- Symptoms: "Due Today" filter may return incorrect results due to timezone differences
- Files: `src/app/api/todoist/route.ts` (line 70), `src/app/components/TaskMissionControl.tsx` (line 46)
- Trigger: User in timezone different from server; creates new Date() without timezone awareness
- Current workaround: None - users may see tasks unexpectedly missing or appearing
- Fix: Use `date-fns` (already in dependencies) to normalize dates: `format(new Date(), 'yyyy-MM-dd')` instead of `.split('T')[0]`

**Fireflies Timestamp Conversion Bug:**
- Symptoms: Meeting dates display incorrectly or shifted by hours
- Files: `src/app/api/fireflies/route.ts` (line 81)
- Trigger: Code assumes `t.date` is in milliseconds but Fireflies API may return seconds or ISO strings
- Current workaround: None - meetings display with wrong dates
- Fix: Add timestamp format validation; use `date-fns.parse()` with format detection

**Search Input Non-Functional:**
- Symptoms: Search boxes in all views don't filter displayed data
- Files: `src/app/page.tsx` (lines 103-107), `src/app/components/ClientCommandCenter.tsx` (line 219), `src/app/components/TaskMissionControl.tsx` (line 262), `src/app/components/MeetingIntelligence.tsx` (line 174)
- Trigger: Input element exists but has no onChange handler or filtering logic
- Current workaround: Use filter dropdowns instead
- Fix: Add `useState` for search term; implement fuzzy matching; filter tasks/meetings by title, client, or content

**Modal Close Button Uses String "✕" Instead of Icon:**
- Symptoms: Accessibility issue; unsemantic HTML; inconsistent with icon usage elsewhere
- Files: `src/app/components/ClientCommandCenter.tsx` (line 318), `src/app/components/MeetingIntelligence.tsx` (line 290)
- Trigger: Screen reader announces "times" instead of "close"
- Current workaround: None - keyboard users may not find close button
- Fix: Use `X` icon from lucide-react; add `aria-label="Close"` for accessibility

---

## Security Considerations

**Basic Auth Credentials Potentially Exposed:**
- Risk: `AUTH_USERNAME` and `AUTH_PASSWORD` are read from environment but Basic Auth header sent in cleartext over HTTP (if not HTTPS)
- Files: `src/middleware.ts` (lines 22-34)
- Current mitigation: .env file exists but is not committed (good); Basic Auth is only first line of defense
- Recommendations:
  - Enforce HTTPS in production only (add to middleware or Next.js config)
  - Document that HTTP is acceptable for development only
  - Add warning in `.env.local.example` about credential security
  - Consider OAuth2 or session-based auth for sensitive deployments
  - Add rate limiting to middleware to prevent brute force attacks

**API Tokens Exposed in Code:**
- Risk: `TODOIST_API_TOKEN` and `FIREFLIES_API_KEY` are read correctly from env but logged to console on error
- Files: `src/app/api/todoist/route.ts` (line 79), `src/app/api/fireflies/route.ts` (line 66, 71, 100)
- Current mitigation: None - tokens would leak to server logs or monitoring services
- Recommendations:
  - Sanitize console.error messages: don't log full error objects with sensitive data
  - Use structured logging with sensitive field redaction: `{ error: 'API call failed', endpoint: url, status }`
  - Add serverless function or middleware to mask tokens in logs
  - Rotate tokens regularly

**No CORS Policy Defined:**
- Risk: API routes accessible from any origin if exposed (current middleware doesn't apply to `/api/` routes)
- Files: `src/middleware.ts` (line 6) explicitly allows all `/api/*` routes
- Current mitigation: Application is single-page with internal API; not exposed to public
- Recommendations:
  - Define CORS headers in API routes if external clients need access
  - Add `Access-Control-Allow-Origin` header in responses (currently missing)
  - Add rate limiting per origin to prevent abuse

**Basic Auth Credentials in URL Could Be Logged:**
- Risk: If users pass credentials via URL instead of Authorization header, they appear in server logs, CDN logs, browser history
- Files: `src/middleware.ts` (entire middleware)
- Current mitigation: Middleware enforces header-based auth, not URL-based
- Recommendations:
  - Document that URL-based auth (e.g., `?user=x&pass=y`) is not supported
  - Add middleware validation to reject requests with auth params in URL
  - Implement login form with cookie-based sessions for better UX and security

---

## Performance Bottlenecks

**30-Second Polling Interval Creates Thundering Herd:**
- Problem: All three realtime hooks refresh every 30 seconds (Todoist, Fireflies, and implicit refresh pattern); if user opens all views simultaneously, creates 3 concurrent API calls
- Files: `src/app/hooks/useRealtimeData.ts` (line 20 - default 30000ms), called from `TaskMissionControl.tsx` (line 38), `MeetingIntelligence.tsx` (line 44)
- Cause: Fixed interval with no request deduplication or request coalescence
- Improvement path:
  - Implement shared request cache using React Query or SWR
  - Use staggered polling: offset refresh times so requests spread over time interval
  - Add `AbortController` to cancel in-flight requests when component unmounts
  - Consider WebSocket for true real-time updates instead of polling

**No Data Caching Between API Calls:**
- Problem: Each fetch request hits external APIs (Todoist, Fireflies) even if data hasn't changed
- Files: `src/app/hooks/useRealtimeData.ts` (fetchData callback re-runs every 30 seconds regardless of data freshness)
- Cause: No ETag or conditional request support; no browser cache control headers
- Improvement path:
  - Add `If-Modified-Since` or ETag headers to API responses
  - Implement local storage cache with timestamp; only refresh if stale
  - Add `Cache-Control: max-age=300` to API responses to let browser cache
  - Return `304 Not Modified` for unchanged data

**Large Component Trees Re-render Unnecessarily:**
- Problem: `page.tsx` renders `DashboardOverview`, `ClientCommandCenter`, `MeetingIntelligence`, `TaskMissionControl` but only one view is visible at a time
- Files: `src/app/page.tsx` (lines 132-135) renders all components regardless of `activeView`
- Cause: Conditional rendering (`{activeView === "dashboard" &&}`) but React still mounts/renders all branches
- Improvement path:
  - Use dynamic imports with lazy loading: `const TaskComponent = dynamic(() => import('./components/TaskMissionControl'))`
  - Move component selection to route-based navigation instead of state-based
  - Implement React.memo on all view components to prevent re-renders

**No Image Optimization:**
- Problem: UI uses gradients and shadows extensively; no images but Lucide icons may not be optimized
- Files: All components with lucide-react imports
- Cause: Icons are imported as separate components; no icon sprite sheet
- Improvement path:
  - Use `next/image` for any future images with automatic optimization
  - Consider iconify or dynamic icon loading for large icon libraries
  - Profile Lucide bundle size; consider removing unused icons

---

## Fragile Areas

**API Response Shape Assumptions Not Validated:**
- Files: `src/app/hooks/useRealtimeData.ts` (line 32: `const result = await response.json() as ApiResponse<T>`)
- Why fragile: Type assertion with `as` bypasses runtime validation; if API response structure changes, code silently gets wrong data
- Safe modification: Add runtime validation using `zod` or similar:
  ```typescript
  const result = responseSchema.parse(await response.json());
  ```
- Test coverage gaps: No tests for malformed API responses, missing fields, or unexpected data types

**Dependency on Hardcoded Project IDs:**
- Files: `src/app/api/todoist/route.ts` (lines 88-93), referenced in `TaskMissionControl.tsx` (line 40)
- Why fragile: If Todoist changes project IDs or user reconfigures projects, tasks disappear from UI
- Safe modification: Fetch projects dynamically from Todoist API on each request or cache with TTL
- Test coverage gaps: No tests verify that project ID mapping is correct or handles missing projects

**Filter Logic Duplicated Across Components:**
- Files: `TaskMissionControl.tsx` (lines 45-53), `ClientCommandCenter.tsx` (lines 106-108), `MeetingIntelligence.tsx` (lines 51-53)
- Why fragile: Same filter logic implemented three times; bug fixes must be applied in all places
- Safe modification: Extract filter logic to `lib/filters.ts`; create reusable `useFilteredData` hook
- Test coverage gaps: Filter logic never tested; edge cases (empty arrays, null values) cause different behavior per component

**Modal Dismissal State Shared Across Components:**
- Files: `ClientCommandCenter.tsx` (lines 103, 301-364), `MeetingIntelligence.tsx` (lines 45, 273-388)
- Why fragile: Modal state is component-local; no cleanup on navigation away; if user navigates while modal open, modal is lost and user can't recover
- Safe modification: Use URL-based state for modals: `?selectedClient=1` and `?selectedMeeting=abc` so modal state persists on navigation
- Test coverage gaps: No tests verify modal behavior across navigation or browser back/forward

**Relative Date Calculations Fail at Midnight:**
- Files: `TaskMissionControl.tsx` (line 46: hardcoded date comparison), `src/app/api/todoist/route.ts` (line 70), `src/app/components/MeetingIntelligence.tsx` (line 213)
- Why fragile: Uses `new Date()` at render time; "today" changes at midnight but cached/stale data may show old date
- Safe modification: Use server time consistently; pass `now` from server to client for reproducible date calculations
- Test coverage gaps: No tests cover midnight boundary or timezone differences

---

## Scaling Limits

**No Database Connection:**
- Current capacity: Application stores all state in client-side React state; server has no persistence
- Limit: Reloading page loses all data; refreshing loses filter state and modal state; no multi-user support
- Scaling path:
  - Add database layer (PostgreSQL, MongoDB) to store user preferences, bookmarks, notes
  - Implement user login/sessions to isolate data per user
  - Add cache layer (Redis) for frequently accessed data (Todoist projects, Fireflies meetings)
  - Move from polling to event-based updates with WebSocket

**30-Second Polling Creates N+1 API Calls:**
- Current capacity: 1 user = 3 API calls per 30 sec = 8,640 calls/day per user; 10 users = 86,400 calls/day
- Limit: API rate limits (Todoist: 450 requests/hour, Fireflies: varies) reached quickly with multiple users
- Scaling path:
  - Implement server-side API caching with shared TTL; deduplicate identical requests
  - Add job queue (Bull, Celery) for async updates; webhook handlers instead of polling
  - Implement request batching: combine multiple task/meeting fetches into single batch request
  - Add database layer to cache API responses with configurable refresh interval

**No Authentication or Multi-Tenancy:**
- Current capacity: Single-user application with Basic Auth; no concept of "other users"
- Limit: Can't support team usage; can't separate concerns (each user needs their own API keys)
- Scaling path:
  - Implement user accounts and session management
  - Add OAuth2 for secure third-party integrations (Todoist, Fireflies)
  - Implement per-user API key management
  - Add role-based access control (admin, editor, viewer)

---

## Dependencies at Risk

**Recharts Not Used Yet:**
- Risk: Added to dependencies but unused in code; increases bundle size without benefit
- Impact: Every release includes recharts payload; May slow initial load
- Migration plan: Remove from `package.json` if no charts planned; or create dashboard with revenue charts using recharts + mock data

**Lucide React Icons (0.475.0):**
- Risk: Minor version may include breaking changes; 475 is high version number suggesting many updates
- Impact: Icon names/APIs may change on minor update; UI could break
- Migration plan: Lock to exact version in package.json: `"lucide-react": "0.475.0"` instead of `^0.475.0`; regularly test dependency updates

**Next.js 14.2.35 Approaching EOL:**
- Risk: Next.js releases major versions annually; 14.2.35 is mid-life; Next.js 15 may be released soon with breaking changes
- Impact: Security patches may stop; performance improvements missed; type definitions may become incompatible with latest TS
- Migration plan: Plan upgrade path every 6 months; monitor Next.js blog for deprecation notices; test on RC versions before major release

**TypeScript 5 Strict Mode:**
- Risk: `strict: true` in `tsconfig.json` prevents future upgrades if codebase accumulates any/unknown types
- Impact: Type safety improves but migration complexity increases; dependencies may not be TS 5 compatible
- Migration plan: Maintain strict mode; add CI check to fail on any/unknown types; regularly audit dependencies for TS compatibility

---

## Missing Critical Features

**No Data Export/Reporting:**
- Problem: User can view tasks and meetings but cannot export or generate reports
- Blocks: Can't create reports for clients; can't audit task history; can't analyze trends
- Implementation path: Add CSV export for task lists; add PDF report generation for client meetings

**No Notification System:**
- Problem: Tasks and meetings are polled but user gets no alerts for P1 items or upcoming meetings
- Blocks: Users must stay on dashboard to see updates; easy to miss urgent items
- Implementation path: Add browser notifications for high-priority items; add email digest; add Slack integration

**No Offline Mode:**
- Problem: Application requires internet connection to Todoist/Fireflies APIs to function
- Blocks: Can't work during network outages; can't view cached data
- Implementation path: Add service worker; cache API responses; sync when reconnected

---

## Test Coverage Gaps

**API Routes Untested:**
- What's not tested: Todoist API fetch, response transformation, error handling, missing env vars
- Files: `src/app/api/todoist/route.ts`, `src/app/api/fireflies/route.ts`
- Risk: Changes to API response handling could break silently; invalid responses crash application
- Priority: High
- Test suggestions:
  ```typescript
  // src/app/api/todoist/__tests__/route.test.ts
  describe('GET /api/todoist', () => {
    it('returns 500 if TODOIST_API_TOKEN missing');
    it('transforms Todoist response correctly');
    it('filters Olivia tasks by label');
    it('maps project IDs to time estimates');
  })
  ```

**useRealtimeData Hook Untested:**
- What's not tested: Polling interval, error state, loading state, refresh callback, memory leaks on unmount
- Files: `src/app/hooks/useRealtimeData.ts`
- Risk: Hook may cause memory leaks; errors may be silently swallowed; refresh may not work after error recovery
- Priority: High
- Test suggestions:
  ```typescript
  // src/app/hooks/__tests__/useRealtimeData.test.ts
  describe('useRealtimeData', () => {
    it('fetches data on mount');
    it('retries failed requests');
    it('cleans up interval on unmount');
    it('respects custom refresh interval');
  })
  ```

**Component Rendering Untested:**
- What's not tested: All three main view components (TaskMissionControl, ClientCommandCenter, MeetingIntelligence) have no snapshot or behavior tests
- Files: `src/app/components/TaskMissionControl.tsx`, `ClientCommandCenter.tsx`, `MeetingIntelligence.tsx`
- Risk: UI regressions go unnoticed; filter/search changes could break silently; modal behavior unpredictable
- Priority: Medium
- Test suggestions:
  ```typescript
  // src/app/components/__tests__/TaskMissionControl.test.tsx
  describe('TaskMissionControl', () => {
    it('displays loading state while fetching');
    it('displays error message on fetch failure');
    it('filters tasks by P1 priority');
    it('shows "Due Today" correctly');
  })
  ```

**Middleware Not Tested:**
- What's not tested: Basic Auth validation, credential parsing, error responses, edge cases
- Files: `src/middleware.ts`
- Risk: Auth can be bypassed; malformed auth headers crash application; API routes may be unexpectedly exposed
- Priority: High
- Test suggestions:
  ```typescript
  // src/middleware/__tests__/middleware.test.ts
  describe('middleware', () => {
    it('allows /api/* routes without auth');
    it('allows request with valid credentials');
    it('denies request without credentials');
    it('denies request with invalid credentials');
  })
  ```

---

*Concerns audit: 2026-02-24*
