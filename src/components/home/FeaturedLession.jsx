"use client"; // ক্লায়েন্ট কম্পোনেন্ট ডিক্লেয়ার করা হলো

import { ArrowRight, Compass } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LessionCard from "./lessionCard/lessionCard";
import { getAllLessons } from "@/lib/api/lesson";
import { getUserSession } from "@/lib/core/session";
import { authClient } from "@/lib/auth-client";

const FeaturedLession = () => {
  const [lessonsData, setLessonsData] = useState([]);
  // const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const {data: session}= authClient.useSession(); // Assuming you have a custom hook for session management
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [lessons] = await Promise.all([getAllLessons()]);

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
          {lessonsData.slice(0, 6).map((lesson) => (
            <LessionCard key={lesson.id || lesson._id} lesson={lesson} session={session} />
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default FeaturedLession;
