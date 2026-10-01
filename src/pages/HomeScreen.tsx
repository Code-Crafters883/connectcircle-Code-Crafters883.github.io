import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCall } from '../contexts/CallContext';
import { dataService } from '../services/dataService';
import { soundService } from '../services/soundService';
import { DAILY_SUGGESTIONS } from '../data/mockData';
import { 
  PhoneCall, 
  MessageSquare, 
  Users, 
  UserCheck, 
  Compass, 
  Sparkles, 
  Image as ImageIcon, 
  Bot, 
  AlertCircle, 
  Flame, 
  ArrowRight, 
  ArrowLeft,
  Heart,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: string, payload?: any) => void;
  onOpenEmergency: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onOpenEmergency }) => {
  const { t, language, direction } = useLanguage();
  const { currentUser } = useAuth();
  const { startCall } = useCall();

  const connections = dataService.getConnections();
  const familyMember = connections.find(c => c.category === 'family') || connections[0];
  const hobby = dataService.getHobbyProject();

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.homeScreen.greetingMorning;
    if (hour < 17) return t.homeScreen.greetingAfternoon;
    return t.homeScreen.greetingEvening;
  };

  const handleQuickCallFamily = () => {
    soundService.playTap();
    if (familyMember) {
      startCall(familyMember);
    } else {
      onNavigate('connections', { tab: 'family' });
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 animate-fade-in pb-24">
      
      {/* 1. Warm Greeting & Welcome Header */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-emerald-600">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md shrink-0"
          />
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {getGreeting()}, {currentUser.fullName}!
            </h1>
            <p className="text-emerald-100 text-lg sm:text-xl font-medium mt-1">
              {t.motto}
            </p>
          </div>
        </div>

        {/* Quick Call Family Badge / Button */}
        <button
          onClick={handleQuickCallFamily}
          className="w-full sm:w-auto min-h-touch-lg px-6 py-4 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-xl rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95"
        >
          <PhoneCall className="w-7 h-7" />
          <span>{t.homeScreen.callFamily}</span>
        </button>
      </section>

      {/* 2. Today's Activity & Streak Banner */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-amber-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner">
            🧶
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-amber-800 uppercase tracking-wider block">
              {t.homeScreen.todayActivity}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {language === 'ur' ? hobby.titleUrdu : hobby.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full font-bold text-sm">
                <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                {hobby.currentStreak} {t.homeScreen.dayStreak}
              </span>
              <span className="text-slate-600 text-sm font-semibold hidden sm:inline">
                {t.homeScreen.keepGoing}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundService.playTap();
            onNavigate('activities', { tab: 'hobbies' });
          }}
          className="w-full sm:w-auto min-h-touch px-6 py-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-extrabold text-lg rounded-2xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
        >
          <span>{t.homeScreen.continueKnitting}</span>
          {direction === 'rtl' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </section>

      {/* 3. Primary Senior Action Cards (2 Columns on mobile, 3 on tablet/desktop) */}
      <section>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 px-1">
          {language === 'ur' ? 'اہم کام اور سہولیات' : 'What would you like to do?'}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Call Family */}
          <button
            onClick={handleQuickCallFamily}
            className="p-5 bg-white hover:bg-emerald-50 active:bg-emerald-100 rounded-3xl border-3 border-emerald-500 shadow-md flex flex-col items-center justify-center text-center gap-3 transition-transform active:scale-95 min-h-[170px]"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-800">
              <PhoneCall className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {t.homeScreen.callFamily}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                {t.homeScreen.callFamilyDesc}
              </p>
            </div>
          </button>

          {/* Card 2: Messages */}
          <button
            onClick={() => {
              soundService.playTap();
              onNavigate('messages');
            }}
            className="p-5 bg-white hover:bg-blue-50 active:bg-blue-100 rounded-3xl border-3 border-blue-500 shadow-md flex flex-col items-center justify-center text-center gap-3 transition-transform active:scale-95 min-h-[170px]"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-800 relative">
              <MessageSquare className="w-9 h-9" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {t.homeScreen.messages}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                {t.homeScreen.messagesDesc}
              </p>
            </div>
          </button>

          {/* Card 3: My Family */}
          <button
            onClick={() => {
              soundService.playTap();
              onNavigate('connections', { tab: 'family' });
            }}
            className="p-5 bg-white hover:bg-purple-50 active:bg-purple-100 rounded-3xl border-3 border-purple-500 shadow-md flex flex-col items-center justify-center text-center gap-3 transition-transform active:scale-95 min-h-[170px]"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-800">
              <Users className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {t.homeScreen.myFamily}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                {t.homeScreen.myFamilyDesc}
              </p>
            </div>
          </button>

          {/* Card 4: Friends */}
          <button
            onClick={() => {
              soundService.playTap();
              onNavigate('connections', { tab: 'friends' });
            }}
            className="p-5 bg-white hover:bg-teal-50 active:bg-teal-100 rounded-3xl border-3 border-teal-500 shadow-md flex flex-col items-center justify-center text-center gap-3 transition-transform active:scale-95 min-h-[170px]"
          >
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-800">
              <UserCheck className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {t.homeScreen.friends}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                {t.homeScreen.friendsDesc}
              </p>
            </div>
          </button>

          {/* Card 5: Communities */}
          <button
            onClick={() => {
              soundService.playTap();
              onNavigate('communities');
            }}
            className="p-5 bg-white hover:bg-indigo-50 active:bg-indigo-100 rounded-3xl border-3 border-indigo-500 shadow-md flex flex-col items-center justify-center text-center gap-3 transition-transform active:scale-95 min-h-[170px]"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-800">
              <Compass className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {t.homeScreen.communities}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                {t.homeScreen.communitiesDesc}
              </p>
            </div>
          </button>

          {/* Card 6: Activities & Games */}
          <button
            onClick={() => {
              soundService.playTap();
              onNavigate('activities');
            }}
            className="p-5 bg-white hover:bg-amber-50 active:bg-amber-100 rounded-3xl border-3 border-amber-500 shadow-md flex flex-col items-center justify-center text-center gap-3 transition-transform active:scale-95 min-h-[170px]"
          >
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-800">
              <Sparkles className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {t.homeScreen.activities}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                {t.homeScreen.activitiesDesc}
              </p>
            </div>
          </button>

          {/* Card 7: Photos */}
          <button
            onClick={() => {
              soundService.playTap();
              onNavigate('photos');
            }}
            className="p-5 bg-white hover:bg-rose-50 active:bg-rose-100 rounded-3xl border-3 border-rose-500 shadow-md flex flex-col items-center justify-center text-center gap-3 transition-transform active:scale-95 min-h-[170px]"
          >
            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-800">
              <ImageIcon className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {t.homeScreen.photoGallery}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                {t.homeScreen.photoGalleryDesc}
              </p>
            </div>
          </button>

          {/* Card 8: Ask for Help (AI Helper) */}
          <button
            onClick={() => {
              soundService.playTap();
              onNavigate('ai-helper');
            }}
            className="p-5 bg-white hover:bg-teal-50 active:bg-teal-100 rounded-3xl border-3 border-teal-600 shadow-md flex flex-col items-center justify-center text-center gap-3 transition-transform active:scale-95 min-h-[170px]"
          >
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-800">
              <Bot className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {t.homeScreen.askHelp}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                {t.homeScreen.askHelpDesc}
              </p>
            </div>
          </button>

        </div>
      </section>

      {/* 4. Today's Connections & Activity Suggestions */}
      <section className="bg-slate-50 rounded-3xl p-5 sm:p-6 border-2 border-slate-200">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">
          {t.homeScreen.todaySuggestions}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DAILY_SUGGESTIONS.map((sug) => (
            <div
              key={sug.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sug.icon}</span>
                <span className="text-base sm:text-lg font-bold text-slate-800">
                  {language === 'ur' ? sug.titleUrdu : sug.title}
                </span>
              </div>
              <button
                onClick={() => {
                  soundService.playTap();
                  onNavigate(sug.actionScreen, sug.actionPayload);
                }}
                className="min-h-touch px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold text-sm sm:text-base rounded-xl shrink-0 active:scale-95"
              >
                {language === 'ur' ? sug.actionTextUrdu : sug.actionText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Persistent Emergency SOS Quick Banner */}
      <section className="bg-red-50 border-3 border-red-500 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm">
            🆘
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-red-950">
              {t.homeScreen.emergencyHelp}
            </h2>
            <p className="text-base text-red-800 font-medium">
              {language === 'ur'
                ? 'کسی بھی ہنگامی صورت میں اپنے خاندان یا معالج سے فوری رابطہ کریں۔'
                : 'Need immediate help? Contact your daughter Sarah or caregiver instantly.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundService.playSosChime();
            onOpenEmergency();
          }}
          className="w-full sm:w-auto min-h-touch-lg px-8 py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-xl rounded-2xl shadow-lg transition-transform active:scale-95 shrink-0"
        >
          {language === 'ur' ? 'مدد حاصل کریں' : 'Get Help Now'}
        </button>
      </section>

    </div>
  );
};
