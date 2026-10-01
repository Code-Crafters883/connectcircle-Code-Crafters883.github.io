import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { soundService } from '../services/soundService';
import { Globe, Check } from 'lucide-react';

export const LanguageSelectionModal: React.FC = () => {
  const { language, setLanguage, showLanguageSelection, setShowLanguageSelection, t } = useLanguage();

  if (!showLanguageSelection) return null;

  const handleSelectLanguage = (lang: 'en' | 'ur') => {
    soundService.playSuccess();
    setLanguage(lang);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-emerald-600 p-6 sm:p-8 text-center">
        {/* Friendly Top Icon */}
        <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 mb-6 shadow-inner">
          <Globe className="w-12 h-12" aria-hidden="true" />
        </div>

        <h1 id="language-modal-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          {t.welcomeHeading}
        </h1>
        <p className="text-lg sm:text-xl font-bold text-emerald-800 mb-2">
          کنیکٹ سرکل میں خوش آمدید
        </p>
        <p className="text-base sm:text-lg text-slate-600 mb-8">
          {t.chooseLanguage} / اپنی زبان کا انتخاب فرمائیں
        </p>

        {/* Two Very Large Language Buttons */}
        <div className="flex flex-col gap-4 mb-8">
          <button
            onClick={() => handleSelectLanguage('en')}
            className={`w-full min-h-[72px] px-6 py-4 rounded-2xl text-xl sm:text-2xl font-bold flex items-center justify-between border-4 transition-all duration-200 active:scale-95 ${
              language === 'en'
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-lg'
                : 'bg-slate-50 text-slate-900 border-slate-300 hover:border-emerald-600 hover:bg-emerald-50'
            }`}
            aria-label="Select English language"
          >
            <span className="flex items-center gap-3">
              <span className="text-3xl">🇬🇧</span>
              <span>English</span>
            </span>
            {language === 'en' && <Check className="w-8 h-8 text-white" />}
          </button>

          <button
            onClick={() => handleSelectLanguage('ur')}
            className={`w-full min-h-[72px] px-6 py-4 rounded-2xl text-xl sm:text-2xl font-bold flex items-center justify-between border-4 transition-all duration-200 active:scale-95 ${
              language === 'ur'
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-lg'
                : 'bg-slate-50 text-slate-900 border-slate-300 hover:border-emerald-600 hover:bg-emerald-50'
            }`}
            aria-label="اردو زبان منتخب کریں"
            dir="rtl"
          >
            <span className="flex items-center gap-3">
              <span className="text-3xl">🇵🇰</span>
              <span className="font-urdu text-2xl font-bold">اردو (Urdu)</span>
            </span>
            {language === 'ur' && <Check className="w-8 h-8 text-white" />}
          </button>
        </div>

        <p className="text-sm text-slate-500">
          {t.chooseLanguageSub}
        </p>
      </div>
    </div>
  );
};
