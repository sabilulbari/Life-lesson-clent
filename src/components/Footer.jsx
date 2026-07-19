"use client";
import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-(--card-border) bg-background px-6 py-12 md:px-12 lg:px-20 overflow-hidden font-sans">
      {/* Subtle Premium Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-70" />

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Brand Column */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              {/* Premium Glass Icon Container */}
              <div className="glass p-2.5 text-[var(--primary)] rounded-xl shadow-[0_8px_16px_rgba(99,102,241,0.15)] flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <div>
                {/* Heading using font-display (Outfit) and Text Gradient */}
                <h2 className="text-xl font-bold tracking-tight leading-none text-gradient font-display">Life Lessons</h2>
                <span className="text-[10px] font-semibold tracking-widest text-[var(--foreground)] opacity-60 uppercase">Prove Your Worth</span>
              </div>
            </div>

            <p className="text-sm text-[var(--foreground)] opacity-70 max-w-sm leading-relaxed">
              Lessonly - Digital Life Lessons Platform. Share your wisdom and learn from others.
            </p>

            {/* Social Icons with Theme matching Glass Hover effects */}
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="glass glass-hover p-2.5 text-[var(--primary)] rounded-xl flex items-center justify-center">
                <FaXTwitter size={18} />
              </a>
              <a href="#" className="glass glass-hover p-2.5 text-[var(--accent)] rounded-xl flex items-center justify-center">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="glass glass-hover p-2.5 text-[var(--primary)] rounded-xl flex items-center justify-center">
                <FaLinkedin size={18} />
              </a>
              <a href="#" className="glass glass-hover p-2.5 text-red-500 rounded-xl flex items-center justify-center">
                <FaYoutube size={18} />
              </a>
              <a href="#" className="glass glass-hover p-2.5 text-[var(--foreground)] rounded-xl flex items-center justify-center">
                <FaGithub size={18} />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4 lg:pl-8">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-[2px] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] font-display">Platform</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-[var(--foreground)] opacity-70">
              <li>
                <Link href="/" className="hover:text-[var(--primary)] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/lessons" className="hover:text-[var(--primary)] transition-colors">
                  Lessons
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[var(--primary)] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[var(--primary)] transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4 lg:pl-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-[2px] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] font-display">Company</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-[var(--foreground)] opacity-70">
              <li>
                <Link href="/about" className="hover:text-[var(--primary)] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[var(--primary)] transition-colors">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--primary)] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-[var(--primary)] transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-[2px] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] font-display">Legal</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-[var(--foreground)] opacity-70">
              <li>
                <Link href="/terms" className="hover:text-[var(--primary)] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[var(--primary)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-[var(--primary)] transition-colors">
                  Cookie Settings
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-[var(--primary)] transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Premium Glass Newsletter Subscription Row */}
        <div className="mt-12 pt-8 border-t border-[var(--card-border)] max-w-md">
          <h4 className="text-sm font-bold text-[var(--foreground)] font-display mb-3">Subscribe to our newsletter</h4>
          <form onSubmit={(e) => e.preventDefault()} className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="glass w-full px-4 py-2.5 text-sm rounded-xl text-[var(--foreground)] placeholder:text-[var(--foreground)] placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all font-sans"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-medium text-sm rounded-xl transition-all shadow-md hover:opacity-90 active:scale-95 font-display"
            >
              Join
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
