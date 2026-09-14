import { ActiveTab } from '../types';
import { Home, User, BookOpen, MessageCircle, Bell } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export function MobileBottomNav({ activeTab, setActiveTab }: MobileBottomNavProps) {
  const navItems: { id: ActiveTab; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'resources', label: 'Notes', icon: BookOpen },
    { id: 'support', label: 'Support', icon: MessageCircle },
    { id: 'about', label: 'About', icon: User },
    { id: 'announcements', label: 'Updates', icon: Bell },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile quick navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-[#08152B]/95 backdrop-blur-xl border-t border-[#2E7DF2]/15 dark:border-white/10 px-2 py-1.5 pb-safe flex items-center justify-around shadow-lg shadow-black/10"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all ${
              isActive
                ? 'text-[#14B8A6] font-bold scale-105'
                : 'text-[#4E6478] dark:text-[#9FB6CC] hover:text-[#0B3E91] dark:hover:text-white'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              {item.id === 'support' && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#25D366] ring-2 ring-white dark:ring-[#08152B]" />
              )}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
