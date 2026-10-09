"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Search, SlidersHorizontal, Lock, ArrowRight, BookOpen, Smile, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { getLessons } from "@/lib/api/lesson";
import Image from "next/image";

const CATEGORIES = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
const TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function PublicLessonsContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  // URL parameters থেকে 'search' ফিল্ডের মান রিড করা
  const initialSearch = searchParams.get("search") || "";
  const initialPageNumber = Number(searchParams.get("currentPageNumber")) || 1;
  const initialLimit = Number(searchParams.get("limit")) || 9;

  const [lessons, setLessons] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true); // শুধু প্রথমবার full spinner
  const [isFetching, setIsFetching] = useState(false); // পরের সব fetch-এ পুরোনো data দেখাবে

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch); // শুধু search-এ debounce
  const [currentPageNumber, setCurrentPageNumber] = useState(initialPageNumber);
  const [limit, setLimit] = useState(initialLimit);
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");
  const [sort, setSort] = useState("newest");

  const [totalPageArray, setTotalPageArray] = useState([]);

  const resultsTopRef = useRef(null);
  const isFirstRender = useRef(true);

  // URL query পরিবর্তন হলে state আপডেট করা
  useEffect(() => {
    const urlSearchQuery = searchParams.get("search");
    const urlPageNumber = Number(searchParams.get("currentPageNumber")) || 1;
    const urlLimit = Number(searchParams.get("limit")) || 9;
    if (urlSearchQuery !== null) {
      setSearch(urlSearchQuery);
    }
    setCurrentPageNumber(urlPageNumber);
    setLimit(urlLimit);
  }, [searchParams]);

  // Search input-এর জন্য debounce (page/filter/sort-এ কোনো delay নেই)
  useEffect(() => {
    if (search === debouncedSearch) return;
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search, debouncedSearch]);

  // Fetch lessons (stale response ignore করা হয়েছে)
  useEffect(() => {
    let cancelled = false;

    const loadLessons = async () => {
      setIsFetching(true);
      try {
        const { data, total_page } = await getLessons({
          category,
          emotionalTone: tone,
          search: debouncedSearch,
          currentPageNumber,
          limit,
          sort,
        });

        if (cancelled) return;

        const safeTotalPages = Math.max(0, Number(total_page) || 0);
        setLessons(data || []);
        setTotalPageArray(Array.from({ length: safeTotalPages }, (_, index) => index + 1));

        // Data count কমে গেলে current page valid range-এর মধ্যে রাখি।
        if (safeTotalPages > 0 && currentPageNumber > safeTotalPages) {
          setCurrentPageNumber(safeTotalPages);
        }
      } catch (err) {
        if (!cancelled) toast.error("Failed to load lessons");
      } finally {
        if (!cancelled) {
          setIsFetching(false);
          setInitialLoading(false);
        }
      }
    };

    loadLessons();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, category, tone, sort, currentPageNumber, limit]);

  // Page change হলে results-এর উপরে smooth scroll (page jump/reload feel নেই)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    resultsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPageNumber]);

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategory("");
    setTone("");
    setSort("newest");
    setCurrentPageNumber(1);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="relative z-10 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient">Explore Public Wisdom</h1>
        <p className="text-sm text-slate-400">Browse personal realizations, mistakes learned, and guidance shared by our global community.</p>
      </div>

      {/* Filter and Control Panel */}
      <div className="glass p-5 rounded-2xl border border-[var(--card-border)] space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPageNumber(1);
              }}
              placeholder="Search by title, author, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-foreground transition-all"
            />
          </div>

          {/* Sort Selection */}
          <div className="flex items-center space-x-2 min-w-50">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPageNumber(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/50 outline-none text-sm text-foreground focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="mostSaved">Most Saved</option>
            </select>
          </div>
        </div>

        {/* Categories & Tones filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Category Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <BookOpen size={12} /> Category:
            </span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPageNumber(1);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/50 outline-none text-xs text-foreground focus:border-indigo-500 cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Tone Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Smile size={12} /> Tone:
            </span>
            <select
              value={tone}
              onChange={(e) => {
                setTone(e.target.value);
                setCurrentPageNumber(1);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/50 outline-none text-xs text-foreground focus:border-indigo-500 cursor-pointer"
            >
              <option value="">All Tones</option>
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {(search || category || tone || sort !== "newest") && (
            <button onClick={clearFilters} className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline ml-auto transition-colors">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Scroll anchor for results */}
      <div ref={resultsTopRef} className="scroll-mt-24" />

      {/* Grid of cards */}
      {initialLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
          <span className="text-sm text-slate-400">Loading collective wisdom...</span>
        </div>
      ) : lessons.length === 0 && !isFetching ? (
        <div className="glass p-16 text-center rounded-3xl border border-(--card-border) space-y-3">
          <SlidersHorizontal size={40} className="mx-auto text-indigo-400/50" />
          <h3 className="font-semibold text-lg text-slate-200">No lessons matched your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Try adjusting your search query, selecting a different category/tone, or writing your own life lesson!</p>
        </div>
      ) : (
        <div className="relative">
          {/* Small non-blocking loading indicator while next page loads */}
          {isFetching && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-lg">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <span className="text-[11px] text-slate-300">Loading...</span>
            </div>
          )}

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${isFetching ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
            {lessons.map((lesson) => {
              const isPremium = lesson?.accessLevel === "Premium";
              const userPlan = session?.user?.plan || "free";
              const isLocked = isPremium && userPlan !== "Premium" && session?.user?.role !== "admin" && session?.user?.id !== lesson.creatorId;

              return (
                <div
                  key={lesson._id}
                  className="glass rounded-2xl border border-[var(--card-border)] p-5 flex flex-col justify-between min-h-[420px] hover:shadow-xl transition-all relative overflow-hidden group"
                >
                  {/* Lock Screen overlay if locked */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-4 text-center">
                      <Lock size={36} className="text-indigo-400 mb-2 animate-bounce" />
                      <h3 className="font-bold text-white text-base">Premium Lesson</h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-[200px] mb-4">Upgrade to Premium to view this lesson and details.</p>
                      <Link href="/pricing" className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors">
                        Upgrade to View
                      </Link>
                    </div>
                  )}

                  {/* Card Main Body */}
                  <div className="space-y-3 flex-1 flex flex-col">
                    {/* 1. Header Area */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-indigo-400 uppercase tracking-wide">{lesson.category}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase ${
                          isPremium ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {lesson.accessLevel}
                      </span>
                    </div>

                    {/* 2. Image Area */}
                    {lesson.image && (
                      <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-800/55 bg-slate-900 flex items-center justify-center shrink-0">
                        <Image
                          src={lesson.image}
                          alt={lesson.title}
                          height={150}
                          width={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* 3. Text Details Area */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-base leading-snug line-clamp-2 text-slate-100 group-hover:text-indigo-400 transition-colors">{lesson.title}</h3>

                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{lesson.description}</p>
                    </div>

                    {/* 4. Emotional Tone Indicator */}
                    <div className="self-start inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/60 text-slate-300 text-[10px] font-semibold border border-slate-700/50">
                      <Sparkles size={8} /> {lesson.emotionalTone}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-800/40 flex items-center justify-between shrink-0">
                    {/* Creator */}
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                        {lesson.creatorPhoto ? (
                          <img src={lesson.creatorPhoto} alt={lesson.creatorName} className="w-full h-full object-cover" />
                        ) : (
                          lesson.creatorName?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">{lesson.creatorName}</div>
                        <div className="text-[10px] text-slate-500">{new Date(lesson.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* Details Button */}
                    <Link
                      href={`/public-lessons/${lesson._id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-indigo-500 border border-slate-700/50 hover:border-indigo-400 font-semibold text-xs text-slate-200 hover:text-white transition-all duration-300 flex items-center space-x-1"
                    >
                      <span>See Details</span>
                      <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagination: client-side state update, no Link wrapper/reload */}
      {totalPageArray.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 px-4 py-3 rounded-xl">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Showing page <span className="font-semibold text-slate-900 dark:text-slate-200">{currentPageNumber}</span> of{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-200">{totalPageArray.length}</span> pages
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1">
            <button
              type="button"
              disabled={isFetching || currentPageNumber <= 1}
              onClick={() => setCurrentPageNumber((page) => Math.max(1, Number(page) - 1))}
              className="text-xs font-semibold rounded-lg px-3 py-1.5 border border-slate-300 dark:border-slate-700/60 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            {totalPageArray.map((page) => {
              const isCurrent = page === currentPageNumber;
              return (
                <button
                  key={page}
                  type="button"
                  aria-current={isCurrent ? "page" : undefined}
                  disabled={isFetching}
                  onClick={() => setCurrentPageNumber(page)}
                  className={`text-xs font-medium min-w-8 px-3 py-1.5 rounded-lg border transition-all duration-200 disabled:cursor-wait ${
                    isCurrent
                      ? "bg-indigo-600 text-white border-indigo-500 font-bold shadow-sm shadow-indigo-500/30"
                      : "bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              disabled={isFetching || currentPageNumber >= totalPageArray.length}
              onClick={() => setCurrentPageNumber((page) => Math.min(totalPageArray.length, Number(page) + 1))}
              className="text-xs font-semibold rounded-lg px-3 py-1.5 border border-slate-300 dark:border-slate-700/60 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
