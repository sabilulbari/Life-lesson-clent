import Footer from "@/components/Footer";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Digital Life Lessons | Share Wisdom & Personal Growth",
  description: "A premium platform to create, store, and share meaningful life lessons, personal growth insights, and wisdom. Join the community to learn and reflect.",
  keywords: "life lessons, wisdom, personal growth, mindful reflection, self improvement, database of knowledge",
  authors: [{ name: "Life Lessons Team" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px'
            },
            success: {
              iconTheme: {
                primary: '#6366f1',
                secondary: '#f8fafc',
              },
            },
          }} 
        />
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="grow flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Premium Footer */}
        <Footer/>
        <section className="w-full py-6 border-t border-(--card-border) glass text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              {/* <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs">
                L
              </div> */}
              <span className="font-semibold text-sm tracking-tight font-display bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Life Lessons
              </span>
            </div>
            <p>© {new Date().getFullYear()} Digital Life Lessons. Preserving personal wisdom and encouraging growth.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
