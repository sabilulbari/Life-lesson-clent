"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient, useSession } from "@/lib/auth-client";
// import { likeLesson, favoriteLesson, reportLesson, getComments, addComment, getLessons } from "@/actions/lessons";
import { ArrowLeft, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

// নতুন কম্পোনেন্টগুলো ইম্পোর্ট করুন
import LessonHeader from "@/components/lesson-details/LessonHeader";
import LessonBody from "@/components/lesson-details/LessonBody";
import LessonSidebar from "@/components/lesson-details/LessonSidebar";
import CommentSection from "@/components/lesson-details/CommentSection";
import ReportModal from "@/components/lesson-details/ReportModal";
import { getLessonById } from "@/actions/lessons";

export default function LessonDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const { data: session } = authClient.useSession();
  console.log(session, "sesson from details");

  const [lesson, setLesson] = useState(null);
  console.log(lesson, "lesson from page details");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [viewsCount, setViewsCount] = useState(0);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Spam");

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
      setViewsCount(Math.floor(Math.random() * 1000) + 150);

      if (session?.user) {
        setLiked(lessonData.likes?.includes(session.user.id));
        setFavorited(lessonData.favorites?.includes(session.user.id));
      }

      // const commentData = await getComments(id);
      // setComments(commentData || []);

      // const publicData = await getLessons({ category: lessonData.category });
      // const filtered = (publicData || []).filter((l) => l._id !== id).slice(0, 6);
      // setRecommended(filtered);
    } catch (err) {
      toast.error("Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, session]);

  const handleLike = async () => {
    if (!session) {
      toast.error("Please log in to like");
      router.push("/login");
      return;
    }
    try {
      const res = await likeLesson(id);
      if (res.error) toast.error(res.error);
      else {
        setLikesCount(res.likesCount);
        setLiked(res.likes?.includes(session.user.id));
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleFavorite = async () => {
    if (!session) {
      toast.error("Please log in to save to favorites");
      router.push("/login");
      return;
    }
    try {
      const res = await favoriteLesson(id);
      if (res.error) toast.error(res.error);
      else {
        setFavCount(res.favoritesCount);
        setFavorited(res.favorites?.includes(session.user.id));
        toast.success(res.favorites?.includes(session.user.id) ? "Saved to favorites!" : "Removed from favorites");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

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
      if (res.error) toast.error(res.error);
      else {
        setComments([res.comment, ...comments]);
        setNewComment("");
        toast.success("Comment added!");
      }
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const handleReportSubmit = async () => {
    if (!session) {
      toast.error("Please log in to report lessons");
      router.push("/login");
      return;
    }
    try {
      const res = await reportLesson(id, lesson.title, reportReason);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Thank you. Reported successfully.");
        setReportModalOpen(false);
      }
    } catch (err) {
      toast.error("Failed to report lesson");
    }
  };

  const getReadingTime = (text) => {
    if (!text) return 1;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 220));
  };

  const handleExportPDF = () => {
    if (!lesson) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold").setFontSize(22);
    doc.text(lesson.title, 20, 30);
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(100);
    doc.text(`Category: ${lesson.category} | Tone: ${lesson.emotionalTone}`, 20, 40);
    doc.text(`Author: ${lesson.creatorName} | Date: ${new Date(lesson.createdAt).toLocaleDateString()}`, 20, 45);
    doc.setDrawColor(200).line(20, 50, 190, 50);
    doc.setFontSize(12).setTextColor(0);
    const splitText = doc.splitTextToSize(lesson.description, 170);
    doc.text(splitText, 20, 60);
    doc.save(`${lesson.title.replace(/\s+/g, "_")}_lesson.pdf`);
    toast.success("Lesson exported as PDF!");
  };

  const shareURL = typeof window !== "undefined" ? window.location.href : "";
  const handleShare = (platform) => {
    let url = "";
    if (platform === "facebook") url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`;
    else if (platform === "x") url = `https://x.com/intent/tweet?url=${encodeURIComponent(shareURL)}&text=${encodeURIComponent(`Check out this life lesson: "${lesson?.title}"`)}`;
    else if (platform === "linkedin") url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareURL)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  if (loading) {
    return (
      <div className="grow flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <span className="text-sm text-slate-400 font-medium">Retrieving details...</span>
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  const isPremium = lesson.accessLevel === "Premium";
  const userPlan = session?.user?.plan || "free";
  const isLocked = isPremium && userPlan !== "premium" && session?.user?.role !== "admin" && session?.user?.id !== lesson.creatorId;

  return (
    <div className="space-y-10 pb-16">
      <div>
        <Link href="/public-lessons" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Browse</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Lesson Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-3xl border border-(--card-border) p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <LessonHeader lesson={lesson} isPremium={isPremium} />
            <LessonBody
              lesson={lesson}
              isLocked={isLocked}
              liked={liked}
              handleLike={handleLike}
              favorited={favorited}
              handleFavorite={handleFavorite}
              handleExportPDF={handleExportPDF}
              setReportModalOpen={setReportModalOpen}
              handleShare={handleShare}
            />
          </div>

          {!isLocked && <CommentSection comments={comments} session={session} newComment={newComment} setNewComment={setNewComment} handleCommentSubmit={handleCommentSubmit} />}
        </div>

        {/* Sidebar Info Panels */}
        <LessonSidebar lesson={lesson} readingTime={getReadingTime(lesson.description)} likesCount={likesCount} favCount={favCount} viewsCount={viewsCount} />
      </div>

      {/* Recommendations */}
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
                    <span className="font-semibold text-indigo-400 uppercase tracking-wide">{item.category}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase ${item.accessLevel === "Premium" ? "bg-indigo-500/20 text-indigo-300" : "bg-emerald-500/20 text-emerald-400"}`}
                    >
                      {item.accessLevel}
                    </span>
                  </div>
                  <h3 className="font-bold text-base leading-snug line-clamp-2 text-slate-100 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{item.description}</p>
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

      {/* Report Modal */}
      {reportModalOpen && (
        <ReportModal reportReason={reportReason} setReportReason={setReportReason} setReportModalOpen={setReportModalOpen} handleReportSubmit={handleReportSubmit} />
      )}
    </div>
  );
}

