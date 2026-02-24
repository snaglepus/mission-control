# External Integrations

**Analysis Date:** 2026-02-24

## APIs & External Services

**Task Management:**
- Todoist API - Task/todo synchronization and project management
  - SDK/Client: Native HTTP fetch (no SDK package)
  - Auth: `TODOIST_API_TOKEN` (Bearer token)
  - Endpoint: `https://api.todoist.com/api/v1/tasks`
  - Route handler: `src/app/api/todoist/route.ts`
  - Polling: 30 seconds (configurable via `REFRESH_INTERVAL_TODOIST` env var)
  - Features: Fetches active tasks, maps to projects (min/hour/day/inbox), extracts labels and client metadata

**Meeting Intelligence:**
- Fireflies API - Meeting transcription and analytics
  - SDK/Client: Native HTTP fetch with GraphQL (no SDK package)
  - Auth: `FIREFLIES_API_KEY` (Bearer token)
  - Endpoint: `https://api.fireflies.ai/graphql`
  - Route handler: `src/app/api/fireflies/route.ts`
  - Query: GraphQL query fetches transcripts with ID, title, date, duration, participants
  - Polling: 30 seconds (configurable via `REFRESH_INTERVAL_FIREFLIES` env var)
  - Features: Fetches recent transcripts, calculates duration, extracts attendees, generates transcript URLs

## Data Storage

**Databases:**
- Not detected - Application is stateless
- No persistent database layer
- All data flows through external API integrations

**File Storage:**
- Not applicable - No file upload/storage functionality

**Caching:**
- None - Client-side state management only
- Uses in-memory React state via `useRealtimeData` hook
- Real-time polling refreshes data every 30 seconds

**State Management:**
- Client-side only via React hooks
- `useRealtimeData` hook in `src/app/hooks/useRealtimeData.ts` manages fetch, loading, error, and refresh states
- No Redux, Zustand, or other state managers

## Authentication & Identity

**Auth Provider:**
- Custom HTTP Basic Authentication
  - Implementation: Middleware-based via `src/middleware.ts`
  - Credentials: `AUTH_USERNAME` and `AUTH_PASSWORD` environment variables
  - Scope: Protects all routes except `/api/*` and static assets (`/_next/`, `/favicon`)
  - Returns 401 with WWW-Authenticate header to prompt browser auth dialog

**External API Auth:**
- Todoist: Bearer token (individual API token per user)
- Fireflies: Bearer token (individual API key per workspace)
- Tokens stored in `.env.local` (not committed to git)

## Monitoring & Observability

**Error Tracking:**
- None detected - No Sentry, LogRocket, or error tracking service
- Console-based error logging only

**Logs:**
- Browser console logs for client-side errors
- Server console logs via Node.js stdout (captured by Systemd journalctl)
- Nginx access/error logs when deployed behind reverse proxy
- View logs via: `sudo journalctl -u mission-control -f`

**Metrics:**
- No external metrics collection (Datadog, New Relic, etc.)
- Basic stats calculated locally per API response

## CI/CD & Deployment

**Hosting:**
- Self-hosted on VPS (Ubuntu/Debian)
- Process manager: Systemd
- Reverse proxy: Nginx (installed and configured by setup scripts)
- SSL provider: Let's Encrypt via Certbot

**CI Pipeline:**
- None detected - No GitHub Actions, GitLab CI, or automated testing pipeline

**Deployment Process:**
- Manual deployment via shell scripts:
  - `install-service.sh` - Installs system-wide Systemd service
  - `install-user-service.sh` - Installs user-level Systemd service
  - `setup-https.sh` - Interactive HTTPS/Nginx configuration
  - `quick-https.sh` - One-liner HTTPS setup with domain parameter

**Deployment Steps:**
1. Build: `npm run build`
2. Install service: `sudo ./install-service.sh` or `./install-user-service.sh`
3. Configure HTTPS: `sudo ./quick-https.sh mission.yourdomain.com`
4. Verify: Check Systemd and Nginx status

## Environment Configuration

**Required env vars:**
- `TODOIST_API_TOKEN` - Todoist API bearer token (get from https://todoist.com/app/settings/integrations)
- `FIREFLIES_API_KEY` - Fireflies API key (get from https://app.fireflies.ai/settings)
- `AUTH_USERNAME` - HTTP Basic auth username (default suggested: robbie)
- `AUTH_PASSWORD` - HTTP Basic auth password (must be strong)

**Optional env vars:**
- `PORT` - Server port (default: 3000)
- `HOSTNAME` - Bind address (default: 0.0.0.0)
- `REFRESH_INTERVAL_TODOIST` - Todoist polling interval in ms (default: 30000)
- `REFRESH_INTERVAL_FIREFLIES` - Fireflies polling interval in ms (default: 30000)

**Secrets location:**
- `.env.local` file (git-ignored, never committed)
- Example template: `.env.local.example` (for documentation/onboarding)

**Configuration not in env:**
- Todoist project ID mapping (hardcoded): `src/app/api/todoist/route.ts` lines 87-93
  - `'6CrgHpjHJ8WPfx5P'` → 'day' project
  - `'6CrgHpjHJR7WMWVP'` → 'hour' project
  - `'6W3C6v6Mj5j29c7w'` → 'min' project
- Client labels (hardcoded): `src/app/api/todoist/route.ts` line 97
  - `@CoverMore`, `@GuideDogs`, `@ResMed`, `@AussieBroadband`, `@Innovatus`
- Fireflies client prefixes (hardcoded): `src/app/api/fireflies/route.ts` lines 109-115
  - `CM` → CoverMore, `GD` → Guide Dogs, `RM` → ResMed, `AB` → Aussie Broadband, `NC` → NewsCorp

## Webhooks & Callbacks

**Incoming:**
- None detected - Application polls external APIs, does not receive webhooks

**Outgoing:**
- None detected - Application does not send data to external webhooks
- Todoist and Fireflies APIs are read-only (no mutations)

**Real-time Updates:**
- Implemented via client-side polling only
- `useRealtimeData` hook fetches from API routes every 30 seconds
- No WebSocket, Server-Sent Events, or webhook-based real-time updates
- Polling intervals configurable via environment variables

## API Response Handling

**Todoist API Response Format:**
```typescript
{
  tasks: TransformedTask[],
  stats: {
    total: number,
    p1: number,
    olivia: number,
    today: number,
    min: number,
    hour: number,
    day: number
  }
}
```

**Fireflies API Response Format:**
```typescript
{
  meetings: Meeting[],
  stats: {
    total: number,
    thisWeek: number,
    pendingReview: number,
    totalActionItems: number
  }
}
```

## Error Handling

**Network Errors:**
- Caught in `src/app/hooks/useRealtimeData.ts` via try/catch
- HTTP errors trigger with status code in message
- Graceful fallback: Returns empty arrays for tasks/meetings
- Error callback optional via `onError` option

**API Configuration Errors:**
- Missing tokens return 500 with "not configured" error message
- Todoist: Missing `TODOIST_API_TOKEN` → 500 error
- Fireflies: Missing `FIREFLIES_API_KEY` → 500 error

**GraphQL Errors (Fireflies):**
- Checked for `responseData.errors` array
- Logs GraphQL error details
- Returns error message to client

---

*Integration audit: 2026-02-24*
