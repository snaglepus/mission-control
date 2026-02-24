# Testing Patterns

**Analysis Date:** 2026-02-24

## Test Framework

**Runner:**
- Not configured
- No test runner detected (Jest, Vitest, or similar not in `package.json`)

**Assertion Library:**
- Not configured

**Run Commands:**
```bash
# Currently no test commands available
# Testing is not yet implemented in this project
```

## Test File Organization

**Location:**
- No test files found in repository
- Recommended location when implementing: co-located with source files
- Suggested structure: `src/app/components/__tests__/`, `src/app/hooks/__tests__/`

**Naming:**
- Recommended pattern: `.test.ts`, `.test.tsx` or `.spec.ts`, `.spec.tsx`
- Co-locate tests with implementation files for maintainability

**Structure:**
- Recommended directory structure:
```
src/
├── app/
│   ├── components/
│   │   ├── __tests__/
│   │   │   ├── ClientCommandCenter.test.tsx
│   │   │   ├── MeetingIntelligence.test.tsx
│   │   │   └── TaskMissionControl.test.tsx
│   │   ├── ClientCommandCenter.tsx
│   │   ├── MeetingIntelligence.tsx
│   │   └── TaskMissionControl.tsx
│   ├── hooks/
│   │   ├── __tests__/
│   │   │   └── useRealtimeData.test.ts
│   │   └── useRealtimeData.ts
│   └── api/
│       ├── __tests__/
│       │   ├── fireflies.test.ts
│       │   └── todoist.test.ts
│       ├── fireflies/
│       │   └── route.ts
│       └── todoist/
│           └── route.ts
```

## Test Structure

**Suite Organization (Recommended):**

For components, tests should follow this pattern:
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useState as useStateMock } from 'react';
import ClientCommandCenter from '@/app/components/ClientCommandCenter';

describe('ClientCommandCenter', () => {
  describe('rendering', () => {
    it('should render client list', () => {
      render(<ClientCommandCenter />);
      expect(screen.getByText('Client Command Center')).toBeInTheDocument();
    });

    it('should display all clients by default', () => {
      render(<ClientCommandCenter />);
      // assertions
    });
  });

  describe('filtering', () => {
    it('should filter clients by status', () => {
      render(<ClientCommandCenter />);
      // setup and assertions
    });
  });

  describe('interactions', () => {
    it('should open client detail modal on click', () => {
      render(<ClientCommandCenter />);
      // interaction and assertions
    });
  });
});
```

**Patterns (Recommended):**

Setup pattern:
```typescript
beforeEach(() => {
  // Reset any mocks or state
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup
  jest.restoreAllMocks();
});
```

Teardown pattern:
```typescript
afterEach(() => {
  // Component cleanup handled by React Testing Library automatically
});
```

Assertion pattern:
```typescript
expect(element).toBeInTheDocument();
expect(element).toHaveClass('active');
expect(element).toHaveTextContent('Expected text');
expect(screen.getByRole('button')).toBeVisible();
```

## Mocking

**Framework (Recommended):**
- Jest's built-in mocking for fetch, modules, and functions
- React Testing Library's utilities for component mocking

**Patterns (Recommended):**

Mock fetch for API calls:
```typescript
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      data: mockData,
      error: null,
    }),
  })
);
```

Mock Next.js router:
```typescript
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
}));
```

Mock external components:
```typescript
jest.mock('lucide-react', () => ({
  Video: () => <div data-testid="video-icon">Icon</div>,
  // other icons
}));
```

Mock hooks:
```typescript
jest.mock('@/app/hooks/useRealtimeData', () => ({
  useFirefliesData: () => ({
    data: mockFirefliesData,
    loading: false,
    error: null,
    lastUpdated: new Date(),
    refresh: jest.fn(),
  }),
}));
```

**What to Mock:**
- External API calls (Fireflies, Todoist)
- Next.js built-in modules (router, navigation, etc.)
- Environment variables via `process.env`
- Date/time functions if testing time-sensitive logic
- lucide-react icon components to avoid rendering overhead

**What NOT to Mock:**
- React hooks (useState, useEffect, useCallback) - test behavior instead
- Tailwind CSS classes - unnecessary to mock
- Child components if testing integration
- DOM elements or user interactions - use React Testing Library utilities

## Fixtures and Factories

**Test Data (Recommended):**

Create factory functions in `src/__tests__/fixtures/`:
```typescript
// src/__tests__/fixtures/clients.ts
export const createMockClient = (overrides = {}): Client => ({
  id: '1',
  name: 'CoverMore',
  role: 'Interim CIO',
  status: 'active',
  weeklyRevenue: 8000,
  nextMeeting: 'Tomorrow, 2:00 PM',
  upcomingDeliverables: ['IT Strategy v3'],
  recentActivity: 'Completed integration roadmap',
  health: 92,
  ...overrides,
});

export const mockClients = [
  createMockClient({ id: '1' }),
  createMockClient({ id: '2', name: 'Guide Dogs NSW', status: 'active' }),
  createMockClient({ id: '3', name: 'ResMed', status: 'completing' }),
];

