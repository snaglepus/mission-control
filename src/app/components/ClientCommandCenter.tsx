"use client";

import { useState } from "react";
import { 
  Building2, 
  Calendar, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreVertical,
  Plus,
  Filter,
  Search
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
  health: number; // 0-100
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Client Command Center</h1>
          <p className="text-slate-400">Manage all client engagements and deliverables</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Clients</p>
              <p className="text-2xl font-bold text-white">{activeClients}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Weekly Revenue</p>
              <p className="text-2xl font-bold text-white">${(totalWeeklyRevenue / 1000).toFixed(1)}k</p>
            </div>
            <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">At Risk</p>
              <p className="text-2xl font-bold text-white">{atRiskClients}</p>
            </div>
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">This Week</p>
              <p className="text-2xl font-bold text-white">8 Meetings</p>
            </div>
            <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
          <Filter className="w-4 h-4 text-slate-400 mr-2" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "active" | "at-risk" | "prospective")}
            className="bg-transparent text-slate-300 text-sm focus:outline-none"
          >
            <option value="all">All Clients</option>
            <option value="active">Active</option>
            <option value="at-risk">At Risk</option>
            <option value="prospective">Prospective</option>
          </select>
        </div>
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search clients..."
            className="bg-transparent text-slate-300 text-sm focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredClients.map((client) => (
          <div 
            key={client.id}
            onClick={() => setSelectedClient(client)}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  client.status === "active" ? "bg-emerald-600/20" :
                  client.status === "at-risk" ? "bg-red-600/20" :
                  client.status === "prospective" ? "bg-amber-600/20" :
                  "bg-slate-700/50"
                }`}>
                  <Building2 className={`w-5 h-5 ${
                    client.status === "active" ? "text-emerald-400" :
                    client.status === "at-risk" ? "text-red-400" :
                    client.status === "prospective" ? "text-amber-400" :
                    "text-slate-400"
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{client.name}</h3>
                  <p className="text-sm text-slate-400">{client.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  client.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                  client.status === "at-risk" ? "bg-red-500/20 text-red-400" :
                  client.status === "prospective" ? "bg-amber-500/20 text-amber-400" :
                  "bg-slate-700 text-slate-400"
                }`}>
                  {client.status}
                </span>
                <button className="text-slate-500 hover:text-slate-300">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Weekly Revenue</p>
                <p className="text-lg font-semibold text-white">${client.weeklyRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Health Score</p>
                <div className="flex items-center">
                  <div className="flex-1 bg-slate-800 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full ${
                        client.health >= 80 ? "bg-emerald-500" :
                        client.health >= 60 ? "bg-amber-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${client.health}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-300">{client.health}%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex items-center text-sm text-slate-400">
                <Clock className="w-4 h-4 mr-2" />
                {client.nextMeeting}
              </div>
              {client.upcomingDeliverables.length > 0 && (
                <div className="mt-2 flex items-start text-sm">
                  <FileText className="w-4 h-4 mr-2 text-slate-500 mt-0.5" />
                  <span className="text-slate-400">
                    {client.upcomingDeliverables.slice(0, 2).join(", ")}
                    {client.upcomingDeliverables.length > 2 && ` +${client.upcomingDeliverables.length - 2} more`}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedClient.name}</h2>
                  <p className="text-slate-400">{selectedClient.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedClient(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Weekly Revenue</p>
                  <p className="text-xl font-bold text-white">${selectedClient.weeklyRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Health Score</p>
                  <p className="text-xl font-bold text-white">{selectedClient.health}%</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Status</p>
                  <p className="text-xl font-bold text-white capitalize">{selectedClient.status}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Upcoming Deliverables</h3>
                <div className="space-y-2">
                  {selectedClient.upcomingDeliverables.map((deliverable, idx) => (
                    <div key={idx} className="flex items-center bg-slate-800/50 rounded-lg p-3">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 mr-3" />
                      <span className="text-slate-300">{deliverable}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Recent Activity</h3>
                <p className="text-slate-400">{selectedClient.recentActivity}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
