"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink, Loader2, Package } from "lucide-react";

export interface ArtifactFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
}

export function isMarkdown(file: ArtifactFile): boolean {
  return (
    file.name.endsWith(".md") ||
    file.name.endsWith(".markdown") ||
    file.mimeType === "text/markdown"
  );
}

export function isHtml(file: ArtifactFile): boolean {
  return (
    file.name.endsWith(".html") ||
    file.name.endsWith(".htm") ||
    file.mimeType === "text/html"
  );
}

export default function ArtifactContentViewer({
  selectedFile,
  fileContent,
  loadingContent,
}: {
  selectedFile: ArtifactFile | null;
  fileContent: string | null;
  loadingContent: boolean;
}) {
  if (!selectedFile) return null;

  return (
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
        ) : isMarkdown(selectedFile) ? (
          <div className="nightly-prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {fileContent || ""}
            </ReactMarkdown>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed">
            {fileContent}
          </pre>
        )}
      </div>
    </div>
  );
}
