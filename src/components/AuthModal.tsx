import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { soundService } from '../services/soundService';
import { UserCheck, Mail, X, Sparkles, Heart } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    loginAsSenior, 
    loginAsFamily, 
    loginWithEmail, 
    currentUser 
  } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState<string>('');
  const [sentMessage, setSentMessage] = useState<string>('');

  if (!showAuthModal) return null;

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    const res = await loginWithEmail(email);
    setSentMessage(res.message);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-emerald-600 p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 id="auth-title" className="text-2xl font-extrabold text-slate-900">
                {t.auth.createAccount}
              </h2>
              <p className="text-sm text-slate-600">
                {t.auth.switchUser}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAuthModal(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
            aria-label={t.close}
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* 1. Quick One-Tap Demo Roles */}
        <div className="mb-6">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
            {t.auth.switchUser}:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Maggie (Senior) */}
            <button
              onClick={loginAsSenior}
              className={`p-4 rounded-2xl border-3 flex items-center gap-3 text-left transition-all ${
                currentUser.role === 'senior'
                  ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                alt="Maggie"
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <p className="font-extrabold text-slate-900 text-lg">Maggie</p>
                <p className="text-xs text-emerald-800 font-semibold">{t.auth.seniorRole} (72)</p>
              </div>
            </button>

            {/* Sarah (Daughter / Family) */}
            <button
              onClick={loginAsFamily}
              className={`p-4 rounded-2xl border-3 flex items-center gap-3 text-left transition-all ${
                currentUser.role === 'family'
                  ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                alt="Sarah"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
              />
              <div>
                <p className="font-extrabold text-slate-900 text-lg">Sarah</p>
                <p className="text-xs text-blue-800 font-semibold">{t.auth.familyRole} (Daughter)</p>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Low Friction Email Sign In */}
        <div className="border-t border-slate-200 pt-6 mb-6">
          <form onSubmit={handleSubmitEmail} className="flex flex-col gap-3">
            <label className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Mail className="w-5 h-5 text-slate-500" />
              <span>Sign in with Email:</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.auth.emailPlaceholder}
              className="w-full min-h-touch px-4 py-3 rounded-xl border-2 border-slate-300 text-lg focus:border-emerald-600 focus:outline-none"
            />
            <button
              type="submit"
              className="min-h-touch py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-lg rounded-xl shadow-md transition-transform active:scale-95"
            >
              {t.auth.sendMagicLink}
            </button>
            {sentMessage && (
              <p className="text-emerald-700 text-sm font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                {sentMessage}
              </p>
            )}
          </form>
        </div>

        {/* Guest Mode Notice */}
        <div className="p-3 bg-slate-100 rounded-xl text-center">
          <p className="text-sm text-slate-600">
            {t.auth.guestNotice}
          </p>
        </div>

      </div>
    </div>
  );
};
