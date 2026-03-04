"use client";

import { useState, useEffect } from "react";
import {
  Moon,
  ChevronRight,
  FileText,
  Code,
  Globe,
  ArrowLeft,
  ExternalLink,
  Loader2,
  Calendar,
  Package,
} from "lucide-react";

interface DateEntry {
  date: string;
  id: string;
  modified: string;
}

interface NightlyFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
}

function getFileIcon(name: string) {
  if (name.endsWith(".html") || name.endsWith(".htm")) return Globe;
  if (name.endsWith(".ts") || name.endsWith(".tsx") || name.endsWith(".js") || name.endsWith(".py")) return Code;
  return FileText;
}

function formatFileSize(bytes: string | undefined): string {
  if (!bytes) return "";
  const b = parseInt(bytes);
  if (b < 1024) return `${b}B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)}KB`;
  return `${(b / (1024 * 1024)).toFixed(1)}MB`;
}

export default function NightlyBuilds() {
  const [dates, setDates] = useState<DateEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [files, setFiles] = useState<NightlyFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<NightlyFile | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    fetchDates();
  }, []);

  async function fetchDates() {
    setLoading(true);
    try {
      const res = await fetch("/api/nightly", { cache: "no-store" });
      const data = await res.json();
      setDates(data.dates || []);
    } catch {
      console.error("Failed to fetch nightly dates");
    }
    setLoading(false);
  }

  async function fetchFiles(date: string) {
    setLoadingFiles(true);
    setSelectedDate(date);
    setSelectedFile(null);
    setFileContent(null);
    try {
      const res = await fetch(`/api/nightly?date=${date}`, { cache: "no-store" });
      const data = await res.json();
      setFiles(data.files || []);
    } catch {
      console.error("Failed to fetch files");
    }
    setLoadingFiles(false);
  }

  async function fetchFileContent(file: NightlyFile) {
    setLoadingContent(true);
    setSelectedFile(file);
    try {
      const res = await fetch(`/api/nightly?fileId=${file.id}`, { cache: "no-store" });
      const data = await res.json();
      setFileContent(data.content || "Unable to load content");
    } catch {
      setFileContent("Failed to load file content");
    }
    setLoadingContent(false);
  }

  function goBack() {
    if (selectedFile) {
      setSelectedFile(null);
      setFileContent(null);
    } else if (selectedDate) {
      setSelectedDate(null);
      setFiles([]);
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {(selectedDate || selectedFile) && (
          <button
            onClick={goBack}
            className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-200 to-orange-400 bg-clip-text text-transparent flex items-center gap-3">
            <Moon className="w-7 h-7 text-amber-400" />
            Nightly Builds
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {selectedFile
              ? selectedFile.name
              : selectedDate
              ? `Build artifacts for ${selectedDate}`
              : "Autonomous overnight work — reviewed each morning"}
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      )}

      {/* Date list */}
      {!loading && !selectedDate && (
        <div className="grid gap-3">
          {dates.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              No nightly builds yet. First build runs at 11:30 PM AEDT.
            </div>
          )}
          {dates.map((entry) => (
            <button
              key={entry.date}
              onClick={() => fetchFiles(entry.date)}
              className="flex items-center justify-between p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-semibold text-slate-100">
                    {entry.date}
                  </div>
                  <div className="text-sm text-slate-400">
                    {new Date(entry.modified).toLocaleString("en-AU", {
                      timeZone: "Australia/Sydney",
                    })}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </button>
          ))}
        </div>
      )}

      {/* File list */}
      {selectedDate && !selectedFile && (
        <div className="grid gap-3">
          {loadingFiles ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              No files found for this date.
            </div>
          ) : (
            files.map((file) => {
              const Icon = getFileIcon(file.name);
              return (
                <button
                  key={file.id}
                  onClick={() => fetchFileContent(file)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-100">
                        {file.name}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        {formatFileSize(file.size)}
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Drive
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </button>
              );
            })
          )}
        </div>
      )}

      {/* File content viewer */}
      {selectedFile && (
        <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-amber-400" />
              <span className="font-medium">{selectedFile.name}</span>
            </div>
            {selectedFile.webViewLink && (
              <a
                href={selectedFile.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Open in Drive <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="p-6 overflow-auto max-h-[70vh]">
            {loadingContent ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed">
                {fileContent}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
