import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';
import { 
  Bot, 
  Send, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

interface AiMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export const AiAssistantScreen: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: language === 'ur'
        ? 'السلام علیکم! میں کنیکٹ سرکل میں آپ کا ذاتی مددگار ہوں۔ آپ مجھ سے ایپ کے کسی بھی بٹن کو سمجھنے، خاندان کو کال کرنے، تصاویر بھیجنے، یا اردو اور انگریزی ترجمے کے بارے میں کچھ بھی پوچھ سکتے ہیں۔ میں آپ کی کیا خدمت کروں؟'
        : 'Hello there! I am your friendly ConnectCircle Helper. I am here to guide you with any feature, help you contact family, explain buttons, suggest soothing hobbies, or translate between English and Urdu. How may I assist your day?'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Context-aware intelligent assistive response generator
  const getHelperResponse = (query: string): string => {
    const q = query.toLowerCase().trim();

    if (q.includes('call') || q.includes('phone') || query.includes('کال') || query.includes('فون')) {
      return language === 'ur'
        ? 'خاندان کو کال کرنا بہت آسان ہے! ہوم اسکرین پر جائیں اور سبز رنگ کے بڑے بٹن "خاندان کو کال کریں" کو دبائیں۔ آپ جس فرد سے بات کرنا چاہتے ہیں ان کی تصویر پر کال کا بٹن دبا دیں۔'
        : 'Calling your family is very simple! Go to your Home screen and tap the large green "Call Family" card. Then tap the green phone button next to the person you wish to speak with.';
    }

    if (q.includes('photo') || q.includes('picture') || query.includes('تصویر') || query.includes('البم')) {
      return language === 'ur'
        ? 'تصویر بھیجنے کے لیے نیچے "پیغامات" کا بٹن دبائیں۔ اپنے پیارے کا نام منتخب کریں اور پھر نیچے بنفشی رنگ کے تصویر والے بٹن کو دبائیں۔'
        : 'To share a photo, tap "Messages" on your bottom bar. Choose your loved one, and tap the purple picture icon next to the typing area to attach your photo.';
    }

    if (q.includes('activity') || q.includes('game') || q.includes('knitting') || query.includes('کھیل') || query.includes('مشغلہ') || query.includes('بنائی')) {
      return language === 'ur'
        ? 'آج آپ کے لیے ہمارا پرسکون "بنائی اور کڑھائی کا سلسلہ" اور "یادداشت کا کارڈ گیم" بہترین ہیں! نیچے دیے گئے "کھیل اور سرگرمیاں" کے ٹیب پر جائیں اور پرسکون لمحوں کا لطف اٹھائیں۔'
        : 'For today, I warmly recommend your Knitting Streak ("My Blue Scarf") or a gentle game of Memory Cards! Open "Activities & Games" on your navigation bar to begin.';
    }

    if (q.includes('community') || q.includes('gardening') || query.includes('کمیونٹی') || query.includes('باغبانی')) {
      return language === 'ur'
        ? 'ہماری باغبانی اور دستکاری کی کمیونٹیز بہت فعال اور مخلص ہیں۔ آپ "کمیونٹیز" کے صفحے پر جا کر "باغبانی اور فطرت" پر "شامل ہوں" کا بٹن دبا سکتے ہیں۔'
        : 'Our Gardening & Nature and Knitting communities are full of friendly members! Tap "Communities" on your bottom bar, find the group you like, and tap the "Join" button.';
    }

    if (q.includes('translate') || query.includes('ترجمہ') || q.includes('urdu')) {
      return language === 'ur'
        ? 'میں آپ کے لیے ترجمہ کرنے میں خوشی محسوس کروں گا۔ مثال کے طور پر: "Good morning, how are you?" کا اردو میں مطلب ہے: "صبح بخیر، آپ کا کیا حال ہے؟"'
        : 'I am delighted to help translate! For example: "آپ کیسے ہیں؟" in English means "How are you?". Feel free to type any phrase you would like me to translate.';
    }

    // Friendly everyday companionship answer
    return language === 'ur'
      ? `ماشاءاللہ! آپ نے بہت اچھا سوال پوچھا ہے۔ کنیکٹ سرکل میں ہم چاہتے ہیں کہ آپ کو ہر قدم پر آسانی اور محبت ملے۔ آپ سکرین پر موجود کسی بھی بٹن کو اطمینان سے دبا سکتے ہیں، کچھ خراب نہیں ہوگا۔ کیا میں آپ کی کسی اور کام میں مدد کروں؟`
      : `Thank you for asking! In ConnectCircle, every feature is designed to be gentle, simple, and safe. You can tap any large button with confidence. Would you like me to guide you to your family messages or show you today's relaxing activities?`;
  };

  const handleSendPrompt = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    soundService.playTap();
    const userMsg: AiMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
    };

    const reply = getHelperResponse(text.trim());
    const botMsg: AiMessage = {
      id: `b-${Date.now()}`,
      sender: 'assistant',
      text: reply,
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInputText('');
    soundService.playSuccess();
  };

  const handleSpeakLastResponse = (text: string) => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      speechService.speak(text, language);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 animate-fade-in pb-24">
      
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-800 text-white rounded-3xl p-6 shadow-xl flex items-center gap-5 border-2 border-teal-600">
        <div className="w-18 h-18 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center text-teal-800 shrink-0 shadow-md">
          <Bot className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            {t.aiAssistant.title}
          </h1>
          <p className="text-teal-100 text-base sm:text-lg font-medium mt-1">
            {t.aiAssistant.subtitle}
          </p>
        </div>
      </div>

      {/* Non-Medical Disclaimer Alert */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-sm sm:text-base font-semibold">
        <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-snug">
          {t.aiAssistant.disclaimer}
        </p>
      </div>

      {/* 2. Chat Conversation Box */}
      <div className="bg-white rounded-3xl border-3 border-slate-200 shadow-md flex flex-col h-[480px] overflow-hidden">
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-5 rounded-3xl text-lg sm:text-xl leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-br-none font-semibold'
                      : 'bg-white text-slate-900 border-2 border-teal-200 rounded-bl-none font-medium'
                  }`}
                >
                  <p>{m.text}</p>

                  {!isUser && (
                    <button
                      onClick={() => handleSpeakLastResponse(m.text)}
                      className="mt-3 text-sm font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-300 flex items-center gap-1.5 active:scale-95"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{t.aiAssistant.speakResponse}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }} className="bg-white border-t-2 border-slate-200 p-3 sm:p-4 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.aiAssistant.placeholder}
            className="flex-1 min-h-touch px-4 py-3 rounded-2xl border-2 border-slate-300 text-lg sm:text-xl text-slate-900 focus:border-teal-600 focus:outline-none"
          />
          <button
            type="submit"
            className="w-14 h-14 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl flex items-center justify-center shadow-md active:scale-95 shrink-0"
            aria-label={t.send}
          >
            {direction === 'rtl' ? <ArrowLeft className="w-7 h-7" /> : <Send className="w-7 h-7" />}
          </button>
        </form>
      </div>

      {/* 3. Popular Senior Question Suggestions */}
      <div>
        <h3 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-teal-600" />
          <span>{t.aiAssistant.suggestionsTitle}</span>
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {t.aiAssistant.suggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSendPrompt(sug)}
              className="text-base sm:text-lg font-bold bg-white hover:bg-teal-50 text-slate-800 hover:text-teal-950 px-4 py-3 rounded-2xl border-2 border-slate-200 hover:border-teal-500 shadow-sm active:scale-95 transition-all text-left"
            >
              💬 "{sug}"
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
