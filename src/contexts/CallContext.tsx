import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CallSession, Connection } from '../types';
import { soundService } from '../services/soundService';

interface CallContextType {
  callSession: CallSession;
  startCall: (contact: Connection, isVideo?: boolean) => void;
  answerCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  toggleVideo: () => void;
  simulateIncomingCall: (contact: Connection) => void;
}

const initialCallSession: CallSession = {
  active: false,
  isIncoming: false,
  isVideo: false,
  isMuted: false,
  isSpeaker: true,
  durationSeconds: 0,
  status: 'idle',
};

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [callSession, setCallSession] = useState<CallSession>(initialCallSession);
  const timerRef = useRef<number | null>(null);
  const connectTimeoutRef = useRef<number | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
      soundService.stopPhoneRinging();
    };
  }, []);

  const startCall = (contact: Connection, isVideo: boolean = false) => {
    soundService.playTap();
    soundService.startPhoneRinging();

    setCallSession({
      active: true,
      contact,
      isIncoming: false,
      isVideo,
      isMuted: false,
      isSpeaker: true,
      durationSeconds: 0,
      status: 'calling',
    });

    // Simulate contact answering after 2.5 seconds
    if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    connectTimeoutRef.current = window.setTimeout(() => {
      soundService.playCallConnected();
      setCallSession(prev => ({
        ...prev,
        status: 'connected',
      }));

      // Start duration counter
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setCallSession(prev => ({
          ...prev,
          durationSeconds: prev.durationSeconds + 1,
        }));
      }, 1000);
    }, 2800);
  };

  const simulateIncomingCall = (contact: Connection) => {
    soundService.startPhoneRinging();
    setCallSession({
      active: true,
      contact,
      isIncoming: true,
      isVideo: false,
      isMuted: false,
      isSpeaker: true,
      durationSeconds: 0,
      status: 'calling',
    });
  };

  const answerCall = () => {
    soundService.playCallConnected();
    setCallSession(prev => ({
      ...prev,
      isIncoming: false,
      status: 'connected',
    }));

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setCallSession(prev => ({
        ...prev,
        durationSeconds: prev.durationSeconds + 1,
      }));
    }, 1000);
  };

  const endCall = () => {
    soundService.playCallEnded();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }

    setCallSession(prev => ({
      ...prev,
      status: 'ended',
    }));

    // Fade out after 1.2s
    window.setTimeout(() => {
      setCallSession(initialCallSession);
    }, 1200);
  };

  const toggleMute = () => {
    soundService.playTap();
    setCallSession(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const toggleSpeaker = () => {
    soundService.playTap();
    setCallSession(prev => ({ ...prev, isSpeaker: !prev.isSpeaker }));
  };

  const toggleVideo = () => {
    soundService.playTap();
    setCallSession(prev => ({ ...prev, isVideo: !prev.isVideo }));
  };

  return (
    <CallContext.Provider
      value={{
        callSession,
        startCall,
        answerCall,
        endCall,
        toggleMute,
        toggleSpeaker,
        toggleVideo,
        simulateIncomingCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = (): CallContextType => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
