// Speech Recognition and Text-To-Speech Service
// Supports English (en-US) and Urdu (ur-PK)

import { Language } from '../types';

class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  isSpeechSupported(): boolean {
    return Boolean(this.recognition);
  }

  isTtsSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  // Text-To-Speech tailored for seniors (clear, calm pacing)
  speak(text: string, lang: Language = 'en') {
    if (!this.isTtsSupported()) return;

    window.speechSynthesis.cancel(); // Cancel any existing speech

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.lang = lang === 'ur' ? 'ur-PK' : 'en-US';
    utterance.rate = 0.88; // Gentle, clear speed for senior comfort
    utterance.pitch = 1.0;

    // Try finding an appropriate voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      lang === 'ur' 
        ? v.lang.startsWith('ur') || v.lang.startsWith('ar') 
        : v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.isTtsSupported()) {
      window.speechSynthesis.cancel();
    }
  }

  // Voice Command Listener
  startListening(
    lang: Language,
    onResult: (transcript: string) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError(new Error('Speech recognition not supported in this browser.'));
      return;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }

    this.recognition.lang = lang === 'ur' ? 'ur-PK' : 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      this.isListening = false;
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      onError(e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (e) {}
    }
  }
}

export const speechService = new SpeechService();
