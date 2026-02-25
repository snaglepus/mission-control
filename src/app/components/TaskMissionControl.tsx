"use client";

import { useState } from "react";
import {
  CheckSquare,
  AlertCircle,
  Calendar,
  Tag,
  Filter,
  Search,
  Plus,
  MoreVertical,
  Bot,
  Clock4,
  RefreshCw,
  Loader2,
  Zap,
  Target,
  Clock,
  CheckCircle2
} from "lucide-react";
import { useTodoistData } from "../hooks/useRealtimeData";

interface Task {
  id: string;
  content: string;
  description?: string;
  project: "min" | "hour" | "day" | "inbox";
  priority: number;
  labels: string[];
  dueDate?: string;
  completed: boolean;
  isOliviaTask: boolean;
  client?: string;
}

export default function TaskMissionControl() {
  const { data, loading, error, lastUpdated, refresh } = useTodoistData();
  const [filter, setFilter] = useState<"all" | "today" | "olivia" | "p1">("all");
  const [selectedProject, setSelectedProject] = useState<"all" | "min" | "hour" | "day">("all");

  const tasks: Task[] = data?.tasks || [];
  const stats = data?.stats || { total: 0, p1: 0, olivia: 0, today: 0, min: 0, hour: 0, day: 0 };

  const filteredTasks = tasks.filter(task => {
    if (filter === "today") return task.dueDate === new Date().toISOString().split('T')[0] && !task.completed;
    if (filter === "olivia") return task.isOliviaTask;
    if (filter === "p1") return task.priority === 1 && !task.completed;
    return true;
  }).filter(task => {
    if (selectedProject === "all") return true;
    return task.project === selectedProject;
  });

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return "P1";
      case 2: return "P2";
      case 3: return "P3";
      case 4: return "P4";
      default: return "P4";
    }
  };

  const getPriorityStyle = (priority: number) => {
    switch (priority) {
      case 1: return "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500/50";
      case 2: return "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500/50";
      case 3: return "bg-gradient-to-r from-amber-400 to-amber-500 text-white border-amber-400/50";
      case 4: return "bg-slate-700 text-slate-300 border-slate-600";
      default: return "bg-slate-700 text-slate-300";
    }
  };

  const getProjectStyle = (project: string) => {
    switch (project) {
      case "min": return "text-emerald-400";
      case "hour": return "text-amber-400";
      case "day": return "text-orange-400";
      default: return "text-slate-400";
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Task <span className="gradient-text">Mission Control</span>
          </h1>
          <p className="text-slate-400">Error loading tasks. Check your Todoist API configuration.</p>
        </div>
        <div className="glass-card p-8 border-red-500/30">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <p className="text-red-400 text-lg">{error.message}</p>
          <button
            onClick={refresh}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white font-medium hover:from-red-400 hover:to-red-500 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Task <span className="gradient-text">Mission Control</span>
          </h1>
          <p className="text-slate-400">
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin text-amber-400" />
                Syncing with Todoist...
              </span>
            ) : lastUpdated ? (
              `Last synced: ${lastUpdated.toLocaleTimeString()}`
            ) : (
              "Real-time Todoist integration"
            )}
          </p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={refresh}
            disabled={loading}
            className="p-3 rounded-xl glass-card text-slate-400 hover:text-amber-400 disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl text-white text-sm sm:text-base font-medium transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50">
            <Plus className="w-5 h-5 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card p-4 sm:p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-slate-400 text-sm">Active</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Active Tasks</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{stats.total || 0}</p>
        </div>

        <div className="glass-card p-4 sm:p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-red-400 text-sm font-medium">Must Do</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">P1 Priority</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{stats.p1 || 0}</p>
        </div>

        <div className="glass-card p-4 sm:p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-amber-400 text-sm font-medium">AI</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Olivia Tasks</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{stats.olivia || 0}</p>
        </div>

        <div className="glass-card p-4 sm:p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-emerald-400 text-sm font-medium">Today</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Due Today</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{stats.today || 0}</p>
        </div>
      </div>

      {/* Workload Overview */}
      <div className="glass-card p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-amber-400" />
          Daily Workload
        </h3>
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          <div className="glass-card p-3 sm:p-5 text-center hover-lift">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
              <Clock4 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-xl sm:text-3xl font-bold text-white mb-1">{stats.min || 0}</p>
            <p className="text-sm text-slate-400">Min Tasks</p>
            <p className="text-xs text-slate-500 mt-2">5-10 per day</p>
          </div>
          <div className="glass-card p-3 sm:p-5 text-center hover-lift">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/30">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-xl sm:text-3xl font-bold text-white mb-1">{stats.hour || 0}</p>
            <p className="text-sm text-slate-400">Hour Tasks</p>
            <p className="text-xs text-slate-500 mt-2">2-3 per day</p>
          </div>
          <div className="glass-card p-3 sm:p-5 text-center hover-lift">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/30">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-xl sm:text-3xl font-bold text-white mb-1">{stats.day || 0}</p>
            <p className="text-sm text-slate-400">Day Tasks</p>
            <p className="text-xs text-slate-500 mt-2">1 max per day</p>
          </div>
        </div>
        {((stats.min || 0) > 10 || (stats.hour || 0) > 3 || (stats.day || 0) > 1) && (
          <div className="mt-6 p-4 glass-card border-amber-500/30 flex items-center">
            <AlertCircle className="w-5 h-5 text-amber-400 mr-3" />
            <p className="text-amber-400">
              Workload exceeding daily limits. Consider rescheduling lower priority tasks.
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="glass-card px-4 py-2 flex items-center">
          <Filter className="w-4 h-4 text-amber-400 mr-3" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "today" | "olivia" | "p1")}
            className="bg-transparent text-slate-200 text-sm focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Tasks</option>
            <option value="today" className="bg-slate-900">Due Today</option>
            <option value="olivia" className="bg-slate-900">Olivia Tasks</option>
            <option value="p1" className="bg-slate-900">P1 Only</option>
          </select>
        </div>
        <div className="glass-card px-4 py-2 flex items-center">
          <Clock4 className="w-4 h-4 text-amber-400 mr-3" />
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value as "all" | "min" | "hour" | "day")}
            className="bg-transparent text-slate-200 text-sm focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Time Estimates</option>
            <option value="min" className="bg-slate-900">Min (5-10/day)</option>
            <option value="hour" className="bg-slate-900">Hour (2-3/day)</option>
            <option value="day" className="bg-slate-900">Day (1/day)</option>
          </select>
        </div>
        <div className="glass-card px-4 py-2 flex items-center flex-1 min-w-0">
          <Search className="w-4 h-4 text-amber-400 mr-3" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder-slate-500"
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-amber-500/10 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <CheckSquare className="w-5 h-5 mr-2 text-amber-400" />
            Tasks
          </h3>
          <span className="text-sm text-slate-400">{filteredTasks.filter(t => !t.completed).length} active</span>
        </div>
        <div className="divide-y divide-amber-500/10">
          {filteredTasks.filter(t => !t.completed).map((task) => (
            <div key={task.id} className="px-4 py-4 sm:px-6 sm:py-5 hover:bg-white/5 transition-all group">
              <div className="flex items-start space-x-4">
                <button className="mt-1 w-6 h-6 rounded-lg border-2 border-slate-600 hover:border-amber-500 hover:bg-amber-500/20 flex-shrink-0 transition-all" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-slate-200 font-medium text-base sm:text-lg group-hover:text-amber-400 transition-colors">{task.content}</p>
                      {task.description && (
                        <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      {task.isOliviaTask && (
                        <span className="flex items-center px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 rounded-lg text-sm border border-amber-500/30">
                          <Bot className="w-4 h-4 mr-2" />
                          Olivia
                        </span>
                      )}
                      <button className="text-slate-500 hover:text-slate-300 p-2 rounded-lg hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3">
                    <span className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${getPriorityStyle(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                    <span className={`flex items-center text-sm ${getProjectStyle(task.project)}`}>
                      <Clock4 className="w-4 h-4 mr-1" />
                      {task.project}
                    </span>
                    {task.dueDate && (
                      <span className={`flex items-center text-sm ${
                        task.dueDate === new Date().toISOString().split('T')[0] ? "text-red-400" : "text-slate-500"
                      }`}>
                        <Calendar className="w-4 h-4 mr-1" />
                        {task.dueDate === new Date().toISOString().split('T')[0] ? "Today" : task.dueDate}
                      </span>
                    )}
                    {task.labels.map((label, idx) => (
                      <span key={idx} className="flex items-center text-sm text-slate-500">
                        <Tag className="w-4 h-4 mr-1" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredTasks.filter(t => !t.completed).length === 0 && (
            <div className="px-6 py-8 sm:py-12 text-center">
              <CheckSquare className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 text-lg">No active tasks match your filters</p>
              <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or add a new task</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {filteredTasks.some(t => t.completed) && (
        <div className="glass-card overflow-hidden">
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-amber-500/10">
            <h3 className="font-semibold text-slate-400 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Completed
            </h3>
          </div>
          <div className="divide-y divide-amber-500/10">
            {filteredTasks.filter(t => t.completed).map((task) => (
              <div key={task.id} className="px-4 py-2 sm:px-6 sm:py-3 opacity-50">
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <CheckSquare className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-slate-500 line-through">{task.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
