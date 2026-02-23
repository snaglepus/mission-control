import { NextResponse } from 'next/server';

const TODOIST_API_TOKEN = process.env.TODOIST_API_TOKEN;

interface TodoistTask {
  id: string;
  content: string;
  description?: string;
  project_id: string;
  priority?: number;
  labels?: string[];
  due?: { date?: string };
  is_completed?: boolean;
}

interface TransformedTask {
  id: string;
  content: string;
  description: string;
  project: 'min' | 'hour' | 'day' | 'inbox';
  priority: number;
  labels: string[];
  dueDate: string | null;
  completed: boolean;
  isOliviaTask: boolean;
  client?: string;
}

export async function GET() {
  if (!TODOIST_API_TOKEN) {
    return NextResponse.json(
      { error: 'TODOIST_API_TOKEN not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch('https://api.todoist.com/api/v1/tasks', {
      headers: {
        'Authorization': `Bearer ${TODOIST_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Todoist API error: ${response.status}`);
    }

    const data = await response.json();
    const tasks: TodoistTask[] = data.results || [];

    const transformedTasks: TransformedTask[] = tasks.map((task) => ({
      id: task.id,
      content: task.content,
      description: task.description || '',
      project: getProjectType(task.project_id),
      priority: task.priority || 4,
      labels: task.labels || [],
      dueDate: task.due?.date || null,
      completed: task.is_completed || false,
      isOliviaTask: (task.labels || []).includes('Olivia'),
      client: extractClientFromLabels(task.labels),
    }));

    const stats = {
      total: transformedTasks.filter((t) => !t.completed).length,
      p1: transformedTasks.filter((t) => t.priority === 1 && !t.completed).length,
      olivia: transformedTasks.filter((t) => t.isOliviaTask && !t.completed).length,
      today: transformedTasks.filter((t) => 
        t.dueDate === new Date().toISOString().split('T')[0] && !t.completed
      ).length,
      min: transformedTasks.filter((t) => t.project === 'min' && !t.completed).length,
      hour: transformedTasks.filter((t) => t.project === 'hour' && !t.completed).length,
      day: transformedTasks.filter((t) => t.project === 'day' && !t.completed).length,
    };

    return NextResponse.json({ tasks: transformedTasks, stats });
  } catch (error) {
    console.error('Todoist API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks', tasks: [], stats: {} },
      { status: 500 }
    );
  }
}

function getProjectType(projectId: string): 'min' | 'hour' | 'day' | 'inbox' {
  const projectMap: Record<string, 'min' | 'hour' | 'day' | 'inbox'> = {
    '6CrgHpjHJ8WPfx5P': 'day',
    '6CrgHpjHJR7WMWVP': 'hour',
    '6W3C6v6Mj5j29c7w': 'min',
  };
  return projectMap[projectId] || 'inbox';
}

function extractClientFromLabels(labels: string[] = []): string | undefined {
  const clientLabels = ['@CoverMore', '@GuideDogs', '@ResMed', '@AussieBroadband', '@Innovatus'];
  const found = labels.find(l => clientLabels.includes(l));
  return found ? found.replace('@', '') : undefined;
}
