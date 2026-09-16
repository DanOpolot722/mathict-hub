import { useState, useMemo } from 'react';
import { Announcement, AnnouncementCategory } from '../types';
import { Bell, Calendar, Tag, Filter, Sparkles } from 'lucide-react';

interface AnnouncementsViewProps {
  announcements: Announcement[];
}

export function AnnouncementsView({ announcements }: AnnouncementsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    if (selectedCategory === 'all') return announcements;
    return announcements.filter((a) => a.category === selectedCategory);
  }, [announcements, selectedCategory]);

  const getCategoryBadge = (cat: AnnouncementCategory) => {
    switch (cat) {
      case 'notes':
        return {
          label: 'New Notes',
          className: 'bg-[#2E7DF2]/15 text-[#2E7DF2] dark:text-[#58A6FF] border-[#2E7DF2]/30',
        };
      case 'exam':
        return {
          label: 'Exam Schedule',
          className: 'bg-[#F2A73B]/15 text-[#A9700C] dark:text-[#F2C572] border-[#F2A73B]/30',
        };
      case 'holiday':
        return {
          label: 'Holiday Work',
          className: 'bg-[#14B8A6]/15 text-[#14B8A6] dark:text-[#2FE0C4] border-[#14B8A6]/30',
        };
      case 'update':
      default:
        return {
          label: 'School Update',
          className: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
        };
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return { day: '—', mon: 'Latest' };
    }
    const day = String(d.getDate()).padStart(2, '0');
    const mon = d.toLocaleString('en-US', { month: 'short' });
    return { day, mon };
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Page Header */}
      <section className="relative overflow-hidden pt-8 pb-10 px-6 sm:px-8 rounded-3xl bg-gradient-to-br from-[#0B3E91] via-[#1451B8] to-[#2E7DF2] text-white shadow-lg">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#2FE0C4] text-xs font-mono font-medium">
            <Bell className="w-3.5 h-3.5" />
            Notice Board &amp; Updates
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            What's new, what's due, and what's coming up.
          </h1>
          <p className="text-sm sm:text-base text-[#C7D6DC] leading-relaxed">
            Stay up to date with new class notes, exam timetables, holiday assignment packets, and school updates posted regularly.
          </p>
        </div>
      </section>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all min-h-[40px] ${
            selectedCategory === 'all'
              ? 'bg-[#0B3E91] dark:bg-[#2E7DF2] text-white font-semibold shadow-sm'
              : 'bg-black/5 dark:bg-white/5 text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/10'
          }`}
        >
          All Updates
        </button>
        <button
          onClick={() => setSelectedCategory('notes')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all min-h-[40px] ${
            selectedCategory === 'notes'
              ? 'bg-[#2E7DF2] text-white font-semibold shadow-sm'
              : 'bg-black/5 dark:bg-white/5 text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/10'
          }`}
        >
          📘 New Notes
        </button>
        <button
          onClick={() => setSelectedCategory('exam')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all min-h-[40px] ${
            selectedCategory === 'exam'
              ? 'bg-[#F2A73B] text-white font-semibold shadow-sm'
              : 'bg-black/5 dark:bg-white/5 text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/10'
          }`}
        >
          ⏱️ Exam Schedules
        </button>
        <button
          onClick={() => setSelectedCategory('holiday')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all min-h-[40px] ${
            selectedCategory === 'holiday'
              ? 'bg-[#14B8A6] text-white font-semibold shadow-sm'
              : 'bg-black/5 dark:bg-white/5 text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/10'
          }`}
        >
          🏖️ Holiday Work
        </button>
        <button
          onClick={() => setSelectedCategory('update')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all min-h-[40px] ${
            selectedCategory === 'update'
              ? 'bg-purple-600 text-white font-semibold shadow-sm'
              : 'bg-black/5 dark:bg-white/5 text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/10'
          }`}
        >
          📢 School Updates
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4 max-w-3xl">
        {filtered.map((item) => {
          const badge = getCategoryBadge(item.category);
          const { day, mon } = formatDate(item.date);
          return (
            <div
              key={item.id}
              className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/70 dark:border-white/10 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* Date Box */}
              <div className="w-16 sm:w-20 py-2 sm:py-3 rounded-2xl bg-[#0B3E91]/10 dark:bg-white/10 text-center shrink-0 border border-[#2E7DF2]/20 flex flex-col items-center justify-center">
                <span className="font-display font-bold text-2xl sm:text-3xl text-[#0B3E91] dark:text-[#58A6FF] leading-none">
                  {day}
                </span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#4E6478] dark:text-[#9FB6CC] mt-1 font-semibold">
                  {mon}
                </span>
              </div>

              {/* Text Info */}
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                  {item.isCustom && (
                    <span className="text-[10px] font-mono text-[#14B8A6] font-semibold">
                      • Just posted
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA] leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#4E6478] dark:text-[#9FB6CC] leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 glass-panel rounded-3xl p-6">
            <Bell className="w-8 h-8 text-[#4E6478] mx-auto opacity-50 mb-2" />
            <p className="text-sm text-[#4E6478] dark:text-[#9FB6CC]">
              No announcements in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
