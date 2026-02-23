"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CheckSquare, 
  TrendingUp,
  Settings,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";
import ClientCommandCenter from "./components/ClientCommandCenter";
import MeetingIntelligence from "./components/MeetingIntelligence";
import TaskMissionControl from "./components/TaskMissionControl";

type ToolView = "dashboard" | "clients" | "meetings" | "tasks";

export default function MissionControl() {
  const [activeView, setActiveView] = useState<ToolView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tools = [
    { id: "dashboard" as ToolView, name: "Dashboard", icon: LayoutDashboard },
    { id: "clients" as ToolView, name: "Client Command", icon: Users },
    { id: "meetings" as ToolView, name: "Meeting Intel", icon: Calendar },
    { id: "tasks" as ToolView, name: "Task Control", icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? "w-64" : "w-16"} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="ml-3 font-bold text-lg text-white">Mission Control</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveView(tool.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${
                  activeView === tool.id
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-600/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="ml-3 font-medium">{tool.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Toggle Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center flex-1 max-w-xl">
            <Search className="w-5 h-5 text-slate-400 absolute ml-3" />
            <input
              type="text"
              placeholder="Search clients, meetings, tasks..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-200">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
              RJ
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeView === "dashboard" && <DashboardOverview setActiveView={setActiveView} />}
          {activeView === "clients" && <ClientCommandCenter />}
          {activeView === "meetings" && <MeetingIntelligence />}
          {activeView === "tasks" && <TaskMissionControl />}
        </main>
      </div>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview({ setActiveView }: { setActiveView: (view: ToolView) => void }) {
  const stats = [
    { label: "Active Clients", value: "6", change: "+2 this month", color: "indigo" },
    { label: "Meetings This Week", value: "12", change: "8 action items", color: "emerald" },
    { label: "Olivia Tasks", value: "4", change: "2 pending", color: "amber" },
    { label: "Weekly Revenue", value: "$18.5k", change: "+12% vs last week", color: "purple" },
  ];

  const quickActions = [
    { name: "Client Command", description: "View all clients and their status", view: "clients" as ToolView, icon: Users },
    { name: "Meeting Intel", description: "Recent meetings and action items", view: "meetings" as ToolView, icon: Calendar },
    { name: "Task Control", description: "Manage Olivia tasks and priorities", view: "tasks" as ToolView, icon: CheckSquare },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Mission Control</h1>
        <p className="text-slate-400 mt-1">Welcome back, Robbie. Here&apos;s your command center overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            <p className={`text-sm mt-2 text-${stat.color}-400`}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={() => setActiveView(action.view)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600/30">
                <Icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">{action.name}</h3>
              <p className="text-slate-400 text-sm mt-1">{action.description}</p>
            </button>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { time: "2 hours ago", event: "Meeting with CoverMore - IT Strategy Review", type: "meeting" },
            { time: "4 hours ago", event: "Olivia completed: Restaurant API Research", type: "task" },
            { time: "Yesterday", event: "New deliverable: Guide Dogs Board Paper v2", type: "deliverable" },
            { time: "Yesterday", event: "Fireflies sync: 3 meetings processed", type: "sync" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-4 py-3 border-b border-slate-800 last:border-0">
              <span className="text-slate-500 text-sm w-24">{item.time}</span>
              <span className="text-slate-300">{item.event}</span>
              <span className={`ml-auto px-2 py-1 rounded text-xs ${
                item.type === "meeting" ? "bg-blue-500/20 text-blue-400" :
                item.type === "task" ? "bg-amber-500/20 text-amber-400" :
                item.type === "deliverable" ? "bg-purple-500/20 text-purple-400" :
                "bg-emerald-500/20 text-emerald-400"
              }`}>
                {item.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
