"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Rocket,
  FolderTree,
  FileText,
  Cpu,
  Palette,
  Megaphone,
  ExternalLink,
  Layers,
  Globe,
  Code,
  ChevronRight,
} from "lucide-react";
import ArtifactContentViewer, {
  ArtifactFile,
  isHtml,
  isMarkdown,
} from "./artifacts/ArtifactContentViewer";

type StartupId = "tablebooked" | "cyberchaos" | "itfm";

interface StartupItem {
  title: string;
  category: "Research" | "Product" | "Architecture" | "Mockups" | "GTM";
  status: "ready" | "in-progress" | "planned";
  updated: string;
  notes: string;
  link?: string;
}

interface StartupConfig {
  id: StartupId;
  name: string;
  tagline: string;
  location: string;
  items: StartupItem[];
}

interface NightlyDate {
  date: string;
  files?: string[];
}

const startups: StartupConfig[] = [
  {
    id: "tablebooked",
    name: "TableBooked",
    tagline: "Restaurant discovery + booking intelligence",
    location: "STARTUPS/TableBooked/OLIVIA/",
    items: [
      {
        title: "MVP PRD",
        category: "Product",
        status: "ready",
        updated: "2026-03-04",
        notes: "Core user journeys, booking flow, and launch scope.",
      },
      {
        title: "Architecture Spec",
        category: "Architecture",
        status: "ready",
        updated: "2026-03-04",
        notes: "Stack, APIs, data model, and deployment baseline.",
      },
      {
        title: "Landing Prototype",
        category: "Mockups",
        status: "ready",
        updated: "2026-03-04",
        notes: "Clickable landing concept for positioning and validation.",
      },
      {
        title: "Go-to-Market Pack",
        category: "GTM",
        status: "planned",
        updated: "Planned",
        notes: "Pilot restaurants, launch messaging, and channel strategy.",
      },
    ],
  },
  {
    id: "cyberchaos",
    name: "CyberChaos",
    tagline: "Autonomous cyber resilience and red teaming",
    location: "STARTUPS/CyberChaos/OLIVIA/",
    items: [
      {
        title: "Deep Research",
        category: "Research",
        status: "ready",
        updated: "2026-03-06",
        notes: "PentAGI + HexStrike + market landscape synthesis.",
        link: "https://drive.google.com/file/d/1aDmnU-k9numE_E0GmHmeAW34F0T9WRcR/view",
      },
      {
        title: "Integration Analysis",
        category: "Architecture",
        status: "ready",
        updated: "2026-03-06",
        notes: "Hybrid engine strategy and implementation sequencing.",
        link: "https://drive.google.com/file/d/1amlUd0hV0_Do0D9NvJFRnm05o0iK3J6h/view",
      },
      {
        title: "PRD Draft",
        category: "Product",
        status: "ready",
        updated: "2026-03-06",
        notes: "Multi-tenant platform baseline and roadmap scope.",
        link: "https://drive.google.com/file/d/1RSGLG4nFgdFKAGby5J7GlGoUBRdWC5_0/view",
      },
      {
        title: "Shannon Service Analysis",
        category: "Research",
        status: "ready",
        updated: "2026-03-06",
        notes: "AI agent red-team service model and pricing envelope.",
        link: "https://drive.google.com/file/d/1fdGWnbIuQ2dcN3twVrNbvxsKlmvhxn5y/view",
      },
      {
        title: "Shannon MVP PRD + clickable mockup",
        category: "Mockups",
        status: "planned",
        updated: "Tonight 11:30 PM",
        notes: "Pending nightly build output.",
      },
    ],
  },
  {
    id: "itfm",
    name: "ITFM",
    tagline: "IT Value Dashboard / TBM-aligned ROI platform",
    location: "OLIVIA/Research/",
    items: [
      {
        title: "ITFM Opportunity Analysis",
        category: "Research",
        status: "ready",
        updated: "2026-03-06",
        notes: "Market sizing, competitors, pricing, and GTM options.",
        link: "https://drive.google.com/file/d/14JBDmcD7YIRcPiJAbwFe1VPEQQGQ4rtv/view",
      },
      {
        title: "MVP PRD (client-ready)",
        category: "Product",
        status: "planned",
        updated: "Tonight 11:30 PM",
        notes: "CoverMore/Guide Dogs pilot-friendly scope and sprint plan.",
      },
      {
        title: "TBM Framework Mapping",
        category: "Architecture",
        status: "planned",
        updated: "Tonight 11:30 PM",
        notes: "TBM taxonomy as product backbone and governance model.",
      },
      {
        title: "Clickable dashboard mockup",
        category: "Mockups",
        status: "planned",
        updated: "Tonight 11:30 PM",
        notes: "Interactive HTML prototype for MVP workflows.",
      },
    ],
  },
];

