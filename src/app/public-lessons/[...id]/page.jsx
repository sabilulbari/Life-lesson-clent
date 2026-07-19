"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  getLessonById,
  likeLesson,
  favoriteLesson,
  reportLesson,
  getComments,
  addComment,
  getLessons
} from "@/actions/lessons";
import {
  Heart,
  Bookmark,
  Eye,
  Calendar,
  Clock,
  Globe,
  Flag,
  Share2,
  FileDown,
  ArrowLeft,
  Send,
  Lock,
  ChevronRight,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

export default function LessonDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const { data: session } = useSession();

  const [lesson, setLesson] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  // Likes & Favorites states (for immediate UI response)
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [viewsCount, setViewsCount] = useState(0);

  // Report Modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Spam");

  // Load lesson details, comments, and recommendations
  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const lessonData = await getLessonById(id);
      if (!lessonData) {
        toast.error("Lesson not found");
        router.push("/public-lessons");
        return;
      }
      setLesson(lessonData);
      setLikesCount(lessonData.likesCount || 0);
      setFavCount(lessonData.favoritesCount || 0);
      setViewsCount(Math.floor(Math.random() * 1000) + 150); // Random static views count
      
      if (session?.user) {
        setLiked(lessonData.likes?.includes(session.user.id));
        setFavorited(lessonData.favorites?.includes(session.user.id));
      }

      // Load comments
      const commentData = await getComments(id);
      setComments(commentData || []);

      // Load recommendations (similar category or emotional tone)
      const publicData = await getLessons({
        category: lessonData.category,
      });
      // Filter out current lesson
      const filtered = (publicData || []).filter((l) => l._id !== id).slice(0, 6);
      setRecommended(filtered);

    } catch (err) {
      toast.error("Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [id, session]);

  // Handle Like action
  const handleLike = async () => {
    if (!session) {
      toast.error("Please log in to like");
      router.push("/login");
      return;
    }

    // Pessimistic UI update
    try {
      const res = await likeLesson(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        setLikesCount(res.likesCount);
        setLiked(res.likes?.includes(session.user.id));
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // Handle Favorite action
  const handleFavorite = async () => {
    if (!session) {
      toast.error("Please log in to save to favorites");
      router.push("/login");
      return;
    }

    try {
      const res = await favoriteLesson(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        setFavCount(res.favoritesCount);
        setFavorited(res.favorites?.includes(session.user.id));
        if (res.favorites?.includes(session.user.id)) {
          toast.success("Saved to favorites!");
        } else {
          toast.success("Removed from favorites");
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // Handle Comment Submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please log in to comment");
      router.push("/login");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await addComment(id, newComment);
      if (res.error) {
        toast.error(res.error);
      } else {
        setComments([res.comment, ...comments]);
        setNewComment("");
        toast.success("Comment added!");
      }
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  // Handle Report Submission
  const handleReportSubmit = async () => {
    if (!session) {
      toast.error("Please log in to report lessons");
      router.push("/login");
      return;
    }

    try {
      const res = await reportLesson(id, lesson.title, reportReason);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Thank you. The lesson has been reported and will be reviewed.");
        setReportModalOpen(false);
      }
    } catch (err) {
      toast.error("Failed to report lesson");
    }
  };

  // Calculate Reading Time
  const getReadingTime = (text) => {
    if (!text) return 1;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 220));
  };

  // Export to PDF
  const handleExportPDF = () => {
    if (!lesson) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(lesson.title, 20, 30);
    
    // Metadata
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Category: ${lesson.category} | Tone: ${lesson.emotionalTone}`, 20, 40);
    doc.text(`Author: ${lesson.creatorName} | Date: ${new Date(lesson.createdAt).toLocaleDateString()}`, 20, 45);
    
    // Divider Line
    doc.setDrawColor(200);
    doc.line(20, 50, 190, 50);
    
    // Description Content (Word Wrap)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0);
    const splitText = doc.splitTextToSize(lesson.description, 170);
    doc.text(splitText, 20, 60);
    
    // Save
    doc.save(`${lesson.title.replace(/\s+/g, "_")}_lesson.pdf`);
    toast.success("Lesson exported as PDF!");
  };

  // Social Share URL Triggers
  const shareURL = typeof window !== "undefined" ? window.location.href : "";
  const handleShare = (platform) => {
    let url = "";
    if (platform === "facebook") {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`;
    } else if (platform === "x") {
      url = `https://x.com/intent/tweet?url=${encodeURIComponent(shareURL)}&text=${encodeURIComponent(`Check out this life lesson: "${lesson?.title}"`)}`;
    } else if (platform === "linkedin") {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareURL)}`;
    }
    window.open(url, "_blank", "width=600,height=400");
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-sm text-slate-400 font-medium">Retrieving details...</span>
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  // Plan Checks
  const isPremium = lesson.accessLevel === "Premium";
  const userPlan = session?.user?.plan || "free";
  const isLocked = isPremium && userPlan !== "premium" && session?.user?.role !== "admin" && session?.user?.id !== lesson.creatorId;

  return (
    <div className="space-y-10 pb-16">
      {/* Back to Public button */}
      <div>
        <Link
          href="/public-lessons"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Browse</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Lesson Body */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-3xl border border-[var(--card-border)] p-6 sm:p-8 space-y-6 relative overflow-hidden">
            
            {/* Category / Emotional tone */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 font-extrabold text-xs uppercase tracking-wider">
                {lesson.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-semibold border border-slate-700/50">
                  {lesson.emotionalTone}
                </span>
                <span className={`px-2.5 py-1 rounded-lg font-bold text-xs uppercase ${
                  isPremium ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-emerald-500/20 text-emerald-400"
                }`}>
                  {lesson.accessLevel}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-display">
              {lesson.title}
            </h1>

            {/* Featured Image if uploaded */}
            {lesson.image && (
              <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-800/50 bg-slate-900 flex items-center justify-center">
                <img src={lesson.image} alt={lesson.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Lesson Body Content (Blurred if Locked) */}
            <div className="relative">
              {isLocked ? (
                <div className="relative">
                  <div className="premium-blur text-slate-400 leading-relaxed text-sm space-y-4">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.</p>
                    <p>Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
                  </div>
                  {/* Premium Lock Banner overlay */}
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20 border border-slate-800">
                    <Lock size={44} className="text-indigo-400 mb-3 animate-pulse" />
                    <h3 className="text-xl font-bold text-white mb-2">Premium Wisdom Lock</h3>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-sm mb-5">
                      This is a Premium life lesson. To read this story and gain its growth insights, upgrade your account to Premium.
                    </p>
                    <Link
                      href="/pricing"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 font-semibold text-sm text-white shadow-lg shadow-indigo-500/25 transition-all"
                    >
                      Upgrade to Premium
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap font-sans">
                  {lesson.description}
                </div>
              )}
            </div>

            {/* Interaction Row */}
            {!isLocked && (
              <div className="pt-6 border-t border-slate-800/40 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      liked
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        : "bg-slate-800/40 border-slate-700/50 hover:text-rose-400"
                    }`}
                  >
                    <Heart size={14} className={liked ? "fill-rose-400" : ""} />
                    <span>{liked ? "Liked" : "Like"}</span>
                  </button>

                  {/* Favorite Button */}
                  <button
                    onClick={handleFavorite}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      favorited
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                        : "bg-slate-800/40 border-slate-700/50 hover:text-cyan-400"
                    }`}
                  >
                    <Bookmark size={14} className={favorited ? "fill-cyan-400" : ""} />
                    <span>{favorited ? "Saved" : "Save Favorite"}</span>
                  </button>

                  {/* Export PDF Button */}
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:text-indigo-400 text-xs font-semibold transition-all"
                  >
                    <FileDown size={14} />
                    <span>Export PDF</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Report Button */}
                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="p-2 rounded-xl bg-slate-800/40 hover:bg-rose-500/10 border border-slate-700/50 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-all"
                    title="Report Lesson"
                  >
                    <Flag size={14} />
                  </button>

                  {/* Social Share Trigger */}
                  <div className="flex space-x-1 bg-slate-800/40 border border-slate-700/50 rounded-xl p-1">
                    <button
                      onClick={() => handleShare("facebook")}
                      className="p-1 hover:text-indigo-400 transition-colors"
                      title="Share to Facebook"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleShare("x")}
                      className="p-1 hover:text-indigo-400 transition-colors"
                      title="Share to X"
                    >
                      {/* X logo (new logo) */}
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="p-1 hover:text-indigo-400 transition-colors"
                      title="Share to LinkedIn"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. Comment Section (Disabled if Locked) */}
          {!isLocked && (
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
                  className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </form>

              {/* Comments list */}
              {comments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No comments posted yet. Add yours above!</p>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {comments.map((comment) => (
                    <div key={comment._id} className="p-4 rounded-2xl bg-slate-800/25 border border-slate-700/20 space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-white font-bold text-[10px]">
                          {comment.userPhoto ? (
                            <img src={comment.userPhoto} alt={comment.userName} className="w-full h-full object-cover" />
                          ) : (
                            comment.userName?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="text-xs font-semibold text-slate-200">{comment.userName}</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 pl-8 font-sans leading-relaxed">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info Panels */}
        <div className="space-y-6">
          {/* Metadata Block */}
          <div className="glass rounded-3xl border border-[var(--card-border)] p-6 space-y-4">
            <h3 className="font-bold text-lg font-display pb-2 border-b border-slate-800/40">Metadata</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><Calendar size={13} /> Created</span>
                <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><Clock size={13} /> Reading Time</span>
                <span>{getReadingTime(lesson.description)} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><Globe size={13} /> Visibility</span>
                <span>{lesson.visibility}</span>
              </div>
            </div>
          </div>

          {/* Engagement Statistics */}
          <div className="glass rounded-3xl border border-[var(--card-border)] p-6 space-y-4">
            <h3 className="font-bold text-lg font-display pb-2 border-b border-slate-800/40">Engagement</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3">
                <Heart size={16} className="text-rose-400 mx-auto mb-1" />
                <div className="text-sm font-bold text-slate-200">{likesCount}</div>
                <div className="text-[9px] text-slate-500 uppercase">Likes</div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3">
                <Bookmark size={16} className="text-cyan-400 mx-auto mb-1" />
                <div className="text-sm font-bold text-slate-200">{favCount}</div>
                <div className="text-[9px] text-slate-500 uppercase">Saved</div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3">
                <Eye size={16} className="text-indigo-400 mx-auto mb-1" />
                <div className="text-sm font-bold text-slate-200">{viewsCount}</div>
                <div className="text-[9px] text-slate-500 uppercase">Views</div>
              </div>
            </div>
          </div>

          {/* Author/Creator Card */}
          <div className="glass rounded-3xl border border-[var(--card-border)] p-6 space-y-4 text-center">
            <h3 className="font-bold text-lg font-display pb-2 border-b border-slate-800/40 text-left">About Author</h3>
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-700 mx-auto flex items-center justify-center text-white font-bold text-xl border-2 border-indigo-500/30 shadow-md">
                {lesson.creatorPhoto ? (
                  <img src={lesson.creatorPhoto} alt={lesson.creatorName} className="w-full h-full object-cover" />
                ) : (
                  lesson.creatorName?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-200">{lesson.creatorName}</h4>
                <p className="text-[10px] text-slate-400">Wise Contributor</p>
              </div>
              
              <Link
                href={`/public-lessons?search=${encodeURIComponent(lesson.creatorName)}`}
                className="block w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700/50 hover:text-white transition-colors"
              >
                View all lessons by author
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Similar & Recommended Lessons (6 cards max) */}
      {!isLocked && recommended.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-slate-800/40">
          <h2 className="text-2xl font-extrabold tracking-tight font-display text-gradient flex items-center gap-1.5">
            <Sparkles size={20} className="text-indigo-400" /> Similar Lessons You Might Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((item) => (
              <div
                key={item._id}
                className="glass rounded-2xl border border-[var(--card-border)] p-5 flex flex-col justify-between h-[280px] hover:shadow-lg transition-all relative overflow-hidden group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-400 uppercase tracking-wide">
                      {item.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase ${
                      item.accessLevel === "Premium" ? "bg-indigo-500/20 text-indigo-300" : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {item.accessLevel}
                    </span>
                  </div>
                  <h3 className="font-bold text-base leading-snug line-clamp-2 text-slate-100 group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">{item.creatorName}</span>
                  <Link
                    href={`/lessons/${item._id}`}
                    className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-500 text-[10px] font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Read Lesson
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Report Lesson Modal Confirmation */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass rounded-3xl border border-[var(--card-border)] p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-2 text-rose-400">
              <Flag size={20} />
              <h3 className="text-lg font-bold font-display">Report this lesson</h3>
            </div>
            <p className="text-xs text-slate-400">
              If this lesson contains inappropriate content, plagiarism, spam, or violates our terms, please specify the reason.
            </p>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                Reason for report
              </label>
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
              <button
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-750 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
