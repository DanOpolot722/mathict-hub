import { useState, useEffect } from 'react';
import { SITE_CONFIG, buildWhatsAppLink } from '../data/config';
import { ArrowUp, X, Send, Sparkles } from 'lucide-react';

export function WhatsAppFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [customMsg, setCustomMsg] = useState(
    'Hello Mr. Opolot Dan. I need assistance with Mathematics/ICT studies.'
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 320);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendWhatsApp = () => {
    const url = buildWhatsAppLink(customMsg.trim() || SITE_CONFIG.whatsappMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Container */}
      <div className="fixed bottom-18 md:bottom-7 right-4 md:right-6 z-40 flex flex-col items-end gap-2.5">
        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/90 dark:bg-[#0E2540]/90 backdrop-blur-md border border-gray-200 dark:border-white/15 text-[#142433] dark:text-[#EAF2FA] shadow-md hover:shadow-lg flex items-center justify-center transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <ArrowUp className="w-5 h-5 text-[#2E7DF2]" />
          </button>
        )}

        {/* WhatsApp Floating Action Button */}
        <div className="relative">
          <button
            id="fab-whatsapp-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Chat with Mr. Opolot Dan on WhatsApp"
            className="group flex items-center gap-2 px-3.5 py-3 md:p-3.5 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#1EBE5A] transition-all hover:scale-105 active:scale-95 ring-4 ring-[#25D366]/20"
          >
            <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M17.6 6.3A8.9 8.9 0 0012 4a8.9 8.9 0 00-7.7 13.4L3 21l3.7-1.2A8.9 8.9 0 0012 20.9a8.9 8.9 0 006.3-15.2A8.9 8.9 0 0017.6 6.3zm-5.6 13a7.3 7.3 0 01-3.7-1l-.3-.2-2.2.7.7-2.1-.2-.3A7.4 7.4 0 1119.4 12 7.4 7.4 0 0112 19.3zm4-5.5c-.2-.1-1.3-.6-1.5-.7s-.3-.1-.5.1-.6.7-.8.9-.3.2-.5.1a6 6 0 01-1.8-1.1 6.7 6.7 0 01-1.2-1.5c-.1-.2 0-.3.1-.5l.4-.4.2-.4v-.4c-.1-.1-.5-1.2-.7-1.7s-.4-.4-.5-.4h-.4a.9.9 0 00-.6.3 2.6 2.6 0 00-.8 1.9 4.5 4.5 0 001 2.4 10.2 10.2 0 003.9 3.5c.5.2 1 .4 1.3.5a3.1 3.1 0 001.4.1 2.3 2.3 0 001.5-1.1c.2-.3.2-.6.1-.7z" />
            </svg>
            <span className="hidden md:inline font-semibold text-xs pr-1">Chat on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Modal / Popup */}
      {isOpen && (
        <div
          id="whatsapp-chat-popup"
          className="fixed bottom-32 md:bottom-22 right-4 md:right-6 z-50 w-[calc(100vw-32px)] max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#0A1E33] animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-[#25D366] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-base">
                OD
              </div>
              <div>
                <strong className="block text-sm font-semibold leading-tight">
                  {SITE_CONFIG.teacherName}
                </strong>
                <span className="text-[11px] text-white/90 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Secondary Math & ICT Teacher
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-black/10 text-white transition-colors"
              aria-label="Close WhatsApp chat popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            <div className="rounded-xl bg-[#EEF5FC] dark:bg-white/5 p-3 text-xs text-[#142433] dark:text-[#EAF2FA] leading-relaxed">
              <p className="flex items-center gap-1 font-semibold text-[#0B3E91] dark:text-[#58A6FF] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Direct WhatsApp Support
              </p>
              Hi there! Ask questions about O-Level or A-Level Mathematics, request ICT practical guidance, or inquire about notes.
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4E6478] dark:text-[#9FB6CC] mb-1.5">
                Your message:
              </label>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                rows={3}
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                placeholder="Type your question or request..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSendWhatsApp}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
              >
                <Send className="w-4 h-4" />
                Open WhatsApp
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/15 text-[#4E6478] dark:text-[#9FB6CC] hover:bg-gray-100 dark:hover:bg-white/5 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
