"use client";

import { useState } from "react";
import MobileHeader from "./MobileHeader";
import Sidebar from "./Sidebar";

export default function DashboardClientWrapper({ session, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="grow flex flex-col md:flex-row gap-6 py-4">
      {/* Mobile Top Bar */}
      <MobileHeader session={session} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar Section */}
      <aside className={`md:w-64 shrink-0 ${sidebarOpen ? "block" : "hidden"} md:block z-30`}>
        <Sidebar session={session} closeMobileMenu={() => setSidebarOpen(false)} />
      </aside>

      {/* Main Content Area */}
      <div className="grow max-w-full overflow-hidden">
        <div className="glass rounded-3xl border border-(--card-border) p-6 sm:p-8 min-h-137.5 flex flex-col justify-between">
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
