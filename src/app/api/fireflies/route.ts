import { NextResponse } from 'next/server';

const FIREFLIES_API_KEY = process.env.FIREFLIES_API_KEY;

const FIREFLIES_QUERY = `
  query {
    transcripts(limit: 20) {
      id
      title
      date
      duration
      participants
    }
  }
`;

interface FirefliesTranscript {
  id: string;
  title: string;
  date: number; // Unix timestamp in milliseconds
  duration: number;
  participants?: string[];
}

interface Meeting {
  id: string;
  title: string;
  client: string;
  date: string;
  duration: string;
  attendees: string[];
  actionItems: Array<{
    id: string;
    text: string;
    assignee: string;
    completed: boolean;
    priority: "high" | "medium" | "low";
  }>;
  summary: string;
  keyInsights: string[];
  transcriptUrl: string;
  status: "processed" | "pending" | "review";
}

export async function GET() {
  if (!FIREFLIES_API_KEY) {
    return NextResponse.json(
      { error: 'FIREFLIES_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch('https://api.fireflies.ai/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIREFLIES_API_KEY}`,
      },
      body: JSON.stringify({ query: FIREFLIES_QUERY }),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Fireflies API error response:', responseData);
      throw new Error(`Fireflies API error: ${response.status}`);
    }

    if (responseData.errors) {
      console.error('Fireflies GraphQL errors:', responseData.errors);
      throw new Error(responseData.errors[0]?.message || 'GraphQL error');
    }

    const transcripts: FirefliesTranscript[] = responseData.data?.transcripts || [];

    const meetings: Meeting[] = transcripts.map((t) => ({
      id: t.id,
      title: t.title,
      client: extractClientFromTitle(t.title),
      date: new Date(t.date).toISOString(), // Convert timestamp to ISO string
      duration: formatDuration(t.duration),
      attendees: t.participants || [],
      actionItems: [],
      summary: 'View transcript for details',
      keyInsights: [],
      transcriptUrl: `https://app.fireflies.ai/view/${t.id}`,
      status: 'processed' as const,
    }));

    const stats = {
      total: meetings.length,
      thisWeek: meetings.filter((m) => isThisWeek(m.date)).length,
      pendingReview: 0,
      totalActionItems: 0,
    };

    return NextResponse.json({ meetings, stats });
  } catch (error) {
    console.error('Fireflies API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch meetings', meetings: [], stats: {} },
      { status: 500 }
    );
  }
}

function extractClientFromTitle(title: string): string {
  const prefixes: Record<string, string> = {
    'CM': 'CoverMore',
    'GD': 'Guide Dogs',
    'RM': 'ResMed',
    'AB': 'Aussie Broadband',
    'NC': 'NewsCorp',
  };
  
  const prefix = title.split(' ')[0];
  return prefixes[prefix] || 'General';
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

function isThisWeek(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return date >= weekAgo && date <= now;
}
