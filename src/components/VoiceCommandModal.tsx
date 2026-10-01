import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCall } from '../contexts/CallContext';
import { speechService } from '../services/speechService';
import { soundService } from '../services/soundService';
import { dataService } from '../services/dataService';
import { Mic, MicOff, Check, X, Sparkles, Volume2 } from 'lucide-react';

interface VoiceCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

export const VoiceCommandModal: React.FC<VoiceCommandModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { t, language } = useLanguage();
  const { startCall } = useCall();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [understoodAction, setUnderstoodAction] = useState<{
    label: string;
    action: () => void;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setUnderstoodAction(null);
      setErrorMessage('');
      startVoiceListening();
    } else {
      speechService.stopListening();
      setIsListening(false);
    }
  }, [isOpen]);

  const parseVoiceCommand = (text: string) => {
    const lower = text.toLowerCase().trim();
    const connections = dataService.getConnections();
    const familyMember = connections.find(c => c.category === 'family') || connections[0];

    // English & Urdu Command matching
    if (
      lower.includes('daughter') || 
      lower.includes('call') || 
      lower.includes('phone') || 
      text.includes('کال') || 
      text.includes('بیٹی') || 
      text.includes('بات کریں')
    ) {
      return {
        label: language === 'ur' ? 'سارہ (بیٹی) کو کال کریں' : 'Call Sarah (Daughter)',
        action: () => {
          onClose();
          startCall(familyMember);
        },
      };
    }

    if (
      lower.includes('message') || 
      lower.includes('chat') || 
      text.includes('پیغام') || 
      text.includes('پیغامات')
    ) {
      return {
        label: language === 'ur' ? 'پیغامات کھولیں' : 'Open Messages',
        action: () => {
          onClose();
          onNavigate('messages');
        },
      };
    }

    if (
      lower.includes('photo') || 
      lower.includes('picture') || 
      lower.includes('gallery') || 
      text.includes('تصویر') || 
      text.includes('تصاویر') || 
      text.includes('البم')
    ) {
      return {
        label: language === 'ur' ? 'تصاویر کا البم کھولیں' : 'Show Family Photos',
        action: () => {
          onClose();
          onNavigate('photos');
        },
      };
    }

    if (
      lower.includes('game') || 
      lower.includes('activity') || 
      lower.includes('play') || 
      lower.includes('puzzle') || 
      lower.includes('chess') || 
      text.includes('کھیل') || 
      text.includes('سرگرمی') || 
      text.includes('شطرنج') || 
      text.includes('پہیلی')
    ) {
      return {
        label: language === 'ur' ? 'کھیل اور سرگرمیاں کھولیں' : 'Open Games & Activities',
        action: () => {
          onClose();
          onNavigate('activities');
        },
      };
    }

    if (
      lower.includes('community') || 
      lower.includes('gardening') || 
      lower.includes('knitting') || 
      text.includes('کمیونٹی') || 
      text.includes('باغبانی') || 
      text.includes('بنائی')
    ) {
      return {
        label: language === 'ur' ? 'کمیونٹیز کھولیں' : 'Open Communities',
        action: () => {
          onClose();
          onNavigate('communities');
        },
      };
    }

    if (
      lower.includes('home') || 
      text.includes('ہوم') || 
      text.includes('گھر')
    ) {
      return {
        label: language === 'ur' ? 'ہوم اسکرین پر جائیں' : 'Go to Home Screen',
        action: () => {
          onClose();
          onNavigate('home');
        },
      };
    }

    // Default general action
    return {
      label: language === 'ur' ? `تلاش: "${text}"` : `Search: "${text}"`,
      action: () => {
        onClose();
        onNavigate('activities');
      },
    };
  };

  const startVoiceListening = () => {
    setErrorMessage('');
    setIsListening(true);
    soundService.playTap();

    speechService.startListening(
      language,
      (resultTranscript) => {
        setTranscript(resultTranscript);
        setIsListening(false);
        soundService.playSuccess();
        const action = parseVoiceCommand(resultTranscript);
        setUnderstoodAction(action);
      },
      (error) => {
        setIsListening(false);
        setErrorMessage(t.voiceCommand.didNotHear);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleSimulateCommand = (phrase: string) => {
    soundService.playTap();
    setTranscript(phrase);
    const action = parseVoiceCommand(phrase);
    setUnderstoodAction(action);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-emerald-600 p-6 sm:p-8 flex flex-col justify-between min-h-[500px]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800">
              <Mic className="w-7 h-7" />
            </div>
            <h2 id="voice-modal-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.voiceCommand.modalTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
            aria-label={t.close}
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Central Interaction Area */}
        <div className="flex flex-col items-center justify-center my-6 text-center">
          {/* Big Pulsing Mic Button */}
          <button
            onClick={isListening ? () => speechService.stopListening() : startVoiceListening}
            className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 border-4 ${
              isListening
                ? 'bg-red-500 border-red-300 text-white animate-pulse ring-8 ring-red-400/40'
                : 'bg-emerald-600 border-emerald-400 text-white hover:bg-emerald-700 ring-8 ring-emerald-500/20'
            }`}
            aria-label="Tap to speak"
          >
            {isListening ? <Mic className="w-16 h-16 animate-bounce" /> : <Mic className="w-16 h-16" />}
          </button>

          <p className="mt-4 text-xl sm:text-2xl font-bold text-slate-800">
            {isListening ? t.voiceCommand.listening : t.voiceCommand.instruction}
          </p>

          {/* Understood Transcript / Confirmation Dialog */}
          {transcript && understoodAction && (
            <div className="w-full bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 mt-6 text-left animate-fade-in shadow-inner">
              <span className="text-sm font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                {t.voiceCommand.understood}
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">
                "{transcript}"
              </p>

              <div className="p-3 bg-white rounded-xl border border-emerald-300 mb-4 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-emerald-600 shrink-0" />
                <span className="text-lg font-bold text-emerald-950">
                  {understoodAction.label}
                </span>
              </div>

              {/* Confirmation Buttons */}
              <p className="text-base text-slate-700 font-semibold mb-3">
                {t.voiceCommand.confirmAction}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    soundService.playSuccess();
                    understoodAction.action();
                  }}
                  className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-extrabold text-lg rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <Check className="w-6 h-6" />
                  <span>{t.voiceCommand.confirmYes}</span>
                </button>
                <button
                  onClick={() => {
                    soundService.playTap();
                    setTranscript('');
                    setUnderstoodAction(null);
                  }}
                  className="px-5 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-lg rounded-xl active:scale-95"
                >
                  <span>{t.voiceCommand.confirmNo}</span>
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <p className="mt-4 text-base text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Quick Tap Command Suggestions */}
        <div className="border-t border-slate-200 pt-4">
          <p className="text-sm font-bold text-slate-500 mb-2">
            {t.voiceCommand.examplesTitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              language === 'ur' ? 'میری بیٹی کو کال کریں' : 'Call my daughter',
              language === 'ur' ? 'میرے پیغامات دکھائیں' : 'Open my messages',
              language === 'ur' ? 'میری تصاویر کھولیں' : 'Show my photos',
              language === 'ur' ? 'ایک کھیل کھولیں' : 'Play a game',
            ].map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSimulateCommand(sample)}
                className="text-sm sm:text-base font-semibold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 active:scale-95 transition-colors"
              >
                🗣️ "{sample}"
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
