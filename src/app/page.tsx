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
  X,
  Zap,
  Activity,
  Clock,
  ArrowUpRight,
  MoreHorizontal
} from "lucide-react";
import ClientCommandCenter from "./components/ClientCommandCenter";
import MeetingIntelligence from "./components/MeetingIntelligence";
import TaskMissionControl from "./components/TaskMissionControl";

type ToolView = "dashboard" | "clients" | "meetings" | "tasks";

export default function MissionControl() {
  const [activeView, setActiveView] = useState<ToolView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tools = [
    { id: "dashboard" as ToolView, name: "Overview", icon: LayoutDashboard },
    { id: "clients" as ToolView, name: "Clients", icon: Users },
    { id: "meetings" as ToolView, name: "Meetings", icon: Calendar },
    { id: "tasks" as ToolView, name: "Tasks", icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-[#1a0f00]/80 backdrop-blur-xl border-r border-amber-500/10 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-amber-500/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center glow-cyan">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="ml-3 font-bold text-xl neon-text">Mission Control</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeView === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveView(tool.id)}
                className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 sidebar-item group ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-400"
                    : "text-slate-400 hover:text-amber-300 hover:bg-amber-500/5"
                }`}
              >
                <div className={`p-2 rounded-lg transition-all ${
                  isActive ? "bg-amber-500/20" : "group-hover:bg-white/10"
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-amber-400" : ""}`} />
                </div>
                {sidebarOpen && (
                  <span className="ml-3 font-medium">{tool.name}</span>
                )}
                {isActive && sidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 glow-cyan" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-amber-500/10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-[#1a0f00]/60 backdrop-blur-xl border-b border-amber-500/10 flex items-center justify-between px-8">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clients, meetings, tasks..."
                className="w-full bg-[#1a0f00]/50 border border-amber-500/20 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse" />
            </button>
            <button className="p-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-amber-500/20">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-200">Robbie</p>
                <p className="text-xs text-slate-500">Online</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold text-white glow-cyan">
                RJ
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-8">
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
    { 
      label: "Active Clients", 
      value: "6", 
      change: "+2 this month", 
      icon: Users,
      gradient: "from-amber-400 to-amber-600",
      glow: "shadow-amber-500/30"
    },
    { 
      label: "Weekly Revenue", 
      value: "$18.5k", 
      change: "+12% vs last week", 
      icon: TrendingUp,
      gradient: "from-orange-400 to-orange-600",
      glow: "shadow-orange-500/30"
    },
    { 
      label: "Meetings This Week", 
      value: "12", 
      change: "8 action items", 
      icon: Calendar,
      gradient: "from-yellow-400 to-amber-500",
      glow: "shadow-yellow-500/30"
    },
    { 
      label: "Olivia Tasks", 
      value: "4", 
      change: "2 pending", 
      icon: Activity,
      gradient: "from-amber-500 to-orange-500",
      glow: "shadow-amber-500/30"
    },
  ];

  const quickActions = [
    { 
      name: "Client Command", 
      description: "View all clients and their status", 
      view: "clients" as ToolView, 
      icon: Users,
      color: "amber"
    },
    {
      name: "Meeting Intel",
      description: "Recent meetings and action items",
      view: "meetings" as ToolView,
      icon: Calendar,
      color: "orange"
    },
    { 
      name: "Task Control", 
      description: "Manage Olivia tasks and priorities", 
      view: "tasks" as ToolView, 
      icon: CheckSquare,
      color: "emerald"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, <span className="gradient-text">Robbie</span>
        </h1>
        <p className="text-slate-400 text-lg">Here&apos;s your mission overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card p-6 hover-lift">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.glow}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <button className="text-slate-500 hover:text-slate-300">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white mb-2 text-glow">{stat.value}</p>
              <div className="flex items-center text-sm">
                <ArrowUpRight className="w-4 h-4 text-emerald-400 mr-1" />
                <span className="text-emerald-400">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            const colorMap: Record<string, string> = {
              amber: "from-amber-400 to-amber-600 shadow-amber-500/30",
              orange: "from-orange-400 to-orange-600 shadow-orange-500/30",
              emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/30",
            };
            return (
              <button
                key={idx}
                onClick={() => setActiveView(action.view)}
                className="glass-card p-6 text-left hover-lift group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[action.color]} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{action.name}</h3>
                <p className="text-slate-400 text-sm">{action.description}</p>
                <div className="mt-4 flex items-center text-amber-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Access</span>
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-amber-400" />
            Recent Activity
          </h2>
          <button className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {[
            { time: "2 hours ago", event: "Meeting with CoverMore - IT Strategy Review", type: "meeting", color: "amber" },
            { time: "4 hours ago", event: "Olivia completed: Restaurant API Research", type: "task", color: "amber" },
            { time: "Yesterday", event: "New deliverable: Guide Dogs Board Paper v2", type: "deliverable", color: "orange" },
            { time: "Yesterday", event: "Fireflies sync: 3 meetings processed", type: "sync", color: "emerald" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-4 py-4 border-b border-amber-500/10 last:border-0">
              <div className={`w-2 h-2 rounded-full ${
                item.color === "amber" ? "bg-amber-400" :
                item.color === "orange" ? "bg-orange-400" :
                "bg-emerald-400"
              }`} />
              <div className="flex-1">
                <p className="text-slate-200">{item.event}</p>
                <p className="text-sm text-slate-500">{item.time}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.type === "meeting" ? "bg-amber-500/20 text-amber-400" :
                item.type === "task" ? "bg-amber-500/20 text-amber-400" :
                item.type === "deliverable" ? "bg-orange-500/20 text-orange-400" :
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