const categoryIcon = {
  Research: FileText,
  Product: Layers,
  Architecture: Cpu,
  Mockups: Palette,
  GTM: Megaphone,
};

function getFileIcon(name: string) {
  if (name.endsWith(".html") || name.endsWith(".htm")) return Globe;
  if (
    name.endsWith(".ts") ||
    name.endsWith(".tsx") ||
    name.endsWith(".js") ||
    name.endsWith(".py")
  )
    return Code;
  return FileText;
}

function formatFileSize(bytes: string | undefined): string {
  if (!bytes) return "";
  const b = parseInt(bytes, 10);
  if (Number.isNaN(b)) return "";
  if (b < 1024) return `${b}B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)}KB`;
  return `${(b / (1024 * 1024)).toFixed(1)}MB`;
}

export default function StartupsHub({ searchQuery = "" }: { searchQuery?: string }) {
  const [activeStartup, setActiveStartup] = useState<StartupId>("tablebooked");
  const [nightlyDates, setNightlyDates] = useState<NightlyDate[]>([]);
  const [startupFiles, setStartupFiles] = useState<Record<StartupId, ArtifactFile[]>>({
    tablebooked: [],
    cyberchaos: [],
    itfm: [],
  });
  const [selectedFile, setSelectedFile] = useState<ArtifactFile | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/nightly");
        const data = await res.json();
        setNightlyDates(data?.dates || []);
      } catch {
        setNightlyDates([]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/startups");
        const data = await res.json();
        setStartupFiles({
          tablebooked: data?.startups?.tablebooked || [],
          cyberchaos: data?.startups?.cyberchaos || [],
          itfm: data?.startups?.itfm || [],
        });
      } catch {
        setStartupFiles({ tablebooked: [], cyberchaos: [], itfm: [] });
      }
    })();
  }, []);

  useEffect(() => {
    setSelectedFile(null);
    setFileContent(null);
  }, [activeStartup]);

  const startupsWithLiveStatus = useMemo(() => {
    if (!nightlyDates.length) return startups;

    const allFiles = new Set(
      nightlyDates.flatMap((d) => d.files || []).map((f) => f.toLowerCase())
    );

    const hasItfmPrd = allFiles.has("itfm-mvp-prd.md");
    const hasItfmMockup = allFiles.has("itfm-mvp-mockup.html");
    const hasShannonPrd = allFiles.has("shannon-redteam-mvp-prd.md");
    const hasShannonMockup = allFiles.has("shannon-redteam-mvp-mockup.html");

    return startups.map((startup) => {
      if (startup.id === "cyberchaos") {
        return {
          ...startup,
          items: startup.items.map((item) => {
            if (item.title === "Shannon MVP PRD + clickable mockup") {
              if (hasShannonPrd && hasShannonMockup) {
                return {
                  ...item,
                  status: "ready" as const,
                  updated: "Latest nightly",
                  notes: "Auto-detected from nightly outputs: PRD + clickable mockup present.",
                };
              }
              if (hasShannonPrd || hasShannonMockup) {
                return {
                  ...item,
                  status: "in-progress" as const,
                  updated: "Partial output detected",
                  notes: "Nightly produced partial Shannon artifacts. Missing one deliverable.",
                };
              }
            }
            return item;
          }),
        };
      }

      if (startup.id === "itfm") {
        return {
          ...startup,
          items: startup.items.map((item) => {
            if (item.title === "MVP PRD (client-ready)" && hasItfmPrd) {
              return {
                ...item,
                status: "ready" as const,
                updated: "Latest nightly",
                notes: "Auto-detected from nightly outputs.",
              };
            }

            if (item.title === "TBM Framework Mapping") {
              if (hasItfmPrd) {
                return {
                  ...item,
                  status: "ready" as const,
                  updated: "Included in ITFM MVP PRD",
                  notes: "TBM framework section detected as part of ITFM MVP PRD deliverable.",
                };
              }
            }

            if (item.title === "Clickable dashboard mockup" && hasItfmMockup) {
              return {
                ...item,
                status: "ready" as const,
                updated: "Latest nightly",
                notes: "Auto-detected from nightly outputs.",
              };
            }

            return item;
          }),
        };
      }

      return startup;
    });
  }, [nightlyDates]);

  async function openArtifact(file: ArtifactFile) {
    if (isHtml(file)) {
      window.open(`/api/nightly/render?fileId=${file.id}&type=html`, "_blank");
      return;
    }

    setLoadingContent(true);
    setSelectedFile(file);
    try {
      const res = await fetch(`/api/nightly?fileId=${file.id}`);
      const data = await res.json();
      setFileContent(data.content || "Unable to load content");
    } catch {
      setFileContent("Failed to load file content");
    }
    setLoadingContent(false);
  }

  const filteredStartups = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return startupsWithLiveStatus;

    return startupsWithLiveStatus
      .map((startup) => ({
        ...startup,
        items: startup.items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.notes.toLowerCase().includes(q) ||
            item.updated.toLowerCase().includes(q) ||
            startup.name.toLowerCase().includes(q) ||
            startup.tagline.toLowerCase().includes(q)
        ),
      }))
      .filter((s) => s.items.length > 0 || s.name.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q));
  }, [searchQuery, startupsWithLiveStatus]);

  const active =
    filteredStartups.find((s) => s.id === activeStartup) || filteredStartups[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          <Rocket className="w-7 h-7 text-amber-400" />
          Startups
        </h1>
        <p className="text-slate-400 mt-1">
          Structured workspace for startup execution across research, product, architecture, mockups, and GTM.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-1 space-y-3">
          {filteredStartups.map((startup) => (
            <button
              key={startup.id}
              onClick={() => setActiveStartup(startup.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                active?.id === startup.id
                  ? "bg-amber-500/10 border-amber-500/30"
                  : "bg-slate-800/30 border-slate-700/50 hover:border-amber-500/20"
              }`}
            >
              <div className="text-slate-100 font-semibold">{startup.name}</div>
              <div className="text-xs text-slate-400 mt-1">{startup.tagline}</div>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <FolderTree className="w-3 h-3" />
                {startup.location}
              </div>
            </button>
          ))}
        </div>

        <div className="xl:col-span-3">
          {!active ? (
            <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 p-10 text-center text-slate-500">
              No startups match &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-slate-100">{active.name}</h2>
                <p className="text-sm text-slate-400 mt-1">{active.tagline}</p>
              </div>

              <div className="grid gap-3">
                {active.items.map((item) => {
                  const Icon = categoryIcon[item.category];
                  const statusClass =
                    item.status === "ready"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : item.status === "in-progress"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-slate-700/50 text-slate-300 border-slate-600/50";

                  return (
                    <div
                      key={`${active.id}-${item.title}`}
                      className="rounded-xl border border-slate-700/50 bg-slate-900/20 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-amber-300" />
                          </div>
                          <div>
                            <div className="text-slate-100 font-medium">{item.title}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{item.category} • {item.updated}</div>
                            <p className="text-sm text-slate-300 mt-2">{item.notes}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full border ${statusClass}`}>
                            {item.status}
                          </span>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2 py-1 rounded-md bg-slate-700/50 text-amber-300 hover:text-amber-200 border border-slate-600/50 flex items-center gap-1"
                            >
                              Open <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <h3 className="text-sm uppercase tracking-wide text-slate-400 mb-3">
                  Artifacts (Markdown + HTML)
                </h3>
                <div className="grid gap-2">
                  {(startupFiles[active.id] || []).length === 0 && (
                    <div className="text-sm text-slate-500">No markdown/html artifacts discovered yet.</div>
                  )}
                  {(startupFiles[active.id] || []).map((file) => {
                    const Icon = getFileIcon(file.name);
                    const html = isHtml(file);
                    return (
                      <button
                        key={file.id}
                        onClick={() => openArtifact(file)}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-700/40 hover:border-amber-500/30 transition-all"
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-amber-300" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-100">{file.name}</div>
                            <div className="text-xs text-slate-400">
                              {file.modifiedTime && (
                                <span>
                                  {new Date(file.modifiedTime).toLocaleString("en-AU", {
                                    timeZone: "Australia/Sydney",
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                  {" • "}
                                </span>
                              )}
                              {formatFileSize(file.size)}{file.size ? " • " : ""}{html ? "Opens in new tab" : isMarkdown(file) ? "Inline markdown view" : ""}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <ArtifactContentViewer
                  selectedFile={selectedFile}
                  fileContent={fileContent}
                  loadingContent={loadingContent}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
