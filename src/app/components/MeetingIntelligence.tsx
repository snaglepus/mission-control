"use client";

import { useState } from "react";
import {
  Video,
  CheckSquare,
  Clock,
  Users,
  Search,
  Filter,
  Play,
  ExternalLink,
  AlertCircle,
  Calendar,
  RefreshCw,
  Loader2,
  ArrowUpRight,
  Mic2,
  Sparkles
} from "lucide-react";
import { useFirefliesData } from "../hooks/useRealtimeData";

interface Meeting {
  id: string;
  title: string;
  client: string;
  date: string;
  duration: string;
  attendees: string[];
  actionItems: Array<{
    id: string;
    text: string;
    assignee: string;
    completed: boolean;
    priority: "high" | "medium" | "low";
  }>;
  summary: string;
  keyInsights: string[];
  transcriptUrl: string;
  status: "processed" | "pending" | "review";
}

export default function MeetingIntelligence() {
  const { data, loading, error, lastUpdated, refresh } = useFirefliesData();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "review">("all");

  const meetings: Meeting[] = data?.meetings || [];
  const stats = data?.stats || { total: 0, thisWeek: 0, pendingReview: 0, totalActionItems: 0 };

  const filteredMeetings = meetings.filter(meeting =>
    filter === "all" ? true : meeting.status === filter
  );

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Meeting <span className="gradient-text">Intelligence</span>
          </h1>
          <p className="text-slate-400">Error loading meetings. Check your Fireflies API configuration.</p>
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
            Meeting <span className="gradient-text">Intelligence</span>
          </h1>
          <p className="text-slate-400">
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin text-amber-400" />
                Syncing with Fireflies...
              </span>
            ) : lastUpdated ? (
              `Last synced: ${lastUpdated.toLocaleTimeString()}`
            ) : (
              "Real-time Fireflies integration"
            )}
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="p-3 rounded-xl glass-card text-slate-400 hover:text-amber-400 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card p-4 sm:p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-slate-400 text-sm">Recent</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Meetings</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{stats.total || 0}</p>
        </div>

        <div className="glass-card p-4 sm:p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-emerald-400 text-sm font-medium flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              Active
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Action Items</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalActionItems || 0}</p>
        </div>

        <div className="glass-card p-4 sm:p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-slate-400 text-sm">This Week</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Meetings</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{stats.thisWeek || 0}</p>
        </div>

        <div className="glass-card p-4 sm:p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-orange-400 text-sm font-medium">AI</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Processed</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{stats.total || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="glass-card px-4 py-2 flex items-center">
          <Filter className="w-4 h-4 text-amber-400 mr-3" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "pending" | "review")}
            className="bg-transparent text-slate-200 text-sm focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Meetings</option>
            <option value="pending" className="bg-slate-900">Pending</option>
            <option value="review" className="bg-slate-900">Needs Review</option>
          </select>
        </div>
        <div className="glass-card px-4 py-2 flex items-center flex-1 min-w-0">
          <Search className="w-4 h-4 text-amber-400 mr-3" />
          <input
            type="text"
            placeholder="Search meetings..."
            className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder-slate-500"
          />
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="glass-card p-4 sm:p-6 hover-lift group"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  meeting.status === "processed" ? "bg-gradient-to-br from-emerald-500 to-teal-500" :
                  meeting.status === "review" ? "bg-gradient-to-br from-amber-500 to-orange-500" :
                  "bg-gradient-to-br from-slate-500 to-slate-600"
                } shadow-lg`}>
                  <Mic2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{meeting.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      meeting.status === "processed" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                      meeting.status === "review" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                      "bg-slate-500/20 text-slate-400 border-slate-500/30"
                    }`}>
                      {meeting.status}
                    </span>
                  </div>
                  <p className="text-slate-400 mb-3">{meeting.client}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-amber-400" />
                      {new Date(meeting.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-orange-400" />
                      {meeting.duration}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-emerald-400" />
                      {meeting.attendees.length} attendees
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedMeeting(meeting)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl text-white text-sm font-medium transition-all shadow-lg shadow-amber-500/30"
                >
                  View
                </button>
                <a
                  href={meeting.transcriptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl glass-card text-slate-400 hover:text-amber-400 transition-all"
                  title="View Transcript"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Summary Preview */}
            <div className="mt-4 pt-4 border-t border-amber-500/10">
              <p className="text-sm text-slate-400 line-clamp-2">{meeting.summary}</p>
            </div>

            {/* Action Items Preview */}
            {meeting.actionItems.length > 0 && (
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center text-sm">
                  <CheckSquare className="w-4 h-4 text-amber-400 mr-2" />
                  <span className="text-slate-400">
                    {meeting.actionItems.length} action items
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredMeetings.length === 0 && (
          <div className="glass-card p-8 sm:p-12 text-center">
            <Video className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 text-lg">No meetings found</p>
            <p className="text-slate-500 text-sm mt-2">Check your Fireflies connection</p>
          </div>
        )}
      </div>

      {/* Meeting Detail Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card max-w-3xl w-full max-h-[85vh] overflow-auto">
            <div className="p-4 sm:p-6 border-b border-amber-500/10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedMeeting.title}</h2>
                  <p className="text-slate-400">{selectedMeeting.client}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Meeting Meta */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-slate-400">
                <span className="flex items-center glass-card px-3 py-2">
                  <Calendar className="w-4 h-4 mr-2 text-amber-400" />
                  {new Date(selectedMeeting.date).toLocaleDateString()}
                </span>
                <span className="flex items-center glass-card px-3 py-2">
                  <Clock className="w-4 h-4 mr-2 text-orange-400" />
                  {selectedMeeting.duration}
                </span>
                <span className="flex items-center glass-card px-3 py-2">
                  <Users className="w-4 h-4 mr-2 text-emerald-400" />
                  {selectedMeeting.attendees.join(", ")}
                </span>
              </div>

              {/* Summary */}
              <div className="glass-card p-5">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-amber-400" />
                  AI Summary
                </h3>
                <p className="text-slate-400 leading-relaxed">{selectedMeeting.summary}</p>
              </div>

              {/* Key Insights */}
              {selectedMeeting.keyInsights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-orange-400" />
                    Key Insights
                  </h3>
                  <div className="space-y-3">
                    {selectedMeeting.keyInsights.map((insight, idx) => (
                      <div key={idx} className="flex items-start glass-card p-4">
                        <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mt-2 mr-4 flex-shrink-0" />
                        <span className="text-slate-300">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Items */}
              {selectedMeeting.actionItems.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <CheckSquare className="w-5 h-5 mr-2 text-emerald-400" />
                    Action Items
                  </h3>
                  <div className="space-y-3">
                    {selectedMeeting.actionItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 glass-card"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-6 h-6 rounded border-2 ${
                            item.priority === "high" ? "border-red-500" :
                            item.priority === "medium" ? "border-amber-500" :
                            "border-slate-600"
                          }`} />
                          <span className="text-slate-200">{item.text}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.priority === "high" ? "bg-red-500/20 text-red-400" :
                          item.priority === "medium" ? "bg-amber-500/20 text-amber-400" :
                          "bg-slate-700 text-slate-400"
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transcript Link */}
              <div className="flex items-center justify-between pt-4 border-t border-amber-500/10">
                <span className="text-sm text-slate-500">Full transcript available in Fireflies</span>
                <a
                  href={selectedMeeting.transcriptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl text-white font-medium transition-all shadow-lg shadow-amber-500/30"
                >
                  <Play className="w-5 h-5 mr-2" />
                  View Transcript
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
