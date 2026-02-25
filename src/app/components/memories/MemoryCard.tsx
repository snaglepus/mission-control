"use client";

import { File, Calendar, ChevronRight } from "lucide-react";
import { MemoryItem } from "./types";

interface MemoryCardProps {
  memory: MemoryItem;
  query: string;
  onOpen: (memory: MemoryItem) => void;
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "ig"));

  return parts.map((part, idx) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={`${part}-${idx}`} className="bg-amber-400/40 text-amber-100 rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${idx}`}>{part}</span>
    )
  );
}

export default function MemoryCard({ memory, query, onOpen }: MemoryCardProps) {
  return (
    <button
      onClick={() => onOpen(memory)}
      className="glass-card p-4 sm:p-5 text-left hover-lift w-full group transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
            {highlight(memory.title, query)}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {memory.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1">
              <File className="w-3.5 h-3.5 text-amber-400" />
              {memory.sourceFile}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400" />
      </div>

      <p className="text-slate-300 text-sm mt-3 leading-relaxed max-h-24 overflow-hidden">
        {highlight(memory.preview, query)}
        {memory.content.length > memory.preview.length ? "..." : ""}
      </p>

      {memory.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {memory.tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
