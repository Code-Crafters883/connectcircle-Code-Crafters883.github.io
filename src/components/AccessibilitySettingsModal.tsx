import React from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useLanguage } from '../contexts/LanguageContext';
import { soundService } from '../services/soundService';
import { Eye, Type, Contrast, Activity, Volume2, X, Check } from 'lucide-react';
import { FontSizePreference, ContrastMode } from '../types';

export const AccessibilitySettingsModal: React.FC = () => {
  const {
    fontSize,
    setFontSize,
    contrastMode,
    setContrastMode,
    reducedMotion,
    setReducedMotion,
    voiceAssistance,
    setVoiceAssistance,
    showAccessibilityModal,
    setShowAccessibilityModal,
  } = useAccessibility();

  const { t } = useLanguage();

  if (!showAccessibilityModal) return null;

  const fontOptions: { id: FontSizePreference; label: string; preview: string }[] = [
    { id: 'small', label: t.accessibility.textSizeSmall, preview: 'Aa' },
    { id: 'medium', label: t.accessibility.textSizeMedium, preview: 'Aa' },
    { id: 'large', label: t.accessibility.textSizeLarge, preview: 'Aa' },
    { id: 'xl', label: t.accessibility.textSizeXl, preview: 'Aa' },
  ];

  const contrastOptions: { id: ContrastMode; label: string; bg: string; text: string; border: string }[] = [
    { id: 'standard', label: t.accessibility.contrastStandard, bg: 'bg-amber-50', text: 'text-slate-900', border: 'border-slate-300' },
    { id: 'high-contrast-dark', label: t.accessibility.contrastDark, bg: 'bg-slate-900', text: 'text-white', border: 'border-blue-400' },
    { id: 'high-contrast-yellow', label: t.accessibility.contrastYellow, bg: 'bg-black', text: 'text-yellow-300', border: 'border-yellow-400' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
    >
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-slate-700 p-6 sm:p-8 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-800">
              <Eye className="w-8 h-8" />
            </div>
            <div>
              <h2 id="accessibility-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t.accessibility.title}
              </h2>
              <p className="text-base text-slate-600">
                {t.accessibility.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playTap();
              setShowAccessibilityModal(false);
            }}
            className="p-3 text-slate-400 hover:text-slate-700 rounded-xl"
            aria-label={t.close}
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* 1. Text Size Selector */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Type className="w-6 h-6 text-slate-700" />
            <h3 className="text-xl font-bold text-slate-900">
              {t.accessibility.textSizeTitle}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {fontOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  soundService.playTap();
                  setFontSize(opt.id);
                }}
                className={`p-3 rounded-2xl border-3 flex flex-col items-center justify-center text-center transition-all ${
                  fontSize === opt.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold shadow-md ring-2 ring-emerald-500'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className={`font-serif mb-1 ${
                  opt.id === 'small' ? 'text-lg' : opt.id === 'medium' ? 'text-xl' : opt.id === 'large' ? 'text-2xl' : 'text-3xl'
                }`}>
                  {opt.preview}
                </span>
                <span className="text-sm font-semibold">{opt.label}</span>
                {fontSize === opt.id && <Check className="w-5 h-5 text-emerald-600 mt-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Contrast Themes */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Contrast className="w-6 h-6 text-slate-700" />
            <h3 className="text-xl font-bold text-slate-900">
              {t.accessibility.contrastTitle}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {contrastOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  soundService.playTap();
                  setContrastMode(opt.id);
                }}
                className={`p-4 rounded-2xl border-4 text-left flex items-center justify-between transition-all ${opt.bg} ${opt.text} ${opt.border} ${
                  contrastMode === opt.id ? 'ring-4 ring-emerald-500 shadow-lg scale-[1.02]' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <span className="font-bold text-base">{opt.label}</span>
                {contrastMode === opt.id && <Check className="w-6 h-6" />}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Reduced Motion */}
        <div className="mb-6 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <Activity className="w-7 h-7 text-slate-700" />
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                {t.accessibility.motionTitle}
              </h4>
              <p className="text-sm text-slate-600">
                {reducedMotion ? t.accessibility.motionReduced : t.accessibility.motionNormal}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playTap();
              setReducedMotion(!reducedMotion);
            }}
            className={`w-16 h-9 rounded-full transition-colors p-1 border-2 ${
              reducedMotion ? 'bg-emerald-600 border-emerald-700' : 'bg-slate-300 border-slate-400'
            }`}
            aria-label="Toggle reduced motion"
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                reducedMotion ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 4. Voice Assistance */}
        <div className="mb-8 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <Volume2 className="w-7 h-7 text-slate-700" />
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                {t.accessibility.voiceAssistanceTitle}
              </h4>
              <p className="text-sm text-slate-600">
                {voiceAssistance ? t.accessibility.voiceEnabled : t.accessibility.voiceDisabled}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playTap();
              setVoiceAssistance(!voiceAssistance);
            }}
            className={`w-16 h-9 rounded-full transition-colors p-1 border-2 ${
              voiceAssistance ? 'bg-emerald-600 border-emerald-700' : 'bg-slate-300 border-slate-400'
            }`}
            aria-label="Toggle voice assistance"
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                voiceAssistance ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Done / Save Button */}
        <button
          onClick={() => {
            soundService.playSuccess();
            setShowAccessibilityModal(false);
          }}
          className="w-full min-h-touch py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xl rounded-2xl shadow-lg active:scale-95"
        >
          {t.done}
        </button>

      </div>
    </div>
  );
};
