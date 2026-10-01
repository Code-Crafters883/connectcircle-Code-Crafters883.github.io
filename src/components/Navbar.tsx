import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useAuth } from '../contexts/AuthContext';
import { soundService } from '../services/soundService';
import { Mic, Eye, Globe } from 'lucide-react';

interface NavbarProps {
  onOpenVoice: () => void;
  onOpenEmergency: () => void;
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenVoice,
  onOpenEmergency,
  onNavigateHome,
  onNavigateProfile,
}) => {
  const { language, setLanguage, setShowLanguageSelection, t } = useLanguage();
  const { setShowAccessibilityModal } = useAccessibility();
  const { currentUser, setShowAuthModal } = useAuth();

  const handleToggleLang = () => {
    soundService.playTap();
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand / Logo */}
        <button
          onClick={() => {
            soundService.playTap();
            onNavigateHome();
          }}
          className="flex items-center gap-2.5 group active:scale-95 text-left"
          aria-label="ConnectCircle Home"
        >
          <img
            src="/icon.svg"
            alt="Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-sm"
          />
          <div>
            <span className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight block leading-tight">
              {t.appName}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block -mt-0.5">
              {t.tagline}
            </span>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Language Toggle */}
          <button
            onClick={handleToggleLang}
            className="min-h-touch px-2.5 sm:px-3 py-1.5 rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800 active:scale-95"
            aria-label="Switch Language / زبان تبدیل کریں"
            title="Switch Language / زبان تبدیل کریں"
          >
            <Globe className="w-4 h-4 text-emerald-700" />
            <span>{language === 'en' ? '🇵🇰 اردو' : '🇬🇧 EN'}</span>
          </button>

          {/* Voice Command Button */}
          <button
            onClick={() => {
              soundService.playTap();
              onOpenVoice();
            }}
            className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-2 border-emerald-300 flex items-center justify-center active:scale-95"
            aria-label={t.voiceCommand.buttonTitle}
            title={t.voiceCommand.buttonTitle}
          >
            <Mic className="w-6 h-6" />
          </button>

          {/* Accessibility Options Button */}
          <button
            onClick={() => {
              soundService.playTap();
              setShowAccessibilityModal(true);
            }}
            className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 hover:bg-blue-200 border-2 border-blue-300 flex items-center justify-center active:scale-95"
            aria-label={t.accessibility.title}
            title={t.accessibility.title}
          >
            <Eye className="w-6 h-6" />
          </button>

          {/* SOS Help Button */}
          <button
            onClick={() => {
              soundService.playSosChime();
              onOpenEmergency();
            }}
            className="min-h-touch px-3 sm:px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm sm:text-base flex items-center gap-1.5 shadow-md active:scale-95 border-2 border-red-500 animate-pulse"
            aria-label="Emergency Help"
            title="Emergency Help"
          >
            <span className="text-lg">🆘</span>
            <span className="hidden sm:inline">{t.homeScreen.emergencyHelp}</span>
          </button>

          {/* User Profile / Switcher Avatar */}
          <button
            onClick={() => {
              soundService.playTap();
              setShowAuthModal(true);
            }}
            className="relative ml-1 active:scale-95"
            aria-label={`Profile: ${currentUser.fullName}`}
            title={`Signed in as ${currentUser.fullName} (${currentUser.role})`}
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-11 h-11 rounded-full object-cover border-2 border-emerald-600 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
          </button>
        </div>

      </div>
    </header>
  );
};
