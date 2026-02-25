import fs from "fs/promises";
import path from "path";

export type MemorySourceType = "long-term" | "daily";

export interface MemoryEntry {
  id: string;
  title: string;
  content: string;
  preview: string;
  tags: string[];
  sourceFile: string;
  sourceType: MemorySourceType;
  date: string;
  dateLabel: string;
}

export interface MemoriesResponse {
  memories: MemoryEntry[];
  meta: {
    total: number;
    sourceFiles: string[];
    newestDate?: string;
    oldestDate?: string;
  };
}

const WORKSPACE_ROOT = path.resolve(process.cwd(), "..", "..");
const MAIN_MEMORY_FILE = path.join(WORKSPACE_ROOT, "MEMORY.md");
const DAILY_MEMORY_DIR = path.join(WORKSPACE_ROOT, "memory");

export async function loadMemories(): Promise<MemoriesResponse> {
  const entries: MemoryEntry[] = [];

  const mainMemory = await safeReadFile(MAIN_MEMORY_FILE);
  if (mainMemory) {
    entries.push(...parseMemoryFile(mainMemory, "MEMORY.md", "long-term"));
  }

  const dailyFiles = await safeReadDir(DAILY_MEMORY_DIR);
  for (const file of dailyFiles.filter((name) => name.endsWith(".md"))) {
    const content = await safeReadFile(path.join(DAILY_MEMORY_DIR, file));
    if (!content) continue;
    entries.push(...parseMemoryFile(content, `memory/${file}`, "daily"));
  }

  const sorted = entries.sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.title.localeCompare(b.title);
  });

  const sourceFiles = Array.from(new Set(sorted.map((entry) => entry.sourceFile)));

  return {
    memories: sorted,
    meta: {
      total: sorted.length,
      sourceFiles,
      newestDate: sorted[0]?.date,
      oldestDate: sorted[sorted.length - 1]?.date,
    },
  };
}

function parseMemoryFile(content: string, sourceFile: string, sourceType: MemorySourceType): MemoryEntry[] {
  const sections = splitByHeadings(content);
  const fallbackDate = inferDate(sourceFile, content);

  if (sections.length === 0) {
    const tags = extractTags(content);
    return [
      buildMemoryEntry({
        sourceFile,
        sourceType,
        date: fallbackDate,
        title: sourceFile,
        content,
        tags,
        sectionIndex: 0,
      }),
    ];
  }

  return sections
    .map((section, index) => {
      const tags = extractTags(section.body);
      const sectionDate = inferDate(sourceFile, section.body) || fallbackDate;

      return buildMemoryEntry({
        sourceFile,
        sourceType,
        date: sectionDate,
        title: section.title,
        content: section.body,
        tags,
        sectionIndex: index,
      });
    })
    .filter((entry) => entry.content.length > 0);
}

function buildMemoryEntry({
  sourceFile,
  sourceType,
  date,
  title,
  content,
  tags,
  sectionIndex,
}: {
  sourceFile: string;
  sourceType: MemorySourceType;
  date: string;
  title: string;
  content: string;
  tags: string[];
  sectionIndex: number;
}): MemoryEntry {
  const normalizedContent = content.replace(/\n{3,}/g, "\n\n").trim();

  return {
    id: `${sourceFile}-${sectionIndex}-${slugify(title).slice(0, 32)}`,
    title: title.trim() || "Untitled memory",
    content: normalizedContent,
    preview: normalizedContent.slice(0, 220),
    tags,
    sourceFile,
    sourceType,
    date,
    dateLabel: new Date(date).toLocaleDateString("en-AU", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
}

function splitByHeadings(content: string): Array<{ title: string; body: string }> {
  const headingRegex = /^##+\s+(.+)$/gm;
  const headings: Array<{ title: string; index: number }> = [];

  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({ title: match[1].trim(), index: match.index });
  }

  if (!headings.length) return [];

  return headings.map((heading, index) => {
    const start = heading.index + content.slice(heading.index).indexOf("\n") + 1;
    const end = headings[index + 1]?.index ?? content.length;
    const body = content.slice(start, end).trim();

    return { title: heading.title, body };
  });
}

function inferDate(sourceFile: string, content: string): string {
  const filenameDate = sourceFile.match(/(\d{4}-\d{2}-\d{2})/);
  if (filenameDate) return `${filenameDate[1]}T00:00:00.000Z`;

  const headingDate = content.match(
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/i
  );
  if (headingDate) {
    const parsed = new Date(headingDate[0]);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }

  return new Date().toISOString();
}

function extractTags(text: string): string[] {
  const tags = new Set<string>();

  const hashMatches = text.match(/(^|\s)#([a-zA-Z0-9_-]+)/g) || [];
  hashMatches.forEach((matchText) => {
    const clean = matchText.trim().replace(/^#/, "").toLowerCase();
    if (clean) tags.add(clean);
  });

  const labelLine = text.match(/(?:^|\n)(?:tags?|categories?)\s*:\s*(.+)$/im);
  if (labelLine?.[1]) {
    labelLine[1]
      .split(/[|,]/)
      .map((v) => v.trim().replace(/^#/, "").toLowerCase())
      .filter(Boolean)
      .forEach((tag) => tags.add(tag));
  }

  return Array.from(tags);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function safeReadFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

async function safeReadDir(dirPath: string): Promise<string[]> {
  try {
    return await fs.readdir(dirPath);
  } catch {
    return [];
  }
}
