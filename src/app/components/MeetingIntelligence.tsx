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
  Loader2
} from "lucide-react";
import { useFirefliesData } from "../hooks/useRealtimeData";

interface Meeting {
  id: string;
  title: string;
  client: string;
  date: string;
  duration: string;
  attendees: string[];
  actionItems: ActionItem[];
  summary: string;
  keyInsights: string[];
  transcriptUrl: string;
  status: "processed" | "pending" | "review";
}

interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
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
          <h1 className="text-2xl font-bold text-white">Meeting Intelligence</h1>
          <p className="text-slate-400">Error loading meetings. Check your Fireflies API configuration.</p>
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
          <h1 className="text-2xl font-bold text-white">Meeting Intelligence</h1>
          <p className="text-slate-400">
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
          className="p-2 text-slate-400 hover:text-white disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Recent</p>
              <p className="text-2xl font-bold text-white">{stats.total || 0} Meetings</p>
            </div>
            <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Action Items</p>
              <p className="text-2xl font-bold text-white">{stats.totalActionItems || 0}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">This Week</p>
              <p className="text-2xl font-bold text-white">{stats.thisWeek || 0}</p>
            </div>
            <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending Review</p>
              <p className="text-2xl font-bold text-white">{stats.pendingReview || 0}</p>
            </div>
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-400" />
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
            onChange={(e) => setFilter(e.target.value as "all" | "pending" | "review")}
            className="bg-transparent text-slate-300 text-sm focus:outline-none"
          >
            <option value="all">All Meetings</option>
            <option value="pending">Pending Processing</option>
            <option value="review">Needs Review</option>
          </select>
        </div>
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search meetings..."
            className="bg-transparent text-slate-300 text-sm focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.map((meeting) => (
          <div 
            key={meeting.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  meeting.status === "processed" ? "bg-emerald-600/20" :
                  meeting.status === "review" ? "bg-amber-600/20" :
                  "bg-slate-700/50"
                }`}>
                  <Video className={`w-5 h-5 ${
                    meeting.status === "processed" ? "text-emerald-400" :
                    meeting.status === "review" ? "text-amber-400" :
                    "text-slate-400"
                  }`} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-white">{meeting.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      meeting.status === "processed" ? "bg-emerald-500/20 text-emerald-400" :
                      meeting.status === "review" ? "bg-amber-500/20 text-amber-400" :
                      "bg-slate-700 text-slate-400"
                    }`}>
                      {meeting.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{meeting.client}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(meeting.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {meeting.duration}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {meeting.attendees.length} attendees
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setSelectedMeeting(meeting)}
                  className="px-3 py-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-600/30 transition-colors"
                >
                  View Details
                </button>
                <a 
                  href={meeting.transcriptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  title="View Transcript"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Summary Preview */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-sm text-slate-400 line-clamp-2">{meeting.summary}</p>
            </div>

            {/* Action Items Preview */}
            {meeting.actionItems.length > 0 && (
              <div className="mt-3 flex items-center space-x-4">
                <div className="flex items-center text-sm">
                  <CheckSquare className="w-4 h-4 text-slate-500 mr-2" />
                  <span className="text-slate-400">
                    {meeting.actionItems.length} action items
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredMeetings.length === 0 && (
          <div className="px-5 py-8 text-center text-slate-500">
            <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No meetings found</p>
          </div>
        )}
      </div>

      {/* Meeting Detail Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-auto">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedMeeting.title}</h2>
                  <p className="text-slate-400">{selectedMeeting.client}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMeeting(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Meeting Meta */}
              <div className="flex items-center space-x-6 text-sm text-slate-400">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(selectedMeeting.date).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {selectedMeeting.duration}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {selectedMeeting.attendees.join(", ")}
                </span>
              </div>

              {/* Summary */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-2">Summary</h3>
                <p className="text-slate-400">{selectedMeeting.summary}</p>
              </div>

              {/* Key Insights */}
              {selectedMeeting.keyInsights.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Key Insights</h3>
                  <div className="space-y-2">
                    {selectedMeeting.keyInsights.map((insight, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-slate-400">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Items */}
              {selectedMeeting.actionItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Action Items</h3>
                  <div className="space-y-2">
                    {selectedMeeting.actionItems.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded border-2 ${
                            item.priority === "high" ? "border-red-500" :
                            item.priority === "medium" ? "border-amber-500" :
                            "border-slate-600"
                          }`} />
                          <span className="text-slate-300">{item.text}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs ${
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
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-sm text-slate-500">Full transcript available in Fireflies</span>
                <a 
                  href={selectedMeeting.transcriptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  <Play className="w-4 h-4 mr-2" />
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
