"use client";

import { X, Calendar, File, BookText } from "lucide-react";
import { MemoryItem } from "./types";

interface MemoryDetailProps {
  memory: MemoryItem | null;
  query: string;
  onClose: () => void;
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

export default function MemoryDetail({ memory, query, onClose }: MemoryDetailProps) {
  if (!memory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 sm:p-8" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl mx-auto h-full glass-card flex flex-col overflow-hidden animate-[fadeIn_200ms_ease-out]"
      >
        <div className="p-4 sm:p-6 border-b border-amber-500/20 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{highlight(memory.title, query)}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4 text-amber-400" />
                {memory.dateLabel}
              </span>
              <span className="inline-flex items-center gap-1">
                <File className="w-4 h-4 text-amber-400" />
                {memory.sourceFile}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-auto">
          {memory.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {memory.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="glass-card p-4 sm:p-6 border border-amber-500/10">
            <h3 className="text-sm uppercase tracking-wide text-amber-400 mb-3 inline-flex items-center gap-2">
              <BookText className="w-4 h-4" />
              Full memory
            </h3>
            <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
              {highlight(memory.content, query)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
