"use client";

import { useMemo, useState } from "react";
import {
  Rocket,
  FolderTree,
  FileText,
  Cpu,
  Palette,
  Megaphone,
  ExternalLink,
  Layers,
} from "lucide-react";

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

export default function StartupsHub({ searchQuery = "" }: { searchQuery?: string }) {
  const [activeStartup, setActiveStartup] = useState<StartupId>("tablebooked");

  const filteredStartups = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return startups;

    return startups
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
  }, [searchQuery]);

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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
