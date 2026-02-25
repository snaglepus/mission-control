"use client";

import MemoryCard from "./MemoryCard";
import { MemoryItem } from "./types";
import { Brain, SearchX } from "lucide-react";

interface MemoryListProps {
  memories: MemoryItem[];
  query: string;
  onOpen: (memory: MemoryItem) => void;
}

export default function MemoryList({ memories, query, onOpen }: MemoryListProps) {
  if (memories.length === 0) {
    return (
      <div className="glass-card p-8 sm:p-14 text-center">
        {query ? (
          <SearchX className="w-14 h-14 mx-auto text-slate-500 mb-4" />
        ) : (
          <Brain className="w-14 h-14 mx-auto text-slate-500 mb-4" />
        )}
        <h3 className="text-lg font-semibold text-white mb-2">
          {query ? "No memories match your search" : "No memories found"}
        </h3>
        <p className="text-slate-400">
          {query
            ? "Try different keywords, sources, or date filters."
            : "Start writing in MEMORY.md or daily memory files to populate this view."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
      {memories.map((memory) => (
        <MemoryCard key={memory.id} memory={memory} query={query} onOpen={onOpen} />
      ))}
    </div>
  );
}