// src/__tests__/fixtures/meetings.ts
export const createMockMeeting = (overrides = {}): Meeting => ({
  id: 'meeting-1',
  title: 'CM: IT Strategy Review',
  client: 'CoverMore',
  date: new Date().toISOString(),
  duration: '1h 30m',
  attendees: ['John', 'Jane'],
  actionItems: [],
  summary: 'Discussed Q1 strategy',
  keyInsights: [],
  transcriptUrl: 'https://fireflies.ai/...',
  status: 'processed',
  ...overrides,
});
```

**Location:**
- Create `src/__tests__/fixtures/` directory
- One file per data type: `clients.ts`, `meetings.ts`, `tasks.ts`
- Export factory functions and mock arrays for reuse

**Usage in tests:**
```typescript
import { createMockClient, mockClients } from '@/__tests__/fixtures/clients';

it('should render all mock clients', () => {
  render(<ClientCommandCenter />);
  mockClients.forEach(client => {
    expect(screen.getByText(client.name)).toBeInTheDocument();
  });
});
```

## Coverage

**Requirements:**
- Not enforced in current project
- No coverage configuration in `package.json` or Next.js config

**Recommended Coverage Targets:**
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

**View Coverage (Recommended):**
```bash
# After implementing tests
npm test -- --coverage
```

## Test Types

**Unit Tests:**
- Scope: Individual functions and hooks
- Approach: Test helper functions in API routes (`extractClientFromTitle`, `formatDuration`, `getProjectType`)
- Example:
```typescript
describe('extractClientFromTitle', () => {
  it('should extract client name from title prefix', () => {
    expect(extractClientFromTitle('CM: IT Strategy Review')).toBe('CoverMore');
    expect(extractClientFromTitle('GD: Board Discussion')).toBe('Guide Dogs');
  });

  it('should return General for unknown prefix', () => {
    expect(extractClientFromTitle('Unknown: Meeting')).toBe('General');
  });
});
```

**Integration Tests:**
- Scope: Component with hooks and API calls
- Approach: Mock fetch, render component, verify state updates
- Example:
```typescript
it('should load and display meetings from API', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        meetings: mockMeetings,
        stats: { total: 2, thisWeek: 1, pendingReview: 0, totalActionItems: 3 },
      }),
    })
  );

  render(<MeetingIntelligence />);

  await waitFor(() => {
    expect(screen.getByText(mockMeetings[0].title)).toBeInTheDocument();
  });
});
```

**E2E Tests:**
- Framework: Not currently used
- Recommended: Playwright or Cypress for full-stack testing
- Scope: User workflows across components

## Common Patterns

**Async Testing (Recommended):**
```typescript
it('should handle async data loading', async () => {
  render(<MeetingIntelligence />);

  // Component makes fetch request on mount
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('/api/fireflies');
  });

  // Wait for data to render
  await waitFor(() => {
    expect(screen.getByText('Meeting Intelligence')).toBeInTheDocument();
  });
});

// or with userEvent for interactions
it('should refresh data on button click', async () => {
  const user = userEvent.setup();
  render(<MeetingIntelligence />);

  const refreshButton = screen.getByRole('button', { name: /refresh/i });
  await user.click(refreshButton);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
```

**Error Testing (Recommended):**
```typescript
it('should display error state when API fails', () => {
  global.fetch = jest.fn(() =>
    Promise.reject(new Error('API Error'))
  );

  render(<MeetingIntelligence />);

  waitFor(() => {
    expect(screen.getByText(/error loading meetings/i)).toBeInTheDocument();
  });
});

it('should call onError callback when error occurs', async () => {
  const onError = jest.fn();
  render(<MeetingIntelligence onError={onError} />);

  // Simulate API error
  global.fetch = jest.fn(() =>
    Promise.reject(new Error('Network Error'))
  );

  await waitFor(() => {
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });
});

it('should allow retry on error', async () => {
  const user = userEvent.setup();
  global.fetch = jest.fn().mockRejectedValueOnce(new Error('API Error'));

  render(<MeetingIntelligence />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  const retryButton = screen.getByRole('button', { name: /retry/i });
  await user.click(retryButton);

  expect(global.fetch).toHaveBeenCalledTimes(2);
});
```

## Testing Recommendations for Current Components

**Priority Test Areas:**

1. **`useRealtimeData` hook** (`src/app/hooks/useRealtimeData.ts`)
   - Test data fetching and state updates
   - Test error handling
   - Test refresh functionality
   - Test polling interval
   - Test TypeScript generic types

2. **API Routes** (`src/app/api/fireflies/route.ts`, `src/app/api/todoist/route.ts`)
   - Test successful API responses
   - Test error scenarios (missing API keys, network errors)
   - Test response transformation logic
   - Test helper functions

3. **Components** (`ClientCommandCenter`, `MeetingIntelligence`, `TaskMissionControl`)
   - Test filtering logic
   - Test modal/detail view open/close
   - Test data display from API
   - Test loading and error states
   - Test user interactions (clicks, selections)

---

*Testing analysis: 2026-02-24*
