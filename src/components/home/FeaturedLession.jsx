"use client"; // ক্লায়েন্ট কম্পোনেন্ট ডিক্লেয়ার করা হলো

import { ArrowRight, Compass, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LessionCard from "./lessionCard/lessionCard";
import { getAllLessons, getFeaturedLesson } from "@/lib/api/lesson";
import { getUserSession } from "@/lib/core/session";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const FeaturedLession = () => {
  const [lessonsData, setLessonsData] = useState([]);
  // const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession(); // Assuming you have a custom hook for session management
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const lessons = await getFeaturedLesson();

        setLessonsData(lessons || []);
      } catch (error) {
        console.error("Error loading featured insights:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-75 bg-slate-800/20 rounded-2xl border border-(--card-border)" />
        ))}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gradient">Featured Insights</h2>
          <p className="text-sm text-slate-400 mt-1">Handpicked wisdom curated by editors.</p>
        </div>
        <Link href="/public-lessons" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center space-x-1">
          <span>View All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {lessonsData.length === 0 ? (
        <div className="glass p-12 text-center rounded-2xl border border-(--card-border) text-slate-400">
          <Compass size={40} className="mx-auto text-indigo-400/50 mb-3" />
          <p className="text-sm">No featured insights available yet. Check back soon!</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessonsData.map((lesson) => {
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
                        <Image src={lesson.creatorPhoto} width={50} height={50} alt={lesson.creatorName} className="w-full h-full object-cover" />
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
        </motion.div>
      )}
    </section>
  );
};

export default FeaturedLession;
