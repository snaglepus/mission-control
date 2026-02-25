"use client";

import { useState } from "react";
import {
  Building2,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreVertical,
  Plus,
  Filter,
  Search,
  ArrowUpRight,
  Wallet,
  Activity,
  Briefcase
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  role: string;
  status: "active" | "at-risk" | "completing" | "prospective";
  weeklyRevenue: number;
  nextMeeting: string;
  upcomingDeliverables: string[];
  recentActivity: string;
  health: number;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "CoverMore",
    role: "Interim CIO",
    status: "active",
    weeklyRevenue: 8000,
    nextMeeting: "Tomorrow, 2:00 PM",
    upcomingDeliverables: ["IT Strategy v3", "Board Presentation", "Cybersecurity Review"],
    recentActivity: "Completed integration roadmap",
    health: 92,
  },
  {
    id: "2",
    name: "Guide Dogs NSW",
    role: "Fractional CIO",
    status: "active",
    weeklyRevenue: 6500,
    nextMeeting: "Thursday, 10:00 AM",
    upcomingDeliverables: ["Salesforce Business Case", "Board Paper v2"],
    recentActivity: "Submitted IT Services tender response",
    health: 88,
  },
  {
    id: "3",
    name: "ResMed",
    role: "Data Strategy Consultant",
    status: "completing",
    weeklyRevenue: 2500,
    nextMeeting: "Next Monday, 3:00 PM",
    upcomingDeliverables: ["Phase 2 Recommendations", "Data Governance Framework"],
    recentActivity: "Final report delivered",
    health: 75,
  },
  {
    id: "4",
    name: "Aussie Broadband",
    role: "Prospective",
    status: "prospective",
    weeklyRevenue: 0,
    nextMeeting: "Negotiating SOW",
    upcomingDeliverables: ["Proposal Draft", "Pricing Model"],
    recentActivity: "Proposal submitted - awaiting feedback",
    health: 60,
  },
  {
    id: "5",
    name: "Innovatus",
    role: "Delinea & Zoom Kytek",
    status: "active",
    weeklyRevenue: 3000,
    nextMeeting: "Friday, 11:00 AM",
    upcomingDeliverables: ["Security Assessment", "Vendor Timeline"],
    recentActivity: "Delinea implementation progressing",
    health: 85,
  },
  {
    id: "6",
    name: "NewsCorp",
    role: "Completed",
    status: "completing",
    weeklyRevenue: 0,
    nextMeeting: "Project Complete",
    upcomingDeliverables: ["Final Documentation"],
    recentActivity: "Engagement concluded - archiving materials",
    health: 100,
  },
];

