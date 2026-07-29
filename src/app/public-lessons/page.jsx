"use client";

import PublicLessonsContent from "@/components/lesson-details/PublicLessonsContent";
import { Suspense } from "react";

export default function PublicLessonsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <PublicLessonsContent />
    </Suspense>
  );
}
