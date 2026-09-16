import { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { SITE_CONFIG, buildWhatsAppLink } from '../data/config';
import danPortrait from '../assets/images/dan-portrait.jpg';
import danAvatar from '../assets/images/dan-avatar.jpg';
import { 
  BookOpen, 
  Monitor, 
  MessageCircle, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  DownloadCloud, 
  Users, 
  FileText,
  Calendar,
  ExternalLink
} from 'lucide-react';

interface HomeViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  resourceCount: number;
}

export function HomeView({ setActiveTab, resourceCount }: HomeViewProps) {
  const [visitorCount, setVisitorCount] = useState<number>(128);
  const [orderCount, setOrderCount] = useState<number>(0);

  useEffect(() => {
    // Visitor counter
    let visits = parseInt(localStorage.getItem('mathict_visits') || '142', 10);
    const sessionVisited = sessionStorage.getItem('mathict_visited_session');
    if (!sessionVisited) {
      visits += 1;
      localStorage.setItem('mathict_visits', String(visits));
      sessionStorage.setItem('mathict_visited_session', '1');
    }
    setVisitorCount(visits);

    // Order counter
    const orders = parseInt(localStorage.getItem('mathict_downloads') || '19', 10);
    setOrderCount(orders);
  }, []);

  const whatsappDirectUrl = buildWhatsAppLink();

  return (
    <div className="space-y-12 md:space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12 md:pb-20 rounded-3xl bg-gradient-to-br from-[#0B3E91] via-[#1451B8] to-[#0A2E68] text-white shadow-xl">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#6FD1FF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#14B8A6]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text column */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#2FE0C4] text-xs font-mono font-medium tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#2FE0C4] animate-ping" />
                Mathematics · ICT · Kumi &amp; beyond, Uganda
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Learn Mathematics &amp; ICT with clarity, structure, and someone in your corner.
              </h1>

              <p className="text-base sm:text-lg text-[#C7D6DC] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Curated notes, past papers, marking schemes and 1-on-1 support for O-Level and A-Level students — created by{' '}
                <span className="text-white font-semibold">{SITE_CONFIG.teacherName}</span>, qualified secondary educator in Uganda.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-semibold text-sm md:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/25 transition-all hover:scale-102 active:scale-98"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.6 6.3A8.9 8.9 0 0012 4a8.9 8.9 0 00-7.7 13.4L3 21l3.7-1.2A8.9 8.9 0 0012 20.9a8.9 8.9 0 006.3-15.2A8.9 8.9 0 0017.6 6.3zm-5.6 13a7.3 7.3 0 01-3.7-1l-.3-.2-2.2.7.7-2.1-.2-.3A7.4 7.4 0 1119.4 12 7.4 7.4 0 0112 19.3zm4-5.5c-.2-.1-1.3-.6-1.5-.7s-.3-.1-.5.1-.6.7-.8.9-.3.2-.5.1a6 6 0 01-1.8-1.1 6.7 6.7 0 01-1.2-1.5c-.1-.2 0-.3.1-.5l.4-.4.2-.4v-.4c-.1-.1-.5-1.2-.7-1.7s-.4-.4-.5-.4h-.4a.9.9 0 00-.6.3 2.6 2.6 0 00-.8 1.9 4.5 4.5 0 001 2.4 10.2 10.2 0 003.9 3.5c.5.2 1 .4 1.3.5a3.1 3.1 0 001.4.1 2.3 2.3 0 001.5-1.1c.2-.3.2-.6.1-.7z" />
                  </svg>
                  Contact on WhatsApp
                </a>

                <button
                  onClick={() => {
                    setActiveTab('resources');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl border-1.5 border-white/30 hover:border-white text-white font-medium text-sm md:text-base flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-98"
                >
                  <BookOpen className="w-5 h-5 text-[#2FE0C4]" />
                  Access Learning Materials
                </button>
              </div>

              {/* Live counter strip */}
              <div className="pt-6 grid grid-cols-3 gap-3 sm:gap-6 border-t border-white/15 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <span className="block font-mono text-2xl sm:text-3xl font-bold text-[#2FE0C4]">
                    {resourceCount || '40+'}
                  </span>
                  <span className="text-xs text-[#A9BAC0]">Resources available</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="block font-mono text-2xl sm:text-3xl font-bold text-[#58A6FF]">
                    {visitorCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#A9BAC0]">Learners visited</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="block font-mono text-2xl sm:text-3xl font-bold text-[#F2A73B]">
                    {orderCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#A9BAC0]">Orders placed</span>
                </div>
              </div>
            </div>

            {/* Photo Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-xs sm:max-w-sm">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-gradient-to-t from-[#0B3E91] to-transparent">
                  <img
                    src={danPortrait}
                    alt="Portrait of Mr. Opolot Dan, Mathematics and ICT teacher"
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Mathematical -> ICT Signature Floating Badge */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-[#08152B]/90 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-white/25 shadow-xl max-w-[190px]">
                  <svg viewBox="0 0 160 90" className="w-full h-10">
                    <path
                      className="curve-path"
                      d="M8,75 C36,75 36,15 64,15 C84,15 84,55 104,55"
                    />
                    <path
                      className="trace-path"
                      d="M104,55 L120,55 L120,35 L136,35 L136,45 L152,45"
                    />
                    <circle className="node-pulse" cx="64" cy="15" r="3" />
                    <circle className="node-pulse" cx="104" cy="55" r="3" style={{ animationDelay: '1.2s' }} />
                    <circle className="node-pulse" cx="152" cy="45" r="3" style={{ animationDelay: '2.2s' }} />
                  </svg>
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-[#2FE0C4] text-center mt-1 font-semibold">
                    Mathematics → ICT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Subject Pillars (What's Here) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto px-4 space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-[#14B8A6] uppercase">
            Curriculum &amp; Support
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
            Everything you need for Mathematics &amp; ICT
          </h2>
          <p className="text-sm sm:text-base text-[#4E6478] dark:text-[#9FB6CC]">
            Structured according to the UNEB syllabus for Senior 1 through Senior 6, with immediate access for students and teachers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Mathematics */}
          <div className="glass-panel p-6 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2E7DF2] to-[#14B8A6] flex items-center justify-center text-white shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                  Mathematics (S1–S6)
                </h3>
                <span className="text-xs font-mono text-[#14B8A6] font-semibold block mt-0.5">
                  O-Level &amp; A-Level
                </span>
              </div>
              <p className="text-sm text-[#4E6478] dark:text-[#9FB6CC] leading-relaxed">
                Step-by-step notes, algebra, geometry, calculus, mechanics, and worked UNEB past papers that make complex formulas easy to digest.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('resources');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mt-6 pt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-sm font-semibold text-[#2E7DF2] hover:text-[#14B8A6] group"
            >
              <span>Explore Mathematics Notes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: ICT */}
          <div className="glass-panel p-6 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#2FE0C4] flex items-center justify-center text-white shadow-sm">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                  ICT (S1–S4)
                </h3>
                <span className="text-xs font-mono text-[#14B8A6] font-semibold block mt-0.5">
                  Theory &amp; Practical Hands-on
                </span>
              </div>
              <p className="text-sm text-[#4E6478] dark:text-[#9FB6CC] leading-relaxed">
                Word processing, spreadsheet formulas, database architecture, and computer fundamental guides designed for hands-on mastery.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('resources');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mt-6 pt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-sm font-semibold text-[#14B8A6] hover:text-[#2FE0C4] group"
            >
              <span>Explore ICT Resources</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 3: Direct Support */}
          <div className="glass-panel p-6 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#25D366] to-[#14B8A6] flex items-center justify-center text-white shadow-sm">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                  Direct Student Support
                </h3>
                <span className="text-xs font-mono text-[#25D366] font-semibold block mt-0.5">
                  1-on-1 WhatsApp Assistance
                </span>
              </div>
              <p className="text-sm text-[#4E6478] dark:text-[#9FB6CC] leading-relaxed">
                Stuck on a tricky homework question or need revision guidance? Send your question or book an online tutoring session with Mr. Dan.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('support');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mt-6 pt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-sm font-semibold text-[#25D366] hover:text-[#1EBE5A] group"
            >
              <span>Book Help or Tutoring</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Teacher Profile Strip */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/70 dark:border-white/10 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 text-center sm:text-left">
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-[#14B8A6] shadow-md bg-[#0B3E91]">
              <img
                src={danAvatar}
                alt="Mr. Opolot Dan Avatar"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#25D366] ring-2 ring-white dark:ring-[#08152B] flex items-center justify-center text-[10px] text-white">
              ✓
            </span>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                {SITE_CONFIG.teacherName}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#2E7DF2]/15 text-[#2E7DF2]">
                BSCED · Mathematics
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#14B8A6]/15 text-[#14B8A6]">
                Kumi University
              </span>
            </div>
            <p className="text-sm text-[#4E6478] dark:text-[#9FB6CC] leading-relaxed max-w-2xl">
              Qualified secondary educator dedicated to demystifying Mathematics and practical ICT. Making formulas approachable and digital tools productive for learners across Uganda.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="shrink-0 min-h-[44px] px-5 py-2.5 rounded-xl border border-[#2E7DF2]/30 hover:border-[#2E7DF2] text-[#0B3E91] dark:text-[#58A6FF] hover:bg-[#2E7DF2]/10 font-semibold text-sm transition-all"
          >
            Read Teacher Bio
          </button>
        </div>
      </section>

      {/* Direct Callout Banner */}
      <section className="rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-br from-[#0B3E91] via-[#1451B8] to-[#14B8A6] text-white shadow-xl space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white max-w-lg mx-auto">
          Need academic help or notes right now?
        </h2>
        <p className="text-sm sm:text-base text-[#C7D6DC] max-w-md mx-auto">
          Send a quick message on WhatsApp and connect directly with Mr. Dan. No passwords or registration required.
        </p>
        <div className="pt-2">
          <a
            href={whatsappDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold text-sm md:text-base shadow-lg shadow-black/20 hover:scale-102 active:scale-98 transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            Chat Directly on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
