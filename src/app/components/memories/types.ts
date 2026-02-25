export interface MemoryItem {
  id: string;
  title: string;
  content: string;
  preview: string;
  tags: string[];
  sourceFile: string;
  sourceType: "long-term" | "daily";
  date: string;
  dateLabel: string;
}

export type SortOption = "date-desc" | "date-asc" | "alpha-asc" | "alpha-desc";
