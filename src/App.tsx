import { useState, useEffect } from 'react';
import { ActiveTab, Announcement, ResourceItem, PricingPlan, SiteConfig } from './types';
import { INITIAL_ANNOUNCEMENTS, INITIAL_RESOURCES, INITIAL_PRICING, SITE_CONFIG } from './data/config';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './firebase/AuthContext';
import { 
  subscribeToAnnouncements, 
  subscribeToResources, 
  subscribeToPricing,
  subscribeToSettings 
} from './firebase/cmsService';
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
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [pricing, setPricing] = useState<PricingPlan[]>(INITIAL_PRICING);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(SITE_CONFIG);

  // Initialize Dark Theme and URL Hash Routing (e.g. #admin or ?admin)
  useEffect(() => {
    // Check if user navigated with #admin or ?admin=true
    const hash = window.location.hash.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    if (hash === '#admin' || params.has('admin')) {
      setActiveTab('admin');
    }

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

    const handleHashChange = () => {
      if (window.location.hash.toLowerCase() === '#admin') {
        setActiveTab('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Real-time Cloud Subscriptions
  useEffect(() => {
    const unsubAnnouncements = subscribeToAnnouncements((data) => {
      setAnnouncements(data);
    });

    const unsubResources = subscribeToResources((data) => {
      setResources(data);
    });

    const unsubPricing = subscribeToPricing((data) => {
      setPricing(data);
    });

    const unsubSettings = subscribeToSettings((data) => {
      setSiteConfig(data);
    });

    return () => {
      unsubAnnouncements();
      unsubResources();
      unsubPricing();
      unsubSettings();
    };
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
        return 'Student Support & Rates';
      case 'announcements':
        return 'Announcements';
      case 'admin':
        return 'Admin Portal (CMS)';
      default:
        return 'Home';
    }
  };

  return (
    <AuthProvider>
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
                resourceCount={resources.length + 24}
              />
            )}

            {activeTab === 'about' && <AboutView />}

            {activeTab === 'resources' && (
              <ResourcesView
                resources={resources}
                onOrderPlaced={handleOrderPlaced}
              />
            )}

            {activeTab === 'support' && (
              <SupportView pricing={pricing} />
            )}

            {activeTab === 'announcements' && (
              <AnnouncementsView announcements={announcements} />
            )}

            {activeTab === 'admin' && (
              <AdminView
                announcements={announcements}
                resources={resources}
                pricing={pricing}
                siteConfig={siteConfig}
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
    </AuthProvider>
  );
}