export default function ClientCommandCenter() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "at-risk" | "prospective">("all");

  const filteredClients = mockClients.filter(client =>
    filter === "all" ? true : client.status === filter
  );

  const totalWeeklyRevenue = mockClients
    .filter(c => c.status === "active")
    .reduce((sum, c) => sum + c.weeklyRevenue, 0);

  const activeClients = mockClients.filter(c => c.status === "active").length;
  const atRiskClients = mockClients.filter(c => c.status === "at-risk").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "at-risk": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "prospective": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "completing": return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return "bg-emerald-500";
    if (health >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Client <span className="gradient-text">Command Center</span>
          </h1>
          <p className="text-slate-400">Manage all client engagements and deliverables</p>
        </div>
        <button className="flex items-center px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl text-white text-sm sm:text-base font-medium transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50">
          <Plus className="w-5 h-5 mr-2" />
          Add Client
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card p-4 sm:p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-emerald-400 text-sm font-medium flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              Active
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Active Clients</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{activeClients}</p>
        </div>

        <div className="glass-card p-4 sm:p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-emerald-400 text-sm font-medium flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +12%
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Weekly Revenue</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">${(totalWeeklyRevenue / 1000).toFixed(1)}k</p>
        </div>

        <div className="glass-card p-4 sm:p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-red-400 text-sm font-medium">Attention</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">At Risk</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{atRiskClients}</p>
        </div>

        <div className="glass-card p-4 sm:p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-slate-400 text-sm font-medium">This Week</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Meetings</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">8</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="glass-card px-4 py-2 flex items-center">
          <Filter className="w-4 h-4 text-amber-400 mr-3" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "active" | "at-risk" | "prospective")}
            className="bg-transparent text-slate-200 text-sm focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Clients</option>
            <option value="active" className="bg-slate-900">Active</option>
            <option value="at-risk" className="bg-slate-900">At Risk</option>
            <option value="prospective" className="bg-slate-900">Prospective</option>
          </select>
        </div>
        <div className="glass-card px-4 py-2 flex items-center flex-1 min-w-0">
          <Search className="w-4 h-4 text-amber-400 mr-3" />
          <input
            type="text"
            placeholder="Search clients..."
            className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder-slate-500"
          />
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => setSelectedClient(client)}
            className="glass-card p-4 sm:p-6 cursor-pointer hover-lift group"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  client.status === "active" ? "bg-gradient-to-br from-emerald-500 to-teal-500" :
                  client.status === "at-risk" ? "bg-gradient-to-br from-red-500 to-orange-500" :
                  client.status === "prospective" ? "bg-gradient-to-br from-amber-500 to-orange-500" :
                  "bg-gradient-to-br from-slate-500 to-slate-600"
                } shadow-lg`}>
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-400 transition-colors">{client.name}</h3>
                  <p className="text-slate-400">{client.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
                <button className="text-slate-500 hover:text-slate-300 p-2 rounded-lg hover:bg-white/5 transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
              <div className="glass-card p-4">
                <p className="text-slate-500 text-sm mb-1">Weekly Revenue</p>
                <p className="text-2xl font-bold text-white">${client.weeklyRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-2">Health Score</p>
                <div className="flex items-center">
                  <div className="flex-1 bg-slate-800 rounded-full h-2.5 mr-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getHealthColor(client.health)} transition-all duration-500`}
                      style={{ width: `${client.health}%` }}
                    />
                  </div>
                  <span className="text-lg font-semibold text-white">{client.health}%</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-500/10">
              <div className="flex items-center text-sm text-slate-400 mb-2">
                <Clock className="w-4 h-4 mr-2 text-amber-400" />
                {client.nextMeeting}
              </div>
              {client.upcomingDeliverables.length > 0 && (
                <div className="flex items-start text-sm">
                  <FileText className="w-4 h-4 mr-2 text-orange-400 mt-0.5" />
                  <span className="text-slate-400">
                    {client.upcomingDeliverables.slice(0, 2).join(", ")}
                    {client.upcomingDeliverables.length > 2 && (
                      <span className="text-amber-400 ml-1">+{client.upcomingDeliverables.length - 2} more</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-4 sm:p-6 border-b border-amber-500/10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedClient.name}</h2>
                  <p className="text-slate-400">{selectedClient.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card p-4 text-center">
                  <p className="text-slate-500 text-sm mb-1">Weekly Revenue</p>
                  <p className="text-2xl font-bold text-white">${selectedClient.weeklyRevenue.toLocaleString()}</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-slate-500 text-sm mb-1">Health Score</p>
                  <p className="text-2xl font-bold text-white">{selectedClient.health}%</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-slate-500 text-sm mb-1">Status</p>
                  <p className="text-2xl font-bold text-white capitalize">{selectedClient.status}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-amber-400" />
                  Upcoming Deliverables
                </h3>
                <div className="space-y-3">
                  {selectedClient.upcomingDeliverables.map((deliverable, idx) => (
                    <div key={idx} className="glass-card p-4 flex items-center group hover:border-amber-500/30 transition-all">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mr-4 group-hover:bg-amber-500/30 transition-all">
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className="text-slate-200">{deliverable}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-orange-400" />
                  Recent Activity
                </h3>
                <p className="text-slate-400">{selectedClient.recentActivity}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
