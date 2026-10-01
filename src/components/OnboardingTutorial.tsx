import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { soundService } from '../services/soundService';
import { PhoneCall, MessageCircle, Users, Sparkles, Bot, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface OnboardingTutorialProps {
  onComplete: () => void;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onComplete }) => {
  const { t, direction } = useLanguage();
  const [step, setStep] = useState<number>(0);

  const steps = [
    {
      icon: <PhoneCall className="w-16 h-16 text-emerald-700" />,
      title: t.onboarding.step1Title,
      desc: t.onboarding.step1Desc,
      bg: 'bg-emerald-50',
      border: 'border-emerald-500',
    },
    {
      icon: <MessageCircle className="w-16 h-16 text-blue-700" />,
      title: t.onboarding.step2Title,
      desc: t.onboarding.step2Desc,
      bg: 'bg-blue-50',
      border: 'border-blue-500',
    },
    {
      icon: <Users className="w-16 h-16 text-amber-700" />,
      title: t.onboarding.step3Title,
      desc: t.onboarding.step3Desc,
      bg: 'bg-amber-50',
      border: 'border-amber-500',
    },
    {
      icon: <Sparkles className="w-16 h-16 text-purple-700" />,
      title: t.onboarding.step4Title,
      desc: t.onboarding.step4Desc,
      bg: 'bg-purple-50',
      border: 'border-purple-500',
    },
    {
      icon: <Bot className="w-16 h-16 text-teal-700" />,
      title: t.onboarding.step5Title,
      desc: t.onboarding.step5Desc,
      bg: 'bg-teal-50',
      border: 'border-teal-500',
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    soundService.playTap();
    if (isLast) {
      soundService.playSuccess();
      onComplete();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    soundService.playTap();
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    soundService.playTap();
    onComplete();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-slate-300 p-6 sm:p-8 flex flex-col justify-between min-h-[500px]">
        {/* Top Header: Step Indicator & Skip Button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-3 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-emerald-600' : 'w-3 bg-slate-300'
                }`}
                aria-label={`Step ${i + 1} of ${steps.length}`}
              />
            ))}
          </div>

          <button
            onClick={handleSkip}
            className="text-base sm:text-lg font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg active:scale-95"
          >
            {t.skipTutorial}
          </button>
        </div>

        {/* Content Card */}
        <div className="my-auto py-8 text-center flex flex-col items-center">
          <div className={`w-28 h-28 ${current.bg} ${current.border} border-4 rounded-3xl flex items-center justify-center mb-6 shadow-md transition-transform duration-300`}>
            {current.icon}
          </div>

          <h2 id="tutorial-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
            {current.title}
          </h2>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-md">
            {current.desc}
          </p>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
          {step > 0 ? (
            <button
              onClick={handlePrevious}
              className="min-h-touch px-5 py-3 rounded-2xl border-2 border-slate-300 text-slate-700 font-bold text-lg flex items-center gap-2 hover:bg-slate-100 active:scale-95"
            >
              {direction === 'rtl' ? <ArrowRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
              <span>{t.previous}</span>
            </button>
          ) : (
            <div className="flex-1" />
          )}

          <button
            onClick={handleNext}
            className="flex-1 min-h-touch px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xl shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <span>{isLast ? t.letsGetStarted : t.next}</span>
            {isLast ? (
              <Check className="w-7 h-7" />
            ) : direction === 'rtl' ? (
              <ArrowLeft className="w-6 h-6" />
            ) : (
              <ArrowRight className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
