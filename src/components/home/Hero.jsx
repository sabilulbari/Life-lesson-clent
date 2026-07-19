"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import React, { useEffect, useState } from 'react';

const Hero = () => {
      const [currentSlide, setCurrentSlide] = useState(0);
    

    const slides = [
      {
        title: "Preserve Your Inner Wisdom",
        description: "Write down and organize key life lessons, personal realizations, and valuable mistakes so you never forget the milestones that shaped you.",
        cta: "Start Writing",
        link: "/dashboard/add-lesson",
        bg: "from-indigo-950 via-slate-900 to-indigo-900",
      },
      {
        title: "Explore Collective Intelligence",
        description: "Gain perspective from stories shared by authors, parents, and leaders from around the world. Search and filter by category or emotional tone.",
        cta: "Browse Wisdom",
        link: "/public-lessons",
        bg: "from-slate-900 via-indigo-950 to-cyan-950",
      },
      {
        title: "Unlock Premium Wisdom",
        description: "Join our Premium tier to access exclusive life lessons, post paid insights, and accelerate your personal growth journey.",
        cta: "Upgrade Now",
        link: "/pricing",
        bg: "from-cyan-950 via-slate-900 to-indigo-950",
      },
    ];

      useEffect(() => {
        // Auto-advance slider
        const timer = setInterval(() => {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
      }, [slides.length]);
    return (
      <div>
        <div className="relative h-[420px] rounded-3xl overflow-hidden glass border border-[var(--card-border)] shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`absolute inset-0 bg-linear-to-br ${slides[currentSlide].bg} flex items-center px-6 sm:px-12 md:px-20 py-8`}
            >
              {/* Background elements */}
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />

              <div className="max-w-2xl relative z-10 space-y-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={12} /> Live Reflection
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold font-display leading-tight text-white">{slides[currentSlide].title}</h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{slides[currentSlide].description}</p>
                <div>
                  <Link
                    href={slides[currentSlide].link}
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 font-semibold text-sm text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                  >
                    <span>{slides[currentSlide].cta}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all ${currentSlide === i ? "bg-indigo-400 w-8" : "bg-slate-500/50 hover:bg-slate-400"}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
};

export default Hero;