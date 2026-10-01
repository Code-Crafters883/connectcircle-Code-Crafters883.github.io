import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { soundService } from '../services/soundService';
import { Home, Users, MessageSquare, Compass, Sparkles, Settings } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  unreadMessagesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  unreadMessagesCount = 0,
}) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'connections', label: t.connections.title, icon: Users },
    { id: 'messages', label: t.messaging.title, icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'communities', label: t.communitiesScreen.title, icon: Compass },
    { id: 'activities', label: t.activitiesScreen.title, icon: Sparkles },
    { id: 'settings', label: t.settings.title, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                soundService.playTap();
                onSelectTab(tab.id);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl min-h-[58px] transition-all duration-200 active:scale-95 relative ${
                isActive
                  ? 'bg-emerald-100 text-emerald-900 font-extrabold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${isActive ? 'text-emerald-800 scale-110' : 'text-slate-600'}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 min-w-5 h-5 px-1 bg-red-600 text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-white">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[11px] sm:text-xs tracking-tight mt-1 leading-tight text-center line-clamp-1 ${
                isActive ? 'font-black' : 'font-medium'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
