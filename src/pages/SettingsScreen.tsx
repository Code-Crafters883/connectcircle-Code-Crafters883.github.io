import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { soundService } from '../services/soundService';
import { 
  Globe, 
  Eye, 
  ShieldCheck, 
  HeartHandshake, 
  HelpCircle, 
  RotateCcw, 
  LogOut, 
  UserCheck, 
  Check, 
  Lock 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SettingsScreenProps {
  onReplayTutorial: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onReplayTutorial }) => {
  const { language, setLanguage, setShowLanguageSelection, t } = useLanguage();
  const { setShowAccessibilityModal, fontSize, contrastMode } = useAccessibility();
  const { currentUser, signOut, loginAsSenior, loginAsFamily } = useAuth();

  const [privacy, setPrivacy] = useState(dataService.getPrivacySettings());
  const [saveFeedback, setSaveFeedback] = useState<string>('');

  const handleUpdatePrivacy = (whoCanContact: any) => {
    soundService.playTap();
    const updated = { ...privacy, whoCanContactMe: whoCanContact };
    setPrivacy(updated);
    dataService.savePrivacySettings(updated);
    setSaveFeedback(t.feedback.saved);
    setTimeout(() => setSaveFeedback(''), 2500);
  };

  const handleResetData = () => {
    soundService.playTap();
    if (window.confirm(language === 'ur' ? 'کیا آپ تمام ڈیمو ڈیٹا کو ابتدائی حالت میں واپس لانا چاہتے ہیں؟' : 'Reset all demonstration data to default?')) {
      dataService.resetAllDemoData();
      soundService.playSuccess();
      confetti({ particleCount: 30 });
      setSaveFeedback('Demonstration data restored to fresh state!');
      setTimeout(() => setSaveFeedback(''), 3000);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 animate-fade-in pb-24">
      
      {/* 1. Header */}
      <div className="pb-2 border-b-2 border-slate-200">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
          {t.settings.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium">
          {language === 'ur'
            ? 'اپنی سہولت، زبان، بینائی اور تحفظ کی ترتیبات کو منظم کریں۔'
            : 'Personalize your comfort, language, visibility, and safety settings.'}
        </p>
      </div>

      {saveFeedback && (
        <div className="p-4 bg-emerald-100 border-2 border-emerald-500 rounded-2xl text-emerald-950 font-bold text-center">
          {saveFeedback}
        </div>
      )}

      {/* 2. Language Selection Card */}
      <section className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-800 shrink-0">
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {t.settings.languageSection}
            </h2>
            <p className="text-base text-slate-600 font-semibold mt-0.5">
              {language === 'ur' ? 'موجودہ زبان: اردو' : 'Current Language: English'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundService.playTap();
            setShowLanguageSelection(true);
          }}
          className="w-full sm:w-auto min-h-touch px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-lg rounded-2xl shadow-md active:scale-95"
        >
          {t.settings.changeLanguage}
        </button>
      </section>

      {/* 3. Visual & Hearing Accessibility Card */}
      <section className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-800 shrink-0">
            <Eye className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {t.settings.accessibilitySection}
            </h2>
            <p className="text-base text-slate-600 font-semibold mt-0.5">
              Text: <span className="capitalize text-emerald-800">{fontSize}</span> • Contrast: <span className="capitalize text-blue-800">{contrastMode}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundService.playTap();
            setShowAccessibilityModal(true);
          }}
          className="w-full sm:w-auto min-h-touch px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-lg rounded-2xl shadow-md active:scale-95"
        >
          {t.settings.openAccessibility}
        </button>
      </section>

      {/* 4. Privacy & Safety Protection */}
      <section className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-800 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {t.settings.privacySection}
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              {t.settings.privacyDesc}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-base font-bold text-slate-800 mb-2">
            {t.settings.whoCanContact}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleUpdatePrivacy('family')}
              className={`p-4 rounded-2xl border-3 font-bold text-lg text-left flex items-center justify-between ${
                privacy.whoCanContactMe === 'family'
                  ? 'border-purple-600 bg-purple-50 text-purple-950 ring-2 ring-purple-500'
                  : 'border-slate-200 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{t.settings.contactOptionFamily}</span>
              {privacy.whoCanContactMe === 'family' && <Check className="w-6 h-6 text-purple-600" />}
            </button>

            <button
              onClick={() => handleUpdatePrivacy('approved')}
              className={`p-4 rounded-2xl border-3 font-bold text-lg text-left flex items-center justify-between ${
                privacy.whoCanContactMe === 'approved'
                  ? 'border-purple-600 bg-purple-50 text-purple-950 ring-2 ring-purple-500'
                  : 'border-slate-200 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{t.settings.contactOptionApproved}</span>
              {privacy.whoCanContactMe === 'approved' && <Check className="w-6 h-6 text-purple-600" />}
            </button>
          </div>
        </div>
      </section>

      {/* 5. Switch Demonstration Profile (For University Evaluators) */}
      <section className="bg-emerald-50 border-3 border-emerald-400 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-2xl font-black text-emerald-950 flex items-center gap-2">
          <UserCheck className="w-7 h-7 text-emerald-700" />
          <span>{t.auth.switchUser} (HCI Evaluation)</span>
        </h2>
        <p className="text-base text-emerald-900 font-medium">
          Easily switch perspectives between the 72-year-old Senior (Maggie) and her Daughter (Sarah) to evaluate companion interaction:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={loginAsSenior}
            className={`p-4 rounded-2xl border-3 font-extrabold text-lg flex items-center gap-3 ${
              currentUser.role === 'senior'
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
              alt="Maggie"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span>Maggie ({t.auth.seniorRole})</span>
          </button>

          <button
            onClick={loginAsFamily}
            className={`p-4 rounded-2xl border-3 font-extrabold text-lg flex items-center gap-3 ${
              currentUser.role === 'family'
                ? 'bg-blue-700 text-white border-blue-800 shadow-md ring-2 ring-blue-500'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
              alt="Sarah"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span>Sarah (Daughter / Family)</span>
          </button>
        </div>
      </section>

      {/* 6. Tutorial Replay & Reset Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => {
            soundService.playTap();
            onReplayTutorial();
          }}
          className="flex-1 min-h-touch p-4 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold text-lg rounded-2xl flex items-center justify-center gap-2 active:scale-95"
        >
          <HelpCircle className="w-6 h-6 text-slate-600" />
          <span>Replay Senior Tutorial</span>
        </button>

        <button
          onClick={handleResetData}
          className="flex-1 min-h-touch p-4 bg-white hover:bg-red-50 border-2 border-slate-200 text-slate-800 hover:text-red-700 font-bold text-lg rounded-2xl flex items-center justify-center gap-2 active:scale-95"
        >
          <RotateCcw className="w-6 h-6" />
          <span>Reset Demonstration Data</span>
        </button>
      </div>

      {/* About Footer */}
      <div className="text-center text-slate-400 text-sm pt-4">
        <p className="font-bold">{t.settings.aboutDesc}</p>
        <p className="mt-1">{t.settings.version}</p>
      </div>

    </div>
  );
};
