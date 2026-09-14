import { ActiveTab } from '../types';
import { SITE_CONFIG, buildWhatsAppLink } from '../data/config';
import { BookOpen, MessageSquare, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export function Footer({ setActiveTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#08152B] text-[#C7D6DC] pt-14 pb-24 lg:pb-12 border-t border-white/10 transition-colors">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2E7DF2] to-[#14B8A6] flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-sm">
                OD
              </div>
              <span className="font-semibold text-lg text-white">
                {SITE_CONFIG.teacherName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#9FB6CC] leading-relaxed max-w-sm">
              Secondary Mathematics &amp; ICT Learning Hub for Ugandan learners. Structured revision notes, UNEB past papers, and personal 1-on-1 tutoring.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-[#2FE0C4] border border-white/10">
                🇺🇬 Uganda · O-Level &amp; A-Level
              </span>
            </div>
          </div>

          {/* Col 2: Explore */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-mono text-xs font-bold uppercase tracking-widest text-[#2FE0C4]">
              Explore
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-white transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  Teacher Biography
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('resources')}
                  className="hover:text-white transition-colors text-left"
                >
                  All Resources (S1–S6)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('announcements')}
                  className="hover:text-white transition-colors text-left"
                >
                  Notice Board
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-mono text-xs font-bold uppercase tracking-widest text-[#2FE0C4]">
              Student Support
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => handleNav('support')}
                  className="hover:text-white transition-colors text-left"
                >
                  Book Online Tutoring
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('support')}
                  className="hover:text-white transition-colors text-left"
                >
                  Homework Help Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="hover:text-white transition-colors text-left text-white/50 hover:text-white"
                >
                  Teacher Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="font-mono text-xs font-bold uppercase tracking-widest text-[#2FE0C4]">
              Direct Contact
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#25D366] hover:underline"
                >
                  <span>WhatsApp: +{SITE_CONFIG.whatsappNumber}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-[#9FB6CC]">
                  Drive: {SITE_CONFIG.driveEmail}
                </span>
              </li>
              <li>
                <span className="text-[#9FB6CC]">
                  {SITE_CONFIG.teacherName} · Uganda
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8DA0A8] text-center sm:text-left">
          <p>
            © {currentYear} {SITE_CONFIG.teacherName}. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built for Mathematics &amp; ICT secondary learners across Uganda.
          </p>
        </div>
      </div>
    </footer>
  );
}
