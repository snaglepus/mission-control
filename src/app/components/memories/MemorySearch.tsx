"use client";

import { Search, CalendarRange, FileText, ArrowUpDown } from "lucide-react";
import { SortOption } from "./types";

interface MemorySearchProps {
  query: string;
  fromDate: string;
  toDate: string;
  sourceFile: string;
  sourceFiles: string[];
  sort: SortOption;
  onQueryChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onSourceFileChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
}

export default function MemorySearch(props: MemorySearchProps) {
  const {
    query,
    fromDate,
    toDate,
    sourceFile,
    sourceFiles,
    sort,
    onQueryChange,
    onFromDateChange,
    onToDateChange,
    onSourceFileChange,
    onSortChange,
  } = props;

  return (
    <div className="glass-card p-4 sm:p-5 space-y-4">
      <div className="relative">
        <Search className="w-5 h-5 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search memory titles and content..."
          className="w-full bg-[#1a0f00]/40 border border-amber-500/20 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <label className="glass-card px-3 py-2 flex items-center gap-2">
          <CalendarRange className="w-4 h-4 text-amber-400" />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="bg-transparent text-sm text-slate-200 w-full focus:outline-none"
            aria-label="Filter from date"
          />
        </label>

        <label className="glass-card px-3 py-2 flex items-center gap-2">
          <CalendarRange className="w-4 h-4 text-amber-400" />
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="bg-transparent text-sm text-slate-200 w-full focus:outline-none"
            aria-label="Filter to date"
          />
        </label>

        <label className="glass-card px-3 py-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <select
            value={sourceFile}
            onChange={(e) => onSourceFileChange(e.target.value)}
            className="bg-transparent text-sm text-slate-200 w-full focus:outline-none"
          >
            <option value="all" className="bg-slate-900">All sources</option>
            {sourceFiles.map((file) => (
              <option key={file} value={file} className="bg-slate-900">{file}</option>
            ))}
          </select>
        </label>

        <label className="glass-card px-3 py-2 flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-amber-400" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-transparent text-sm text-slate-200 w-full focus:outline-none"
          >
            <option value="date-desc" className="bg-slate-900">Newest first</option>
            <option value="date-asc" className="bg-slate-900">Oldest first</option>
            <option value="alpha-asc" className="bg-slate-900">A → Z</option>
            <option value="alpha-desc" className="bg-slate-900">Z → A</option>
          </select>
        </label>
      </div>
    </div>
  );
}
