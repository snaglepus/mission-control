"use client";

import { useState, useEffect, useCallback } from 'react';

interface UseRealtimeDataOptions {
  refreshInterval?: number;
  onError?: (error: Error) => void;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  [key: string]: unknown;
}

export function useRealtimeData<T>(
  endpoint: string,
  options: UseRealtimeDataOptions = {}
) {
  const { refreshInterval = 30000, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json() as ApiResponse<T>;
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setData(result as T);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const intervalId = setInterval(fetchData, refreshInterval);
    return () => clearInterval(intervalId);
  }, [fetchData, refreshInterval]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return { data, loading, error, lastUpdated, refresh };
}

// Todoist response type
export interface TodoistResponse {
  tasks: Array<{
    id: string;
    content: string;
    description?: string;
    project: "min" | "hour" | "day" | "inbox";
    priority: number;
    labels: string[];
    dueDate?: string;
    completed: boolean;
    isOliviaTask: boolean;
    client?: string;
  }>;
  stats: {
    total: number;
    p1: number;
    olivia: number;
    today: number;
    min: number;
    hour: number;
    day: number;
  };
}

// Fireflies response type
export interface FirefliesResponse {
  meetings: Array<{
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
  }>;
  stats: {
    total: number;
    thisWeek: number;
    pendingReview: number;
    totalActionItems: number;
  };
}

export function useTodoistData() {
  return useRealtimeData<TodoistResponse>('/api/todoist', { refreshInterval: 30000 });
}

export function useFirefliesData() {
  return useRealtimeData<FirefliesResponse>('/api/fireflies', { refreshInterval: 30000 });
}

export interface MemoriesResponse {
  memories: Array<{
    id: string;
    title: string;
    content: string;
    preview: string;
    tags: string[];
    sourceFile: string;
    sourceType: "long-term" | "daily";
    date: string;
    dateLabel: string;
  }>;
  meta: {
    total: number;
    sourceFiles: string[];
    newestDate?: string;
    oldestDate?: string;
  };
}

export function useMemoriesData() {
  return useRealtimeData<MemoriesResponse>('/api/memories', { refreshInterval: 60000 });
}
