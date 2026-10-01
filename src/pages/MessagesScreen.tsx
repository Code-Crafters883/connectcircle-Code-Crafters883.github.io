import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCall } from '../contexts/CallContext';
import { dataService } from '../services/dataService';
import { soundService } from '../services/soundService';
import { Message, Connection } from '../types';
import { 
  Send, 
  Mic, 
  Square, 
  Image as ImageIcon, 
  Phone, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CheckCheck, 
  Smile, 
  Play, 
  Pause 
} from 'lucide-react';

interface MessagesScreenProps {
  selectedContactId?: string;
  onBackToHome?: () => void;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({
  selectedContactId,
  onBackToHome,
}) => {
  const { t, language, direction } = useLanguage();
  const { currentUser } = useAuth();
  const { startCall } = useCall();

  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeContactId, setActiveContactId] = useState<string>(selectedContactId || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState<string>('');
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const conns = dataService.getConnections();
      setConnections(conns);
      if (!activeContactId && conns.length > 0) {
        setActiveContactId(conns[0].contactId);
      }
      setMessages(dataService.getMessages());
    };
    update();
    return dataService.subscribe(update);
  }, [activeContactId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeContactId]);

  const activeContact = connections.find(c => c.contactId === activeContactId) || connections[0];

  const filteredMessages = messages.filter(
    m => 
      (m.senderId === currentUser.id && m.receiverId === activeContactId) ||
      (m.senderId === activeContactId && m.receiverId === currentUser.id)
  );

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInput.trim() || !activeContactId) return;

    soundService.playTap();
    dataService.sendMessage(activeContactId, textInput.trim(), 'text');
    setTextInput('');
  };

  const handleStartVoiceRecording = () => {
    soundService.playTap();
    setIsRecordingVoice(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = window.setInterval(() => {
      setRecordingSeconds(s => s + 1);
    }, 1000);
  };

  const handleStopVoiceRecordingAndSend = () => {
    soundService.playSuccess();
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecordingVoice(false);
    dataService.sendMessage(
      activeContactId,
      language === 'ur' ? `صوتی پیغام (${recordingSeconds} سیکنڈ)` : `Voice message (${recordingSeconds}s)`,
      'voice'
    );
  };

  const handleSendSimulatedPhoto = () => {
    soundService.playSuccess();
    const demoPhotos = [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=600&q=80'
    ];
    const randomPic = demoPhotos[Math.floor(Math.random() * demoPhotos.length)];
    dataService.sendMessage(activeContactId, 'Photo attached', 'photo', randomPic);
  };

  const handleAddReaction = (msgId: string, emoji: string) => {
    soundService.playTap();
    dataService.addMessageReaction(msgId, emoji);
  };

  const handlePlayVoice = (msgId: string) => {
    soundService.playSuccess();
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(msgId);
      setTimeout(() => setPlayingVoiceId(null), 3500);
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4 animate-fade-in pb-24">
      
      {/* 1. Contact Selector Bar (Horizontal scroll of friendly avatars) */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border-2 border-slate-200 shadow-sm flex items-center gap-3 overflow-x-auto">
        {connections.map((c) => {
          const isSelected = c.contactId === activeContactId;
          const displayName = language === 'ur' ? c.nameUrdu : c.name;
          return (
            <button
              key={c.contactId}
              onClick={() => {
                soundService.playTap();
                setActiveContactId(c.contactId);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 shrink-0 transition-all ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-sm ring-2 ring-emerald-500'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="relative">
                <img
                  src={c.avatarUrl}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                {c.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border border-white rounded-full" />
                )}
              </div>
              <span className="text-base sm:text-lg font-bold">
                {displayName}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Chat Conversation Box */}
      {activeContact ? (
        <div className="bg-white rounded-3xl border-3 border-slate-200 shadow-md flex flex-col h-[540px] overflow-hidden">
          
          {/* Active Contact Header */}
          <div className="bg-slate-50 border-b-2 border-slate-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeContact.avatarUrl}
                alt={activeContact.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600"
              />
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {language === 'ur' ? activeContact.nameUrdu : activeContact.name}
                </h2>
                <p className="text-sm font-bold text-emerald-800 capitalize">
                  {language === 'ur' ? activeContact.relationshipUrdu : activeContact.relationship} • {activeContact.isOnline ? t.connections.online : t.connections.offline}
                </p>
              </div>
            </div>

            {/* Quick Call Header Button */}
            <button
              onClick={() => {
                soundService.playTap();
                startCall(activeContact);
              }}
              className="min-h-touch px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-base rounded-2xl flex items-center gap-2 shadow-md active:scale-95"
            >
              <Phone className="w-5 h-5" />
              <span>{t.call}</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-xl font-bold">{t.messaging.noConversations}</p>
                <p className="text-base">{t.messaging.startConversation}</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-3xl shadow-sm text-lg sm:text-xl leading-relaxed relative ${
                        isMe
                          ? 'bg-emerald-700 text-white rounded-br-none'
                          : 'bg-white text-slate-900 border-2 border-slate-200 rounded-bl-none'
                      }`}
                    >
                      {/* Photo Attachment inside Message */}
                      {msg.messageType === 'photo' && msg.mediaUrl && (
                        <img
                          src={msg.mediaUrl}
                          alt="Shared attachment"
                          className="w-full max-h-60 rounded-2xl object-cover mb-2 border"
                        />
                      )}

                      {/* Voice Note Simulation inside Message */}
                      {msg.messageType === 'voice' ? (
                        <div className="flex items-center gap-3 py-1">
                          <button
                            onClick={() => handlePlayVoice(msg.id)}
                            className={`p-3 rounded-full ${
                              isMe ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {playingVoiceId === msg.id ? (
                              <Pause className="w-6 h-6 animate-pulse" />
                            ) : (
                              <Play className="w-6 h-6" />
                            )}
                          </button>
                          <div>
                            <span className="font-bold text-base block">
                              {msg.content}
                            </span>
                            <span className="text-xs opacity-75">
                              {playingVoiceId === msg.id ? 'Playing voice note...' : 'Tap to listen'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p>{msg.content}</p>
                      )}

                      {/* Footer: Time and Read Tick */}
                      <div className={`flex items-center gap-1.5 text-xs font-semibold mt-1 ${isMe ? 'text-emerald-200 justify-end' : 'text-slate-400'}`}>
                        <span>{msg.createdAt}</span>
                        {isMe && (
                          <CheckCheck className={`w-4 h-4 ${msg.isRead ? 'text-amber-300' : 'text-emerald-200'}`} />
                        )}
                      </div>

                      {/* Reaction Tag if attached */}
                      {msg.reaction && (
                        <span className="absolute -bottom-3 right-3 text-lg bg-white border border-slate-200 rounded-full px-2 py-0.5 shadow-sm">
                          {msg.reaction}
                        </span>
                      )}
                    </div>

                    {/* Quick Reactions bar on hover or touch */}
                    <div className="flex items-center gap-1 mt-1 opacity-70 hover:opacity-100 transition-opacity">
                      {['❤️', '👍', '😊', '🌸', '🙏'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleAddReaction(msg.id, emoji)}
                          className="hover:scale-125 transition-transform p-1 text-base"
                          title="React"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Recording Active Bar */}
          {isRecordingVoice ? (
            <div className="bg-red-50 border-t-2 border-red-300 p-4 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3 text-red-700">
                <Mic className="w-8 h-8 animate-bounce" />
                <span className="text-xl font-bold">
                  {t.messaging.recordingVoice} ({recordingSeconds}s)
                </span>
              </div>
              <button
                onClick={handleStopVoiceRecordingAndSend}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-lg rounded-2xl shadow-md active:scale-95 flex items-center gap-2"
              >
                <Square className="w-5 h-5 fill-current" />
                <span>{t.messaging.stopRecording}</span>
              </button>
            </div>
          ) : (
            /* Standard Senior Message Input Bar with Big Touch Controls */
            <form onSubmit={handleSendMessage} className="bg-white border-t-2 border-slate-200 p-3 sm:p-4 flex items-center gap-2">
              {/* Photo Attachment Button */}
              <button
                type="button"
                onClick={handleSendSimulatedPhoto}
                className="w-13 h-13 p-3 text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-2xl active:scale-90 flex items-center justify-center shrink-0 border border-purple-300"
                title={t.messaging.attachPhoto}
                aria-label={t.messaging.attachPhoto}
              >
                <ImageIcon className="w-7 h-7" />
              </button>

              {/* Record Voice Note Button */}
              <button
                type="button"
                onClick={handleStartVoiceRecording}
                className="w-13 h-13 p-3 text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-2xl active:scale-90 flex items-center justify-center shrink-0 border border-emerald-300"
                title="Record Voice Note"
                aria-label="Record Voice Note"
              >
                <Mic className="w-7 h-7" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={t.messaging.typeMessagePlaceholder}
                className="flex-1 min-h-touch px-4 py-3 rounded-2xl border-2 border-slate-300 text-lg sm:text-xl text-slate-900 focus:border-emerald-600 focus:outline-none"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!textInput.trim()}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md active:scale-95 shrink-0 transition-all ${
                  textInput.trim()
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                aria-label={t.send}
              >
                {direction === 'rtl' ? <ArrowLeft className="w-7 h-7" /> : <Send className="w-7 h-7" />}
              </button>
            </form>
          )}

        </div>
      ) : null}

    </div>
  );
};
