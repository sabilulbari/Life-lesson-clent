import { Send } from "lucide-react";
import Image from "next/image";

export default function CommentSection({ comments, session, newComment, setNewComment, handleCommentSubmit }) {
  return (
    <div className="glass rounded-3xl border border-[var(--card-border)] p-6 sm:p-8 space-y-6">
      <h2 className="text-xl font-extrabold font-display">Discussion ({comments.length})</h2>

      {/* Post Comment Form */}
      <form onSubmit={handleCommentSubmit} className="flex gap-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={session ? "Write a response to this lesson..." : "Please log in to add a comment"}
          disabled={!session}
          className="flex-grow px-4 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 outline-none text-sm text-[var(--foreground)] focus:border-indigo-500 disabled:opacity-55"
        />
        <button
          type="submit"
          disabled={!session || !newComment.trim()}
          className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition-colors flex items-center justify-center disabled:opacity-50 cursor-pointer"
        >
          <Send size={16} />
        </button>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-6">No comments posted yet. Add yours above!</p>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {comments.map(
            (comment) => (
              console.log(comment.user.photo, comment.user.photo, "from details page"),
              (
                <div key={comment._id} className="p-4 rounded-2xl bg-slate-800/25 border border-slate-700/20 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-white font-bold text-[10px]">
                      {comment.user.photo ? (
                        <Image src={comment.user.photo} width={24} height={24} alt={comment.user.name} className="w-full h-full object-cover" />
                      ) : (
                        comment.user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-200">{comment.user.name}</span>
                    <span className="text-[10px] text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-300 pl-8 font-sans leading-relaxed">{comment.content}</p>
                </div>
              )
            ),
          )}
        </div>
      )}
    </div>
  );
}
