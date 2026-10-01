import React, { createContext, useContext, useState, useEffect } from 'react';
import { FontSizePreference, ContrastMode } from '../types';

interface AccessibilityContextType {
  fontSize: FontSizePreference;
  setFontSize: (size: FontSizePreference) => void;
  contrastMode: ContrastMode;
  setContrastMode: (mode: ContrastMode) => void;
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
  voiceAssistance: boolean;
  setVoiceAssistance: (enabled: boolean) => void;
  showAccessibilityModal: boolean;
  setShowAccessibilityModal: (show: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEYS = {
  FONT_SIZE: 'connectcircle_font_size',
  CONTRAST: 'connectcircle_contrast',
  REDUCED_MOTION: 'connectcircle_reduced_motion',
  VOICE_ASSIST: 'connectcircle_voice_assist',
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSizePreference>(() => {
    return (localStorage.getItem(STORAGE_KEYS.FONT_SIZE) as FontSizePreference) || 'large';
  });

  const [contrastMode, setContrastModeState] = useState<ContrastMode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.CONTRAST) as ContrastMode) || 'standard';
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.REDUCED_MOTION) === 'true';
  });

  const [voiceAssistance, setVoiceAssistanceState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VOICE_ASSIST);
    return saved !== null ? saved === 'true' : true;
  });

  const [showAccessibilityModal, setShowAccessibilityModal] = useState<boolean>(false);

  const setFontSize = (size: FontSizePreference) => {
    setFontSizeState(size);
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, size);
  };

  const setContrastMode = (mode: ContrastMode) => {
    setContrastModeState(mode);
    localStorage.setItem(STORAGE_KEYS.CONTRAST, mode);
  };

  const setReducedMotion = (reduced: boolean) => {
    setReducedMotionState(reduced);
    localStorage.setItem(STORAGE_KEYS.REDUCED_MOTION, String(reduced));
  };

  const setVoiceAssistance = (enabled: boolean) => {
    setVoiceAssistanceState(enabled);
    localStorage.setItem(STORAGE_KEYS.VOICE_ASSIST, String(enabled));
  };

  // Sync DOM classes
  useEffect(() => {
    const root = document.documentElement;

    // Font size scaling
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xl');
    root.classList.add(`font-size-${fontSize}`);

    // Contrast modes
    root.classList.remove('contrast-dark', 'contrast-yellow');
    if (contrastMode === 'high-contrast-dark') {
      root.classList.add('contrast-dark');
    } else if (contrastMode === 'high-contrast-yellow') {
      root.classList.add('contrast-yellow');
    }

    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [fontSize, contrastMode, reducedMotion]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        contrastMode,
        setContrastMode,
        reducedMotion,
        setReducedMotion,
        voiceAssistance,
        setVoiceAssistance,
        showAccessibilityModal,
        setShowAccessibilityModal,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
