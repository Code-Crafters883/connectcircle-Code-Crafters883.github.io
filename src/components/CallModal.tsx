import React from 'react';
import { useCall } from '../contexts/CallContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Video, 
  VideoOff, 
  ShieldAlert, 
  PhoneCall, 
  Check 
} from 'lucide-react';

export const CallModal: React.FC = () => {
  const { 
    callSession, 
    endCall, 
    answerCall, 
    toggleMute, 
    toggleSpeaker, 
    toggleVideo 
  } = useCall();
  const { t, language } = useLanguage();

  if (!callSession.active) return null;

  const contact = callSession.contact;
  const displayName = contact 
    ? (language === 'ur' ? contact.nameUrdu : contact.name) 
    : 'Family Contact';
  const displayRelationship = contact 
    ? (language === 'ur' ? contact.relationshipUrdu : contact.relationship) 
    : '';

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-heading"
    >
      <div className="w-full max-w-md bg-slate-900 text-white rounded-3xl shadow-2xl border-4 border-slate-700 p-6 sm:p-8 flex flex-col items-center justify-between min-h-[580px] relative overflow-hidden">
        
        {/* Project Simulation Badge */}
        <div className="w-full bg-amber-500/20 border border-amber-400/40 rounded-xl px-3 py-1.5 flex items-center justify-center gap-2 text-amber-300 text-xs sm:text-sm font-semibold mb-4 text-center">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{t.callModal.simulatedNotice}</span>
        </div>

        {/* Contact Info & Avatar */}
        <div className="flex flex-col items-center my-auto">
          <div className="relative mb-6">
            <img
              src={contact?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
              alt={displayName}
              className={`w-36 h-36 rounded-full object-cover border-4 shadow-2xl transition-all duration-300 ${
                callSession.status === 'connected'
                  ? 'border-emerald-500 ring-8 ring-emerald-500/30'
                  : 'border-blue-400 animate-pulse'
              }`}
            />
            {callSession.status === 'connected' && (
              <span className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            )}
          </div>

          <h2 id="call-heading" className="text-3xl font-extrabold text-white text-center mb-1">
            {displayName}
          </h2>
          <p className="text-xl text-slate-300 font-medium capitalize mb-3">
            {displayRelationship}
          </p>

          {/* Call Status Indicator */}
          <div className="flex flex-col items-center">
            {callSession.status === 'calling' && (
              <div className="flex items-center gap-2 text-blue-300 text-xl font-semibold">
                <span className="w-3 h-3 bg-blue-400 rounded-full animate-ping" />
                <span>{callSession.isIncoming ? t.callModal.incomingCall : t.callModal.calling}</span>
              </div>
            )}

            {callSession.status === 'connected' && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-emerald-400 text-2xl font-mono font-bold tracking-wider">
                  {formatTime(callSession.durationSeconds)}
                </span>
                {/* Audio Waves Simulation */}
                <div className="flex items-center gap-1.5 h-6">
                  <div className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-6 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-4 bg-emerald-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
                </div>
              </div>
            )}

            {callSession.status === 'ended' && (
              <span className="text-red-400 text-2xl font-bold">
                {t.callModal.callEnded}
              </span>
            )}
          </div>
        </div>

        {/* Incoming Call Answer/Reject Buttons */}
        {callSession.isIncoming && callSession.status === 'calling' ? (
          <div className="w-full flex gap-4 mt-6">
            <button
              onClick={endCall}
              className="flex-1 min-h-touch-lg py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xl flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              <PhoneOff className="w-7 h-7" />
              <span>{t.callModal.reject}</span>
            </button>
            <button
              onClick={answerCall}
              className="flex-1 min-h-touch-lg py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 animate-bounce"
            >
              <PhoneCall className="w-7 h-7" />
              <span>{t.callModal.answer}</span>
            </button>
          </div>
        ) : (
          /* Active Call Controls */
          <div className="w-full flex flex-col gap-6 mt-6">
            <div className="flex items-center justify-around">
              {/* Mute Button */}
              <button
                onClick={toggleMute}
                disabled={callSession.status !== 'connected'}
                className={`p-4 rounded-full border-2 transition-transform active:scale-90 ${
                  callSession.isMuted
                    ? 'bg-amber-600 text-white border-amber-500'
                    : 'bg-slate-800 text-slate-200 border-slate-600 hover:bg-slate-700'
                }`}
                aria-label={callSession.isMuted ? t.callModal.unmute : t.callModal.mute}
              >
                {callSession.isMuted ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>

              {/* Speaker Button */}
              <button
                onClick={toggleSpeaker}
                disabled={callSession.status !== 'connected'}
                className={`p-4 rounded-full border-2 transition-transform active:scale-90 ${
                  callSession.isSpeaker
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-800 text-slate-200 border-slate-600 hover:bg-slate-700'
                }`}
                aria-label={t.callModal.speaker}
              >
                {callSession.isSpeaker ? <Volume2 className="w-8 h-8" /> : <VolumeX className="w-8 h-8" />}
              </button>

              {/* Video Toggle Button */}
              <button
                onClick={toggleVideo}
                disabled={callSession.status !== 'connected'}
                className={`p-4 rounded-full border-2 transition-transform active:scale-90 ${
                  callSession.isVideo
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-800 text-slate-200 border-slate-600 hover:bg-slate-700'
                }`}
                aria-label={t.callModal.video}
              >
                {callSession.isVideo ? <Video className="w-8 h-8" /> : <VideoOff className="w-8 h-8" />}
              </button>
            </div>

            {/* End Call Button */}
            <button
              onClick={endCall}
              className="w-full min-h-touch-lg py-4 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-2xl flex items-center justify-center gap-3 shadow-xl transition-transform active:scale-95 border-2 border-red-500"
            >
              <PhoneOff className="w-8 h-8" />
              <span>{t.callModal.endCall}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
