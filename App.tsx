import { useState, useEffect } from 'react';
import { ActiveTab, Announcement } from './types';
import { INITIAL_ANNOUNCEMENTS, INITIAL_RESOURCES, SITE_CONFIG } from './data/config';
import { ToastProvider } from './components/Toast';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { WhatsAppFloating } from './components/WhatsAppFloating';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { ResourcesView } from './components/ResourcesView';
import { SupportView } from './components/SupportView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { AdminView } from './components/AdminView';
import { Footer } from './components/Footer';
import { ChevronRight, Home } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);

  // Initialize Dark Theme and custom announcements from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('mathict_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
    }

    // Load custom announcements from localStorage
    try {
      const raw = localStorage.getItem('mathict_announcements');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge custom announcements with initial
          setAnnouncements([...parsed, ...INITIAL_ANNOUNCEMENTS]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mathict_theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('mathict_theme', 'dark');
      setIsDark(true);
    }
  };

  const handleAddAnnouncement = (newAnn: Announcement) => {
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);

    // Save custom ones to localStorage
    const customOnly = updated.filter((a) => a.isCustom);
    localStorage.setItem('mathict_announcements', JSON.stringify(customOnly));
  };

  const handleRemoveAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);

    const customOnly = updated.filter((a) => a.isCustom);
    localStorage.setItem('mathict_announcements', JSON.stringify(customOnly));
  };

  const handleOrderPlaced = () => {
    let orders = parseInt(localStorage.getItem('mathict_downloads') || '19', 10);
    orders += 1;
    localStorage.setItem('mathict_downloads', String(orders));
  };

  // Breadcrumb helper
  const getTabLabel = (tab: ActiveTab) => {
    switch (tab) {
      case 'about':
        return 'About Mr. Dan';
      case 'resources':
        return 'Learning Resources';
      case 'support':
        return 'Student Support';
      case 'announcements':
        return 'Announcements';
      case 'admin':
        return 'Admin Panel';
      default:
        return 'Home';
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#EEF5FC] dark:bg-[#061A2E] text-[#142433] dark:text-[#EAF2FA] transition-colors duration-200 selection:bg-[#14B8A6]/20 selection:text-[#0B3E91]">
        {/* Sticky Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
          {/* Breadcrumb Navigation for interior pages */}
          {activeTab !== 'home' && (
            <div className="flex items-center gap-1.5 text-xs text-[#4E6478] dark:text-[#9FB6CC] mb-5 font-medium">
              <button
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#14B8A6] flex items-center gap-1"
              >
                <Home className="w-3.5 h-3.5" />
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              <span className="text-[#14B8A6] font-semibold">{getTabLabel(activeTab)}</span>
            </div>
          )}

          {/* Views */}
          {activeTab === 'home' && (
            <HomeView
              setActiveTab={setActiveTab}
              resourceCount={INITIAL_RESOURCES.length + 24}
            />
          )}

          {activeTab === 'about' && <AboutView />}

          {activeTab === 'resources' && (
            <ResourcesView onOrderPlaced={handleOrderPlaced} />
          )}

          {activeTab === 'support' && <SupportView />}

          {activeTab === 'announcements' && (
            <AnnouncementsView announcements={announcements} />
          )}

          {activeTab === 'admin' && (
            <AdminView
              announcements={announcements}
              onAddAnnouncement={handleAddAnnouncement}
              onRemoveAnnouncement={handleRemoveAnnouncement}
            />
          )}
        </main>

        {/* Footer */}
        <Footer setActiveTab={setActiveTab} />

        {/* Floating WhatsApp Action Button & Popup */}
        <WhatsAppFloating />

        {/* Mobile Quick Bottom Navigation */}
        <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </ToastProvider>
  );
}
