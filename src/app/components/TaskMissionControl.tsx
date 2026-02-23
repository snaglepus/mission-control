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
  Loader2
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

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Mission Control</h1>
          <p className="text-slate-400">Error loading tasks. Check your Todoist API configuration.</p>
        </div>
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
          <p className="text-red-400">{error.message}</p>
          <button 
            onClick={refresh}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Mission Control</h1>
          <p className="text-slate-400">
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Syncing with Todoist...
              </span>
            ) : lastUpdated ? (
              `Last synced: ${lastUpdated.toLocaleTimeString()}`
            ) : (
              "Real-time Todoist integration"
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={refresh}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Tasks</p>
              <p className="text-2xl font-bold text-white">{stats.total || 0}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">P1 (Must Do)</p>
              <p className="text-2xl font-bold text-white">{stats.p1 || 0}</p>
            </div>
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Olivia Tasks</p>
              <p className="text-2xl font-bold text-white">{stats.olivia || 0}</p>
            </div>
            <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Due Today</p>
              <p className="text-2xl font-bold text-white">{stats.today || 0}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Workload Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Daily Workload</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <p className="text-2xl font-bold text-white">{stats.min || 0}</p>
            <p className="text-sm text-slate-400">Min Tasks</p>
            <p className="text-xs text-slate-500 mt-1">5-10 per day</p>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <p className="text-2xl font-bold text-white">{stats.hour || 0}</p>
            <p className="text-sm text-slate-400">Hour Tasks</p>
            <p className="text-xs text-slate-500 mt-1">2-3 per day</p>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <p className="text-2xl font-bold text-white">{stats.day || 0}</p>
            <p className="text-sm text-slate-400">Day Tasks</p>
            <p className="text-xs text-slate-500 mt-1">1 max per day</p>
          </div>
        </div>
        {((stats.min || 0) > 10 || (stats.hour || 0) > 3 || (stats.day || 0) > 1) && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-amber-400 mr-3" />
            <p className="text-sm text-amber-400">
              Workload exceeding daily limits. Consider rescheduling lower priority tasks.
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
          <Filter className="w-4 h-4 text-slate-400 mr-2" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "today" | "olivia" | "p1")}
            className="bg-transparent text-slate-300 text-sm focus:outline-none"
          >
            <option value="all">All Tasks</option>
            <option value="today">Due Today</option>
            <option value="olivia">Olivia Tasks</option>
            <option value="p1">P1 Only</option>
          </select>
        </div>
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
          <Clock4 className="w-4 h-4 text-slate-400 mr-2" />
          <select 
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value as "all" | "min" | "hour" | "day")}
            className="bg-transparent text-slate-300 text-sm focus:outline-none"
          >
            <option value="all">All Time Estimates</option>
            <option value="min">Min (5-10/day)</option>
            <option value="hour">Hour (2-3/day)</option>
            <option value="day">Day (1/day)</option>
          </select>
        </div>
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search tasks..."
            className="bg-transparent text-slate-300 text-sm focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-white">Tasks</h3>
          <span className="text-sm text-slate-400">{filteredTasks.filter(t => !t.completed).length} active</span>
        </div>
        <div className="divide-y divide-slate-800">
          {filteredTasks.filter(t => !t.completed).map((task) => (
            <div key={task.id} className="px-5 py-4 hover:bg-slate-800/50 transition-colors group">
              <div className="flex items-start space-x-3">
                <button className="mt-1 w-5 h-5 rounded border-2 border-slate-600 hover:border-indigo-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-slate-200 font-medium">{task.content}</p>
                      {task.description && (
                        <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {task.isOliviaTask && (
                        <span className="flex items-center px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">
                          <Bot className="w-3 h-3 mr-1" />
                          Olivia
                        </span>
                      )}
                      <button className="text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      task.priority === 1 ? "bg-red-500/20 text-red-400" :
                      task.priority === 2 ? "bg-amber-500/20 text-amber-400" :
                      task.priority === 3 ? "bg-blue-500/20 text-blue-400" :
                      "bg-slate-700 text-slate-400"
                    }`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                    <span className={`flex items-center text-xs ${
                      task.project === "min" ? "text-emerald-400" :
                      task.project === "hour" ? "text-amber-400" :
                      "text-purple-400"
                    }`}>
                      <Clock4 className="w-3 h-3 mr-1" />
                      {task.project}
                    </span>
                    {task.dueDate && (
                      <span className={`flex items-center text-xs ${
                        task.dueDate === new Date().toISOString().split('T')[0] ? "text-red-400" : "text-slate-500"
                      }`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {task.dueDate === new Date().toISOString().split('T')[0] ? "Today" : task.dueDate}
                      </span>
                    )}
                    {task.labels.map((label, idx) => (
                      <span key={idx} className="flex items-center text-xs text-slate-500">
                        <Tag className="w-3 h-3 mr-1" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredTasks.filter(t => !t.completed).length === 0 && (
            <div className="px-5 py-8 text-center text-slate-500">
              <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No active tasks match your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {filteredTasks.some(t => t.completed) && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800">
            <h3 className="font-semibold text-slate-400">Completed</h3>
          </div>
          <div className="divide-y divide-slate-800">
            {filteredTasks.filter(t => t.completed).map((task) => (
              <div key={task.id} className="px-5 py-3 opacity-60">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <CheckSquare className="w-3 h-3 text-white" />
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
