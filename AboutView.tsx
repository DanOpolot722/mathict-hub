import { SITE_CONFIG, buildWhatsAppLink } from '../data/config';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Target, 
  Compass, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export function AboutView() {
  const whatsappUrl = buildWhatsAppLink("Hello Mr. Opolot Dan. I reviewed your profile on the Learning Hub and would like to connect.");

  return (
    <div className="space-y-10 pb-16">
      {/* Page Header */}
      <section className="relative overflow-hidden pt-8 pb-10 px-6 sm:px-8 rounded-3xl bg-gradient-to-br from-[#0B3E91] via-[#1451B8] to-[#2E7DF2] text-white shadow-lg">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#2FE0C4] text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Teacher Biography &amp; Background
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Teaching Mathematics and ICT the way I wish I'd been taught.
          </h1>
          <p className="text-sm sm:text-base text-[#C7D6DC] leading-relaxed">
            A little about my academic background, what I specialise in, and why this learning hub was created for Ugandan secondary students.
          </p>
        </div>
      </section>

      {/* Main Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Profile Card */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm text-center space-y-5">
            {/* Avatar Photo */}
            <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#14B8A6] shadow-xl bg-[#0B3E91]">
              <img
                src="/assets/dan-avatar.jpg"
                alt="Mr. Opolot Dan"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                {SITE_CONFIG.teacherName}
              </h3>
              <p className="text-xs sm:text-sm text-[#4E6478] dark:text-[#9FB6CC] mt-1 font-medium">
                Secondary Mathematics &amp; ICT Teacher · Uganda
              </p>
            </div>

            {/* Quick Contact Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5A] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow transition-all hover:scale-102 active:scale-98"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              Message on WhatsApp
            </a>

            {/* Qualification Badges */}
            <div className="pt-2 flex flex-wrap justify-center gap-1.5 border-t border-gray-200 dark:border-white/10">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#2E7DF2]/15 text-[#2E7DF2] dark:text-[#58A6FF]">
                BSCED
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#14B8A6]/15 text-[#14B8A6]">
                Mathematics
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#14B8A6]/15 text-[#14B8A6]">
                ICT
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-gray-100 dark:bg-white/10 text-[#4E6478] dark:text-[#9FB6CC]">
                O-Level
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-gray-100 dark:bg-white/10 text-[#4E6478] dark:text-[#9FB6CC]">
                A-Level
              </span>
            </div>

            <div className="pt-2 text-xs text-[#4E6478] dark:text-[#9FB6CC] space-y-1 text-left bg-black/5 dark:bg-white/5 p-3 rounded-xl font-mono">
              <p>📍 Location: Uganda (Kumi &amp; Nationwide)</p>
              <p>✉️ Email: {SITE_CONFIG.driveEmail}</p>
              <p>📞 Phone: +{SITE_CONFIG.whatsappNumber}</p>
            </div>
          </div>
        </aside>

        {/* Right Content Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Biography */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-[#0B3E91] dark:text-[#58A6FF]">
              <GraduationCap className="w-6 h-6 text-[#14B8A6]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                Biography
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#4E6478] dark:text-[#9FB6CC] leading-relaxed">
              I am a qualified Secondary School Teacher of Mathematics and ICT based in Uganda, holding a <strong>Bachelor of Science with Education (BSCED) from Kumi University</strong>. My work centres on making both subjects less intimidating — Mathematics through patient, step-by-step reasoning, and ICT through genuinely hands-on practice rather than theory alone.
            </p>
            <p className="text-sm sm:text-base text-[#4E6478] dark:text-[#9FB6CC] leading-relaxed">
              This hub grew out of notes, revision packets, and past examination solutions I was preparing for my own classes, reorganised so that any student with a phone or computer anywhere in Uganda can access structured, high-quality revision materials without financial hurdles.
            </p>
          </div>

          {/* Qualifications & Timeline */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5">
              <Award className="w-6 h-6 text-[#2E7DF2]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                Qualifications &amp; Training
              </h2>
            </div>

            <div className="space-y-4 border-l-2 border-[#14B8A6]/40 pl-4 sm:pl-6 ml-2 sm:ml-3">
              {/* Item 1 */}
              <div className="relative group">
                <span className="absolute -left-[23px] sm:-left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#14B8A6] ring-4 ring-white dark:ring-[#08152B]" />
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#14B8A6]">
                  Degree Qualification
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA] mt-0.5">
                  Bachelor of Science with Education (BSCED) — Mathematics
                </h3>
                <p className="text-xs sm:text-sm text-[#4E6478] dark:text-[#9FB6CC] mt-1 leading-relaxed">
                  <strong>Kumi University, Uganda</strong>. A rigorous programme combining strong subject mastery in pure &amp; applied mathematics with professional educational pedagogy, qualifying me to instruct at secondary school level (UCE &amp; UACE).
                </p>
              </div>

              {/* Item 2 */}
              <div className="relative group pt-2">
                <span className="absolute -left-[23px] sm:-left-[31px] top-3.5 w-3.5 h-3.5 rounded-full bg-[#2E7DF2] ring-4 ring-white dark:ring-[#08152B]" />
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#2E7DF2]">
                  Specialisation
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA] mt-0.5">
                  Secondary Mathematics (O-Level &amp; A-Level) and ICT
                </h3>
                <p className="text-xs sm:text-sm text-[#4E6478] dark:text-[#9FB6CC] mt-1 leading-relaxed">
                  Focus areas include algebra, geometry, statistics, calculus, and mechanics for Mathematics; spreadsheet modeling, database systems, word processing, and digital citizenship for ICT.
                </p>
              </div>

              {/* Item 3 */}
              <div className="relative group pt-2">
                <span className="absolute -left-[23px] sm:-left-[31px] top-3.5 w-3.5 h-3.5 rounded-full bg-[#F2A73B] ring-4 ring-white dark:ring-[#08152B]" />
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#F2A73B]">
                  Continuous Practice
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA] mt-0.5">
                  Curriculum Updates &amp; Digital Pedagogical Research
                </h3>
                <p className="text-xs sm:text-sm text-[#4E6478] dark:text-[#9FB6CC] mt-1 leading-relaxed">
                  Regularly revising teaching notes to align with revised lower secondary curriculum (NLSC) and UNEB national assessment standards.
                </p>
              </div>
            </div>
          </div>

          {/* Areas of Specialisation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/70 dark:border-white/10 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#2E7DF2]/15 text-[#2E7DF2] flex items-center justify-center font-bold">
                ∑
              </div>
              <h3 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                Mathematics
              </h3>
              <p className="text-xs sm:text-sm text-[#4E6478] dark:text-[#9FB6CC] leading-relaxed">
                Algebra, coordinate geometry, trigonometry, statistics, introductory &amp; advanced calculus, matrices, and mechanics for O-Level and A-Level.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/70 dark:border-white/10 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/15 text-[#14B8A6] flex items-center justify-center font-bold">
                &lt;/&gt;
              </div>
              <h3 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
                ICT
              </h3>
              <p className="text-xs sm:text-sm text-[#4E6478] dark:text-[#9FB6CC] leading-relaxed">
                Computer fundamentals, spreadsheets (MS Excel / Calc), word processing, database management (Access), internet research, and UNEB practical exam prep.
              </p>
            </div>
          </div>

          {/* Vision & Mission Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B3E91] to-[#1451B8] text-white shadow-md space-y-2">
              <div className="flex items-center gap-2 text-[#2FE0C4]">
                <Target className="w-5 h-5" />
                <span className="text-xs font-mono uppercase font-bold tracking-wider">Vision</span>
              </div>
              <p className="text-sm text-[#C7D6DC] leading-relaxed">
                A generation of Ugandan students who see Mathematics and ICT as tools they can use confidently in their careers and daily lives, not subjects to fear.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1451B8] to-[#14B8A6] text-white shadow-md space-y-2">
              <div className="flex items-center gap-2 text-[#2FE0C4]">
                <Compass className="w-5 h-5" />
                <span className="text-xs font-mono uppercase font-bold tracking-wider">Mission</span>
              </div>
              <p className="text-sm text-[#C7D6DC] leading-relaxed">
                To provide clear, accessible, and well-organised learning materials and direct 1-on-1 tutoring support to every secondary learner who reaches out.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
