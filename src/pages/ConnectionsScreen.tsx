import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCall } from '../contexts/CallContext';
import { dataService } from '../services/dataService';
import { soundService } from '../services/soundService';
import { Connection, ConnectionRequest } from '../types';
import { 
  Users, 
  UserCheck, 
  Phone, 
  MessageSquare, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  UserPlus, 
  Clock, 
  Heart,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ConnectionsScreenProps {
  initialTab?: 'family' | 'friends';
  onNavigateToChat: (contactId: string) => void;
  onNavigateToPhotos: (userId?: string) => void;
}

export const ConnectionsScreen: React.FC<ConnectionsScreenProps> = ({
  initialTab = 'family',
  onNavigateToChat,
  onNavigateToPhotos,
}) => {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const { startCall } = useCall();

  const [activeTab, setActiveTab] = useState<'family' | 'friends'>(initialTab);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [inputCode, setInputCode] = useState<string>('');
  const [codeCopied, setCodeCopied] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  useEffect(() => {
    const update = () => {
      setConnections(dataService.getConnections());
      setRequests(dataService.getConnectionRequests());
    };
    update();
    return dataService.subscribe(update);
  }, []);

  const handleCopyCode = () => {
    soundService.playTap();
    navigator.clipboard.writeText(currentUser.connectionCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2500);
  };

  const handleSendCodeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    soundService.playTap();
    const res = dataService.sendConnectionRequest(inputCode, activeTab === 'family' ? 'family' : 'friend');
    setFeedbackMessage(res.message);
    setInputCode('');
    if (res.success) {
      soundService.playSuccess();
    }
  };

  const handleAcceptRequest = (id: string) => {
    soundService.playSuccess();
    dataService.acceptConnectionRequest(id);
    setFeedbackMessage(t.connections.requestAccepted);
  };

  const handleDeclineRequest = (id: string) => {
    soundService.playTap();
    dataService.declineConnectionRequest(id);
    setFeedbackMessage(t.connections.requestDeclined);
  };

  const filteredConnections = connections.filter(c => 
    activeTab === 'family' ? c.category === 'family' : c.category === 'friend'
  );

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 animate-fade-in pb-24">
      
      {/* 1. Header with Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b-2 border-slate-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            {t.connections.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            {language === 'ur'
              ? 'اپنے پیارے خاندانی افراد اور مخلص دوستوں سے رابطہ رکھیں۔'
              : 'Stay in close touch with your loving family members and dear friends.'}
          </p>
        </div>

        {/* Family vs Friends Large Tab Buttons */}
        <div className="flex w-full sm:w-auto bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200">
          <button
            onClick={() => {
              soundService.playTap();
              setActiveTab('family');
            }}
            className={`flex-1 sm:flex-none min-h-touch px-6 py-2.5 rounded-xl font-extrabold text-lg sm:text-xl transition-all ${
              activeTab === 'family'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {t.connections.familyTab}
          </button>
          <button
            onClick={() => {
              soundService.playTap();
              setActiveTab('friends');
            }}
            className={`flex-1 sm:flex-none min-h-touch px-6 py-2.5 rounded-xl font-extrabold text-lg sm:text-xl transition-all ${
              activeTab === 'friends'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {t.connections.friendsTab}
          </button>
        </div>
      </div>

      {/* 2. Your Simple Connection Code Box */}
      <section className="bg-emerald-50 border-3 border-emerald-500 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 bg-emerald-700 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider block">
              {t.connections.yourCodeIs}
            </span>
            <span className="text-3xl sm:text-4xl font-mono font-black text-emerald-950 tracking-wider">
              {currentUser.connectionCode}
            </span>
            <p className="text-xs sm:text-sm text-emerald-800 font-medium mt-1">
              {t.connections.shareCodeTip}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyCode}
          className="w-full sm:w-auto min-h-touch px-6 py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-extrabold text-lg rounded-2xl flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 shrink-0"
        >
          {codeCopied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
          <span>{codeCopied ? t.connections.codeCopied : t.connections.copyCode}</span>
        </button>
      </section>

      {/* 3. Enter Code to Connect Box */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900 mb-3 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-emerald-700" />
          <span>{t.connections.connectWithCode}</span>
        </h2>

        <form onSubmit={handleSendCodeRequest} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder={t.connections.enterCodePlaceholder}
            maxLength={10}
            className="flex-1 min-h-touch px-4 py-3 rounded-2xl border-2 border-slate-300 text-xl font-mono font-bold tracking-wider text-slate-900 focus:border-emerald-600 focus:outline-none uppercase"
          />
          <button
            type="submit"
            className="min-h-touch px-8 py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-black text-xl rounded-2xl shadow-md transition-transform active:scale-95"
          >
            {t.connections.sendRequest}
          </button>
        </form>

        {feedbackMessage && (
          <p className="mt-3 text-base font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-xl animate-fade-in">
            {feedbackMessage}
          </p>
        )}
      </section>

      {/* 4. Pending Connection Requests (if any) */}
      {requests.length > 0 && (
        <section className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm">
          <h2 className="text-xl font-extrabold text-amber-950 mb-3 flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-700" />
            <span>{t.connections.pendingRequests}</span>
          </h2>

          <div className="flex flex-col gap-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <img
                    src={req.requesterAvatar}
                    alt={req.requesterName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {language === 'ur' ? req.requesterNameUrdu : req.requesterName}
                    </h3>
                    <p className="text-sm font-semibold text-slate-600">
                      {language === 'ur' ? req.relationshipUrdu : req.relationship} • {req.createdAt}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleAcceptRequest(req.id)}
                    className="flex-1 sm:flex-none min-h-touch px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-md active:scale-95"
                  >
                    {t.connections.accept}
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(req.id)}
                    className="flex-1 sm:flex-none min-h-touch px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-lg rounded-xl active:scale-95"
                  >
                    {t.connections.decline}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Connections List */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900">
          {activeTab === 'family' ? t.homeScreen.myFamily : t.homeScreen.friends}
        </h2>

        {filteredConnections.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <p className="text-xl text-slate-600 font-semibold mb-4">
              {activeTab === 'family' ? t.connections.noFamilyYet : t.connections.noFriendsYet}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredConnections.map((contact) => {
              const displayName = language === 'ur' ? contact.nameUrdu : contact.name;
              const displayRel = language === 'ur' ? contact.relationshipUrdu : contact.relationship;

              return (
                <div
                  key={contact.id}
                  className="bg-white rounded-3xl p-5 border-3 border-slate-200 hover:border-emerald-500 shadow-md flex flex-col justify-between transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={contact.avatarUrl}
                        alt={displayName}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-3 border-emerald-600 shadow-sm"
                      />
                      {contact.isOnline && (
                        <span 
                          className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" 
                          title={t.connections.online} 
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
                          {displayName}
                        </h3>
                        {contact.isEmergencyContact && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-md font-bold">
                            SOS
                          </span>
                        )}
                      </div>
                      <p className="text-base text-emerald-800 font-bold capitalize mt-0.5">
                        {displayRel}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {contact.isOnline ? t.connections.online : t.connections.offline}
                      </p>
                    </div>
                  </div>

                  {/* 3 Simple Actions: Call, Message, Photos */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                    {/* Call Button */}
                    <button
                      onClick={() => {
                        soundService.playTap();
                        startCall(contact);
                      }}
                      className="min-h-touch py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-base sm:text-lg flex flex-col items-center justify-center shadow-md active:scale-95 transition-transform"
                    >
                      <Phone className="w-6 h-6 mb-1" />
                      <span>{t.call}</span>
                    </button>

                    {/* Message Button */}
                    <button
                      onClick={() => {
                        soundService.playTap();
                        onNavigateToChat(contact.contactId);
                      }}
                      className="min-h-touch py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-base sm:text-lg flex flex-col items-center justify-center shadow-md active:scale-95 transition-transform"
                    >
                      <MessageSquare className="w-6 h-6 mb-1" />
                      <span>{t.message}</span>
                    </button>

                    {/* Photos Button */}
                    <button
                      onClick={() => {
                        soundService.playTap();
                        onNavigateToPhotos(contact.contactId);
                      }}
                      className="min-h-touch py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-extrabold text-base sm:text-lg flex flex-col items-center justify-center shadow-md active:scale-95 transition-transform"
                    >
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span>{t.photos}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
