"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Preserve Your Inner Wisdom",
      description: "Write down and organize key life lessons, personal realizations, and valuable mistakes so you never forget the milestones that shaped you.",
      cta: "Start Writing",
      link: "/dashboard/add-lesson",
      image: "/bg.png",
    },
    {
      title: "Explore Collective Intelligence",
      description: "Gain perspective from stories shared by authors, parents, and leaders from around the world. Discover lessons that help you see life differently.",
      cta: "Browse Wisdom",
      link: "/public-lessons",
      image: "/bg2.png",
    },
    {
      title: "Unlock Premium Wisdom",
      description: "Discover exclusive insights, share valuable experiences, and accelerate your personal growth journey with Life Lesson Premium.",
      cta: "Upgrade Now",
      link: "/premium",
      image: "/bg3.png",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="w-full">
      {" "}
      <div className="relative h-[440px] sm:h-[460px] lg:h-[480px] overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[#f5f7fa] shadow-2xl dark:bg-[#111126]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url("${slide.image}")`,
              }}
              aria-hidden="true"
            />

            {/* Theme-aware left-to-right gradient */}
            <div
              className="
            absolute inset-0
            bg-gradient-to-r
            from-[#f5f7fa]
            via-[#f5f7fa]/95
            to-[#f5f7fa]/10

            dark:from-[#17143d]
            dark:via-[#211d50]/95
            dark:via-60%
            dark:to-[#111126]/10
          "
              aria-hidden="true"
            />

            {/* Brand color glow */}
            <div
              className="
            pointer-events-none absolute inset-0
            bg-gradient-to-r
            from-[#4f46e5]/10
            via-[#06b6d4]/5
            to-transparent
            dark:from-[#4f46e5]/30
            dark:via-[#06b6d4]/15
            dark:to-transparent
          "
              aria-hidden="true"
            />

            {/* Hero content */}
            <div className="relative z-10 flex h-full items-center px-6 py-10 sm:px-12 md:px-16 lg:px-20">
              <div className="max-w-xl space-y-5">
                {/* Badge */}
                <span
                  className="
                inline-flex items-center gap-2
                rounded-full border
                border-[#4f46e5]/20
                bg-white/70 px-3 py-1.5
                text-xs font-bold uppercase tracking-wider
                text-[#4f46e5]
                backdrop-blur-sm

                dark:border-[#06b6d4]/30
                dark:bg-[#4f46e5]/20
                dark:text-[#a5f3fc]
              "
                >
                  <Sparkles size={14} />
                  Life Lesson • Learn & Grow
                </span>

                {/* Title */}
                <h1
                  className="
                font-display text-3xl font-extrabold
                leading-tight text-slate-900
                sm:text-4xl lg:text-5xl
                dark:text-white
              "
                >
                  {slide.title}
                </h1>

                {/* Description */}
                <p
                  className="
                max-w-lg text-sm leading-relaxed
                text-slate-600 sm:text-base
                dark:text-slate-200
              "
                >
                  {slide.description}
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href={slide.link}
                    className="
                  inline-flex items-center gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-[#4f46e5] to-[#06b6d4]
                  px-6 py-3 text-sm font-semibold text-white
                  shadow-lg shadow-indigo-500/20
                  transition-all duration-300
                  hover:scale-[1.02] hover:shadow-indigo-500/30
                "
                  >
                    {slide.cta}
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    href="/public-lessons"
                    className="
                  inline-flex items-center gap-2
                  rounded-xl border
                  border-[#4f46e5]/20
                  bg-white/70 px-6 py-3
                  text-sm font-semibold text-slate-700
                  backdrop-blur-sm transition-all
                  hover:bg-white

                  dark:border-white/20
                  dark:bg-white/10
                  dark:text-white
                  dark:hover:bg-white/15
                "
                  >
                    Explore Lessons
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentSlide === index ? "true" : undefined}
              className={`
            h-2.5 rounded-full transition-all duration-300
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-[#06b6d4]
            focus-visible:ring-offset-2
            ${currentSlide === index ? "w-8 bg-[#4f46e5] dark:bg-[#06b6d4]" : "w-2.5 bg-slate-400/70 hover:bg-[#06b6d4]"}
          `}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
