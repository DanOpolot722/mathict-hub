import { useState } from 'react';
import { ActiveTab } from '../types';
import { SITE_CONFIG } from '../data/config';
import { Moon, Sun, Menu, X, MessageSquare, BookOpen, GraduationCap, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

export function Header({ activeTab, setActiveTab, isDark, toggleDarkMode }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 h-16 md:h-18 w-full border-b transition-colors duration-200 backdrop-blur-md bg-white/70 dark:bg-[#08152B]/80 border-[#2E7DF2]/15 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#2E7DF2] to-[#14B8A6] flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-sm group-hover:scale-105 transition-transform">
            OD
          </div>
          <div>
            <span className="block font-semibold text-base leading-none text-[#0B3E91] dark:text-[#EAF2FA] tracking-tight">
              {SITE_CONFIG.teacherName}
            </span>
            <small className="block text-[11px] font-medium text-[#4E6478] dark:text-[#9FB6CC] mt-0.5 tracking-normal">
              {SITE_CONFIG.tagline}
            </small>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'home'
                ? 'text-[#14B8A6] bg-[#14B8A6]/10 font-semibold'
                : 'text-[#142433] dark:text-[#EAF2FA] hover:text-[#14B8A6] dark:hover:text-[#2FE0C4]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'about'
                ? 'text-[#14B8A6] bg-[#14B8A6]/10 font-semibold'
                : 'text-[#142433] dark:text-[#EAF2FA] hover:text-[#14B8A6] dark:hover:text-[#2FE0C4]'
            }`}
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('resources')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'resources'
                ? 'text-[#14B8A6] bg-[#14B8A6]/10 font-semibold'
                : 'text-[#142433] dark:text-[#EAF2FA] hover:text-[#14B8A6] dark:hover:text-[#2FE0C4]'
            }`}
          >
            Resources
          </button>
          <button
            onClick={() => handleNavClick('support')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'support'
                ? 'text-[#14B8A6] bg-[#14B8A6]/10 font-semibold'
                : 'text-[#142433] dark:text-[#EAF2FA] hover:text-[#14B8A6] dark:hover:text-[#2FE0C4]'
            }`}
          >
            Student Support
          </button>
          <button
            onClick={() => handleNavClick('announcements')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'announcements'
                ? 'text-[#14B8A6] bg-[#14B8A6]/10 font-semibold'
                : 'text-[#142433] dark:text-[#EAF2FA] hover:text-[#14B8A6] dark:hover:text-[#2FE0C4]'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
              activeTab === 'admin'
                ? 'text-[#2E7DF2] bg-[#2E7DF2]/10 font-bold'
                : 'text-[#4E6478] dark:text-[#9FB6CC] hover:text-[#2E7DF2]'
            }`}
          >
            Admin
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 dark:border-white/15 bg-white/60 dark:bg-white/5 text-[#142433] dark:text-[#EAF2FA] hover:text-[#14B8A6] dark:hover:text-[#2FE0C4] hover:border-[#14B8A6]/40 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Direct CTA */}
          <button
            onClick={() => handleNavClick('support')}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#14B8A6] hover:bg-[#2FE0C4] hover:text-[#0B3E91] transition-all shadow-sm hover:shadow active:scale-95"
          >
            <GraduationCap className="w-4 h-4" />
            Join Classes
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="lg:hidden w-11 h-11 rounded-xl flex items-center justify-center border border-gray-200 dark:border-white/15 bg-white/80 dark:bg-white/5 text-[#0B3E91] dark:text-[#EAF2FA] active:scale-95"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-white/95 dark:bg-[#061A2E]/95 backdrop-blur-xl border-b border-[#2E7DF2]/15 dark:border-white/10 shadow-2xl p-5 flex flex-col gap-2.5 animate-in slide-in-from-top-2 duration-200 z-50">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left font-medium min-h-[48px] ${
              activeTab === 'home'
                ? 'bg-[#14B8A6]/15 text-[#14B8A6] font-semibold'
                : 'text-[#142433] dark:text-[#EAF2FA] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <span>Home</span>
            <Sparkles className="w-4 h-4 opacity-70" />
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left font-medium min-h-[48px] ${
              activeTab === 'about'
                ? 'bg-[#14B8A6]/15 text-[#14B8A6] font-semibold'
                : 'text-[#142433] dark:text-[#EAF2FA] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <span>About Mr. Dan</span>
            <span className="text-xs font-mono text-[#4E6478] dark:text-[#9FB6CC]">BScEd</span>
          </button>
          <button
            onClick={() => handleNavClick('resources')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left font-medium min-h-[48px] ${
              activeTab === 'resources'
                ? 'bg-[#14B8A6]/15 text-[#14B8A6] font-semibold'
                : 'text-[#142433] dark:text-[#EAF2FA] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <span>Learning Resources (S1–S6)</span>
            <BookOpen className="w-4 h-4 opacity-70" />
          </button>
          <button
            onClick={() => handleNavClick('support')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left font-medium min-h-[48px] ${
              activeTab === 'support'
                ? 'bg-[#14B8A6]/15 text-[#14B8A6] font-semibold'
                : 'text-[#142433] dark:text-[#EAF2FA] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <span>Student Support (Tutoring & Help)</span>
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
          </button>
          <button
            onClick={() => handleNavClick('announcements')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left font-medium min-h-[48px] ${
              activeTab === 'announcements'
                ? 'bg-[#14B8A6]/15 text-[#14B8A6] font-semibold'
                : 'text-[#142433] dark:text-[#EAF2FA] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <span>Announcements & Updates</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#2E7DF2]/15 text-[#2E7DF2] font-semibold">
              Live
            </span>
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left font-medium min-h-[48px] ${
              activeTab === 'admin'
                ? 'bg-[#2E7DF2]/15 text-[#2E7DF2] font-semibold'
                : 'text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <span>Teacher Admin Panel</span>
            <span className="text-xs font-mono">🔒</span>
          </button>
        </div>
      )}
    </header>
  );
}
