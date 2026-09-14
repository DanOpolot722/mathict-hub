import React, { useState, useEffect } from 'react';
import { Announcement, AnnouncementCategory } from '../types';
import { SITE_CONFIG } from '../data/config';
import { useToast } from './Toast';
import { 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Bell, 
  FolderCheck, 
  Check, 
  Copy
} from 'lucide-react';

interface AdminViewProps {
  announcements: Announcement[];
  onAddAnnouncement: (newAnn: Announcement) => void;
  onRemoveAnnouncement: (id: string) => void;
}

const VALID_PASSCODES = ['15000314', 'opolot2026'];

export function AdminView({
  announcements,
  onAddAnnouncement,
  onRemoveAnnouncement,
}: AdminViewProps) {
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [adminTab, setAdminTab] = useState<'announcements' | 'settings' | 'help'>('announcements');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('notes');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [body, setBody] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('mathict_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (VALID_PASSCODES.includes(passcode.trim())) {
      setIsAuthenticated(true);
      sessionStorage.setItem('mathict_admin_auth', 'true');
      showToast('Admin access granted', 'success');
      setPasscode('');
    } else {
      showToast('Incorrect passcode. Try again.', 'error');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('mathict_admin_auth');
    showToast('Signed out of Admin', 'info');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      showToast('Please provide both title and details', 'error');
      return;
    }

    const newAnn: Announcement = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category,
      date: date || new Date().toISOString().slice(0, 10),
      body: body.trim(),
      isCustom: true,
    };

    onAddAnnouncement(newAnn);
    showToast('New announcement posted successfully!', 'success');
    setTitle('');
    setBody('');
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied to clipboard: ${text}`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 pb-20">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 dark:border-white/10 shadow-lg text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#0B3E91]/10 dark:bg-white/10 text-[#0B3E91] dark:text-[#58A6FF] flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
              Admin Sign-In
            </h1>
            <p className="text-xs sm:text-sm text-[#4E6478] dark:text-[#9FB6CC] mt-1.5 leading-relaxed">
              Enter the teacher admin passcode to post announcements and manage site parameters.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1.5">
                Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full p-3.5 text-sm rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[#0B3E91] hover:bg-[#1451B8] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Unlock className="w-4 h-4" />
              Sign In to Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#14B8A6]">
            Teacher Portal
          </span>
          <h1 className="text-2xl font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
            Admin Control Panel
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 self-start sm:self-auto min-h-[40px]"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-white/10 pb-2">
        <button
          onClick={() => setAdminTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
            adminTab === 'announcements'
              ? 'bg-[#0B3E91] text-white shadow-sm'
              : 'text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/5'
          }`}
        >
          <Bell className="w-4 h-4" />
          Announcements Manager
        </button>
        <button
          onClick={() => setAdminTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
            adminTab === 'settings'
              ? 'bg-[#0B3E91] text-white shadow-sm'
              : 'text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/5'
          }`}
        >
          <Settings className="w-4 h-4" />
          Site Settings &amp; Folders
        </button>
        <button
          onClick={() => setAdminTab('help')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
            adminTab === 'help'
              ? 'bg-[#0B3E91] text-white shadow-sm'
              : 'text-[#4E6478] dark:text-[#9FB6CC] hover:bg-black/5'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          How This Works
        </button>
      </div>

      {/* Tab 1: Announcements */}
      {adminTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Post Form */}
          <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#14B8A6]" />
              Post New Announcement
            </h2>
            <p className="text-xs text-[#4E6478] dark:text-[#9FB6CC]">
              Posts appear immediately on the student Announcements page.
            </p>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior 4 mock examination timetable released"
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                  >
                    <option value="notes">📘 New Notes</option>
                    <option value="exam">⏱️ Exam Schedule</option>
                    <option value="holiday">🏖️ Holiday Work</option>
                    <option value="update">📢 School Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B3E91] dark:text-[#EAF2FA] mb-1">
                  Details / Body
                </label>
                <textarea
                  rows={3}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Explain what was uploaded, due dates, or contact instructions..."
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-[#061A2E] text-[#142433] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[#14B8A6] hover:bg-[#2FE0C4] text-white hover:text-[#0B3E91] font-semibold text-sm flex items-center justify-center gap-2 shadow transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                Publish Announcement
              </button>
            </form>
          </div>

          {/* List of Announcements */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
              Posted Announcements ({announcements.length})
            </h2>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="glass-panel p-4 rounded-2xl border border-white/70 dark:border-white/10 shadow-xs flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0B3E91]/10 text-[#0B3E91] dark:text-[#58A6FF] font-semibold">
                        {ann.category.toUpperCase()}
                      </span>
                      <span className="text-xs text-[#4E6478] dark:text-[#9FB6CC]">
                        {ann.date}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0B3E91] dark:text-[#EAF2FA] truncate">
                      {ann.title}
                    </h3>
                    <p className="text-xs text-[#4E6478] dark:text-[#9FB6CC] line-clamp-2">
                      {ann.body}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onRemoveAnnouncement(ann.id);
                      showToast('Announcement removed', 'info');
                    }}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0"
                    title="Remove announcement"
                    aria-label="Remove announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Settings */}
      {adminTab === 'settings' && (
        <div className="max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
              Active Site Settings
            </h2>
            <p className="text-xs text-[#4E6478] dark:text-[#9FB6CC] mt-1">
              These values power the WhatsApp messaging, contact displays, and Google Drive embeds across all pages.
            </p>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#061A2E] border border-gray-200 dark:border-white/10 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#4E6478] dark:text-[#9FB6CC] block font-mono">
                  Teacher Name:
                </span>
                <strong className="text-sm text-[#0B3E91] dark:text-[#EAF2FA]">
                  {SITE_CONFIG.teacherName}
                </strong>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#061A2E] border border-gray-200 dark:border-white/10 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#4E6478] dark:text-[#9FB6CC] block font-mono">
                  WhatsApp Number:
                </span>
                <strong className="text-sm text-[#0B3E91] dark:text-[#EAF2FA]">
                  +{SITE_CONFIG.whatsappNumber}
                </strong>
              </div>
              <button
                onClick={() => handleCopy(SITE_CONFIG.whatsappNumber, 'wa')}
                className="p-2 rounded-lg hover:bg-black/5 text-[#2E7DF2]"
              >
                {copiedKey === 'wa' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#061A2E] border border-gray-200 dark:border-white/10 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#4E6478] dark:text-[#9FB6CC] block font-mono">
                  Google Drive Email:
                </span>
                <strong className="text-sm text-[#0B3E91] dark:text-[#EAF2FA]">
                  {SITE_CONFIG.driveEmail}
                </strong>
              </div>
              <button
                onClick={() => handleCopy(SITE_CONFIG.driveEmail, 'email')}
                className="p-2 rounded-lg hover:bg-black/5 text-[#2E7DF2]"
              >
                {copiedKey === 'email' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#061A2E] border border-gray-200 dark:border-white/10 space-y-2">
              <span className="text-[11px] text-[#4E6478] dark:text-[#9FB6CC] block font-mono">
                Shared Google Drive Folder IDs:
              </span>
              <div className="space-y-1 font-mono text-xs text-[#0B3E91] dark:text-[#58A6FF]">
                <p>• Mathematics: {SITE_CONFIG.driveFolders.mathematics}</p>
                <p>• ICT: {SITE_CONFIG.driveFolders.ict}</p>
                <p>• Past Papers: {SITE_CONFIG.driveFolders.pastPapers}</p>
                <p>• Assignments: {SITE_CONFIG.driveFolders.assignments}</p>
                <p>• Marking Guides: {SITE_CONFIG.driveFolders.markingGuides}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Help */}
      {adminTab === 'help' && (
        <div className="max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/70 dark:border-white/10 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#0B3E91] dark:text-[#EAF2FA]">
            How This Learning Hub Operates
          </h2>
          <ul className="space-y-3 text-xs sm:text-sm text-[#4E6478] dark:text-[#9FB6CC] leading-relaxed list-disc pl-5">
            <li>
              <strong>Direct WhatsApp Workflow:</strong> When students tap "Order via WhatsApp" or submit Tutoring / Homework forms, an encoded WhatsApp link opens with their pre-filled request. You receive the message directly on your phone (+{SITE_CONFIG.whatsappNumber}) without any intermediary server.
            </li>
            <li>
              <strong>Free Samples vs. Premium:</strong> Foundation materials (e.g. S1 notes) download directly. Higher-level full syllabus notes are designated as Premium so you can distribute them directly upon order.
            </li>
            <li>
              <strong>Google Drive Integration:</strong> Folder files load directly from Google Drive's public shared folder view. Ensure folders are shared as <em>"Anyone with the link can view"</em>.
            </li>
            <li>
              <strong>Mobile-First Design:</strong> The interface is tailored for smartphones with high touch accessibility (min 44px targets), bottom quick navigation, and instant touch response.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
