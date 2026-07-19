"use client";

import { useEffect, useState } from "react";
import { getReports, getReportDetails, ignoreReports, deleteLesson } from "@/actions/lessons";
import { AlertOctagon, CheckSquare, Trash2, Eye, ShieldAlert, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ReportedLessons() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal details state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [reportDetails, setReportDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data || []);
    } catch (err) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // View details modal handler
  const handleViewDetails = async (lesson) => {
    setSelectedLesson(lesson);
    setDetailsModalOpen(true);
    setLoadingDetails(true);
    try {
      const details = await getReportDetails(lesson._id);
      setReportDetails(details || []);
    } catch (err) {
      toast.error("Failed to load report reasons");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Ignore reports handler (clears reports, keeps lesson live)
  const handleIgnore = async (lessonId) => {
    try {
      const res = await ignoreReports(lessonId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Reports ignored and cleared.");
        setReports(reports.filter((r) => r._id !== lessonId));
        setDetailsModalOpen(false);
      }
    } catch (err) {
      toast.error("Failed to clear reports");
    }
  };

  // Moderate and Delete lesson permanently
  const handleDeleteLesson = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await deleteLesson(deleteId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Lesson deleted permanently");
        setReports(reports.filter((r) => r._id !== deleteId));
        setDeleteId(null);
        setDetailsModalOpen(false);
      }
    } catch (err) {
      toast.error("Failed to delete lesson");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-slate-200">
          Flagged Contents
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review community reports, check flag counts and reasons, and clear flags or remove content.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent animate-spin rounded-full mb-3" />
          <span className="text-xs text-slate-400">Loading reports list...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/10 border border-slate-700/20 rounded-2xl p-6 text-slate-400 text-xs">
          No reported or flagged lessons. Platform is clean!
        </div>
      ) : (
        /* Reports Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/40 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Lesson Title</th>
                <th className="py-3 px-2 text-center">Total Flag Counts</th>
                <th className="py-3 px-2 text-center font-bold">Investigation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20 text-slate-300">
              {reports.map((item) => (
                <tr key={item._id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="py-3 px-2 font-bold text-slate-200">{item.lessonTitle}</td>
                  
                  {/* Report count */}
                  <td className="py-3 px-2 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/25 font-bold">
                      <AlertOctagon size={11} />
                      <span>{item.reportCount} flags</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center space-x-2.5">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-500/10 border border-slate-700/50 hover:border-indigo-500/35 text-slate-400 hover:text-indigo-400 transition-colors font-semibold flex items-center gap-1"
                      >
                        <Eye size={12} />
                        <span>Inspect Reasons</span>
                      </button>

                      <button
                        onClick={() => handleIgnore(item._id)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-emerald-500/15 border border-slate-700/30 text-slate-400 hover:text-emerald-400 transition-colors"
                        title="Ignore Flags"
                      >
                        <CheckSquare size={12} />
                      </button>

                      <button
                        onClick={() => setDeleteId(item._id)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/15 border border-slate-700/30 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete Flagged Lesson"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Flag Reasons Modal */}
      {detailsModalOpen && selectedLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass rounded-3xl border border-[var(--card-border)] p-6 space-y-4 max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
              <h3 className="font-bold text-slate-200 truncate pr-4 text-sm font-display">
                Flags for: "{selectedLesson.lessonTitle}"
              </h3>
              <button
                onClick={() => {
                  setDetailsModalOpen(false);
                  setSelectedLesson(null);
                  setReportDetails([]);
                }}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {loadingDetails ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full" />
              </div>
            ) : reportDetails.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No report data found</p>
            ) : (
              <div className="space-y-3">
                {reportDetails.map((rep) => (
                  <div key={rep._id} className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 text-xs">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-semibold">{rep.reporterUserEmail}</span>
                      <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300 font-medium">Reason: {rep.reason}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800/40">
              <button
                onClick={() => handleIgnore(selectedLesson._id)}
                className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs transition-colors"
              >
                Ignore all & Clear
              </button>
              <button
                onClick={() => setDeleteId(selectedLesson._id)}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors"
              >
                Delete Lesson
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass rounded-3xl border border-[var(--card-border)] p-6 space-y-4 text-center animate-in zoom-in-95 duration-200">
            <ShieldAlert size={36} className="text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">Moderate & Delete Lesson?</h3>
            <p className="text-xs text-slate-400">
              Are you sure? This will permanently delete the flagged lesson from the database.
            </p>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-slate-850 text-xs font-semibold text-slate-300 hover:bg-slate-750 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLesson}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors flex items-center justify-center"
              >
                {deleting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                ) : (
                  <span>Delete Content</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
