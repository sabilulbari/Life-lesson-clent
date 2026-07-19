import { Flag } from "lucide-react";

export default function ReportModal({ reportReason, setReportReason, setReportModalOpen, handleReportSubmit }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md glass rounded-3xl border border-[var(--card-border)] p-6 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center space-x-2 text-rose-400">
          <Flag size={20} />
          <h3 className="text-lg font-bold font-display">Report this lesson</h3>
        </div>
        <p className="text-xs text-slate-400">If this lesson contains inappropriate content, plagiarism, spam, or violates our terms, please specify the reason.</p>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wide">Reason for report</label>
          <select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/50 outline-none text-sm text-[var(--foreground)] focus:border-rose-500 cursor-pointer"
          >
            <option value="Spam">Spam Content</option>
            <option value="Inappropriate">Inappropriate / Offensive Language</option>
            <option value="Harassment">Harassment or Hate Speech</option>
            <option value="Copyright Violation">Copyright / Intellectual Property Theft</option>
            <option value="Other">Other Reasons</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button onClick={() => setReportModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-750 transition-colors">
            Cancel
          </button>
          <button onClick={handleReportSubmit} className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors">
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
