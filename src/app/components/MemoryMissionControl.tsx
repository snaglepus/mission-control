"use client";

import { useCallback, useMemo, useState } from "react";
import { Brain, Loader2, RefreshCw } from "lucide-react";
import { useMemoriesData } from "../hooks/useRealtimeData";
import MemorySearch from "./memories/MemorySearch";
import MemoryList from "./memories/MemoryList";
import MemoryDetail from "./memories/MemoryDetail";
import { MemoryItem, SortOption } from "./memories/types";

function sortMemories(memories: MemoryItem[], sort: SortOption) {
  const sorted = [...memories];
  if (sort === "date-desc") return sorted.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  if (sort === "date-asc") return sorted.sort((a, b) => +new Date(a.date) - +new Date(b.date));
  if (sort === "alpha-asc") return sorted.sort((a, b) => a.title.localeCompare(b.title));
  return sorted.sort((a, b) => b.title.localeCompare(a.title));
}

function getMemoryDateKey(memory: MemoryItem): string {
  const sourceDate = memory.sourceFile.match(/(\d{4}-\d{2}-\d{2})/)?.[1];
  if (sourceDate) return sourceDate;

  const parsed = new Date(memory.date);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return "";
}

export default function MemoryMissionControl() {
  const { data, loading, error, refresh, lastUpdated } = useMemoriesData();

  const [query, setQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sourceFile, setSourceFile] = useState("all");
  const [sourceDate, setSourceDate] = useState("");
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);

  const memories = useMemo(() => (data?.memories || []) as MemoryItem[], [data?.memories]);
  const sourceFiles = useMemo(() => data?.meta.sourceFiles ?? [], [data?.meta.sourceFiles]);

  const sourceFileSet = useMemo(() => new Set(sourceFiles), [sourceFiles]);

  const handleSourceDateChange = useCallback(
    (value: string) => {
      setSourceDate(value);

      if (!value) {
        return;
      }

      const targetDailyFile = `memory/${value}.md`;
      if (sourceFileSet.has(targetDailyFile)) {
        setSourceFile(targetDailyFile);
      } else {
        setSourceFile("all");
      }
    },
    [sourceFileSet]
  );

  const handleSourceFileChange = useCallback((value: string) => {
    setSourceFile(value);
    const selectedDate = value.match(/memory\/(\d{4}-\d{2}-\d{2})\.md/)?.[1] ?? "";
    setSourceDate(selectedDate);
  }, []);

  const filteredMemories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = memories.filter((memory) => {
      const inQuery =
        !normalizedQuery ||
        [memory.title, memory.content, memory.tags.join(" "), memory.sourceFile]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const inSource = sourceFile === "all" || memory.sourceFile === sourceFile;

      const memoryDateKey = getMemoryDateKey(memory);
      const fromOk = !fromDate || (!!memoryDateKey && memoryDateKey >= fromDate);
      const toOk = !toDate || (!!memoryDateKey && memoryDateKey <= toDate);

      return inQuery && inSource && fromOk && toOk;
    });

    return sortMemories(filtered, sort);
  }, [memories, query, sourceFile, fromDate, toDate, sort]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Memory <span className="gradient-text">Browser</span>
          </h1>
          <p className="text-slate-400">
            Explore long-term and daily memories from your workspace.
            {lastUpdated && <span className="ml-2 text-slate-500">Updated {lastUpdated.toLocaleTimeString()}</span>}
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="self-start sm:self-auto p-3 rounded-xl glass-card text-slate-400 hover:text-amber-400 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-slate-400 text-sm">Total Entries</p>
          <p className="text-2xl font-bold text-white">{data?.meta.total ?? 0}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-slate-400 text-sm">Source Files</p>
          <p className="text-2xl font-bold text-white">{data?.meta.sourceFiles.length ?? 0}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-slate-400 text-sm">Visible</p>
          <p className="text-2xl font-bold text-white">{filteredMemories.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-slate-400 text-sm">Mode</p>
          <p className="text-lg font-semibold text-amber-300">Search + Filter</p>
        </div>
      </div>

      <MemorySearch
        query={query}
        fromDate={fromDate}
        toDate={toDate}
        sourceFile={sourceFile}
        sourceFiles={sourceFiles}
        sourceDate={sourceDate}
        sort={sort}
        onQueryChange={setQuery}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onSourceFileChange={handleSourceFileChange}
        onSourceDateChange={handleSourceDateChange}
        onSortChange={setSort}
      />

      {error ? (
        <div className="glass-card p-8 border-red-500/30">
          <p className="text-red-400 font-medium">Failed to load memories</p>
          <p className="text-slate-400 text-sm mt-2">{error.message}</p>
        </div>
      ) : loading && memories.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-300">Indexing memories...</p>
        </div>
      ) : (
        <MemoryList memories={filteredMemories} query={query} onOpen={setSelectedMemory} />
      )}

      <MemoryDetail memory={selectedMemory} query={query} onClose={() => setSelectedMemory(null)} />

      <div className="glass-card p-4 flex items-center gap-3 text-sm text-slate-400">
        <Brain className="w-4 h-4 text-amber-400" />
        Data source: <code className="text-amber-300">MEMORY.md</code> + <code className="text-amber-300">memory/*.md</code>
      </div>
    </div>
  );
}
