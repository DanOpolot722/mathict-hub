import React, { useState } from 'react';
import { SITE_CONFIG, buildWhatsAppLink } from '../data/config';
import { useToast } from './Toast';
import { 
  GraduationCap, 
  HelpCircle, 
  Compass, 
  Lightbulb, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export function SupportView() {
  const { showToast } = useToast();

  // Form 1: Online Tutoring
  const [tName, setTName] = useState('');
  const [tClass, setTClass] = useState('Senior 4');
  const [tSubject, setTSubject] = useState('Mathematics');
  const [tTopic, setTTopic] = useState('');

  // Form 2: Homework Help
  const [hName, setHName] = useState('');
  const [hSubject, setHSubject] = useState('Mathematics');
  const [hQuestion, setHQuestion] = useState('');

  // Form 3: Academic Consultation
  const [cName, setCName] = useState('');
  const [cTopic, setCTopic] = useState('');

  const handleSubmitTutoring = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }
    const message = `Hello Mr. Opolot Dan.\n\n*Online Tutoring Request*\n• Student Name: ${tName}\n• Class Level: ${tClass}\n• Subject: ${tSubject}\n• Topic / Assistance needed: ${tTopic || 'General syllabus revision'}`;
    showToast('Opening WhatsApp with your tutoring request...', 'success');
    window.open(buildWhatsAppLink(message), '_blank', 'noopener,noreferrer');
  };

  const handleSubmitHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hName.trim() || !hQuestion.trim()) {
      showToast('Please enter your name and question', 'error');
      return;
    }
    const message = `Hello Mr. Opolot Dan.\n\n*Homework Help Request*\n• Student Name: ${hName}\n• Subject: ${hSubject}\n• Question: ${hQuestion}`;
    showToast('Opening WhatsApp with your homework question...', 'success');
    window.open(buildWhatsAppLink(message), '_blank', 'noopener,noreferrer');
  };

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim() || !cTopic.trim()) {
      showToast('Please enter your name and topic', 'error');
      return;
    }
    const message = `Hello Mr. Opolot Dan.\n\n*Academic Consultation Request*\n• Student Name: ${cName}\n• Discussion Topic: ${cTopic}`;
    showToast('Opening WhatsApp with your consultation request...', 'success');
    window.open(buildWhatsAppLink(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Page Header */}
      <section className="relative overflow-hidden pt-8 pb-10 px-6 sm:px-8 rounded-3xl bg-gradient-to-br from-[#0B3E91] via-[#1451B8] to-[#14B8A6] text-white shadow-lg">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#2FE0C4] text-xs font-mono font-medium">
            <MessageSquare className="w-3.5 h-3.5" />
            Direct WhatsApp Academic Help
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Student Support &amp; Online Classes
          </h1>
          <p className="text-sm sm:text-base text-[#C7D6DC] leading-relaxed">
            Every form on this page formats your exact question and sends it directly to <strong className="text-white">{SITE_CONFIG.teacherName}</strong> on WhatsApp — no account creation or login required.
          </p>
        </div>
      </section>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form 1: Tutoring */}
        <div id="tutoring" className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/15 text-[#14B8A6] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                Book Online Tutoring
              </h2>
              <p className="text-xs text-[#4E6478] dark:text-[#9FB6CC]">
                1-on-1 or small-group live revision sessions
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitTutoring} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={tName}
                onChange={(e) => setTName(e.target.value)}
                placeholder="e.g. Grace Auma"
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:ring-2 focus:ring-[#14B8A6] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  Class / Level
                </label>
                <select
                  value={tClass}
                  onChange={(e) => setTClass(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:ring-2 focus:ring-[#14B8A6] focus:outline-none"
                >
                  <option>Senior 1</option>
                  <option>Senior 2</option>
                  <option>Senior 3</option>
                  <option>Senior 4</option>
                  <option>Senior 5</option>
                  <option>Senior 6</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  Subject
                </label>
                <select
                  value={tSubject}
                  onChange={(e) => setTSubject(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:ring-2 focus:ring-[#14B8A6] focus:outline-none"
                >
                  <option>Mathematics</option>
                  <option>ICT</option>
                  <option>Both Subjects</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                Topic or What You Need Help With
              </label>
              <textarea
                rows={2}
                value={tTopic}
                onChange={(e) => setTTopic(e.target.value)}
                placeholder="e.g. Quadratic equations, circle geometry, or Excel formulas..."
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:ring-2 focus:ring-[#14B8A6] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow transition-all active:scale-98"
            >
              <Send className="w-4 h-4" />
              Send Tutoring Request via WhatsApp
            </button>
          </form>
        </div>

        {/* Form 2: Homework Help */}
        <div id="homework" className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7DF2]/15 text-[#2E7DF2] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                Homework Help
              </h2>
              <p className="text-xs text-[#4E6478] dark:text-[#9FB6CC]">
                Stuck on a problem? Describe it and receive guidance
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitHomework} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={hName}
                onChange={(e) => setHName(e.target.value)}
                placeholder="e.g. John Okello"
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:ring-2 focus:ring-[#2E7DF2] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                Subject
              </label>
              <select
                value={hSubject}
                onChange={(e) => setHSubject(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:ring-2 focus:ring-[#2E7DF2] focus:outline-none"
              >
                <option>Mathematics</option>
                <option>ICT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                Your Question / Problem Details
              </label>
              <textarea
                rows={3}
                required
                value={hQuestion}
                onChange={(e) => setHQuestion(e.target.value)}
                placeholder="Type or paste the specific question here..."
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:ring-2 focus:ring-[#2E7DF2] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow transition-all active:scale-98"
            >
              <Send className="w-4 h-4" />
              Send Question via WhatsApp
            </button>
          </form>
        </div>

        {/* Form 3: Academic Consultation */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2A73B]/15 text-[#F2A73B] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                Academic Consultation
              </h2>
              <p className="text-xs text-[#4E6478] dark:text-[#9FB6CC]">
                Subject choice, study timetables, and career advice
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitConsultation} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                placeholder="e.g. Patricia Amuge"
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:ring-2 focus:ring-[#F2A73B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                What Would You Like to Discuss?
              </label>
              <textarea
                rows={4}
                required
                value={cTopic}
                onChange={(e) => setCTopic(e.target.value)}
                placeholder="e.g. Choosing A-Level subject combinations (PCM, PEM, BCM) or preparing for mock exams..."
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:ring-2 focus:ring-[#F2A73B] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow transition-all active:scale-98"
            >
              <Send className="w-4 h-4" />
              Request Consultation via WhatsApp
            </button>
          </form>
        </div>

        {/* Study Guidance Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0B3E91] via-[#1451B8] to-[#0A244E] text-white shadow-lg space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#2FE0C4]">
              <Lightbulb className="w-6 h-6" />
              <h2 className="text-lg font-bold text-white">
                Study Guidance for Uganda
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#C7D6DC] leading-relaxed">
              Practices that consistently help secondary students improve from pass to distinction in Mathematics &amp; ICT:
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-[#C7D6DC] pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2FE0C4] shrink-0 mt-0.5" />
                <span><strong>Redo worked examples</strong> without looking at solutions, then cross-check your steps.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2FE0C4] shrink-0 mt-0.5" />
                <span><strong>Timed past paper practice:</strong> Train yourself to finish Paper 1 within UNEB time limits.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2FE0C4] shrink-0 mt-0.5" />
                <span><strong>For ICT:</strong> Hands-on usage is essential. Reading about Excel without clicking isn't enough.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2FE0C4] shrink-0 mt-0.5" />
                <span><strong>Ask specific questions early</strong> rather than a general panic the night before exams.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-white/15">
            <a
              href={buildWhatsAppLink("Hello Mr. Dan, I would like study planning advice for my upcoming examinations.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-[#2FE0C4]" />
              Ask a Study Question Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
