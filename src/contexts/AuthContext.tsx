import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { dataService } from '../services/dataService';
import { INITIAL_USER, FAMILY_USER_SARAH } from '../data/mockData';
import { soundService } from '../services/soundService';

interface AuthContextType {
  currentUser: UserProfile;
  isGuest: boolean;
  loginAsSenior: () => void;
  loginAsFamily: () => void;
  loginWithEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => dataService.getCurrentUser());
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('connectcircle_is_guest') === 'true';
  });
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    return dataService.subscribe(() => {
      setCurrentUser(dataService.getCurrentUser());
    });
  }, []);

  const loginAsSenior = () => {
    soundService.playTap();
    dataService.setCurrentUser(INITIAL_USER);
    setIsGuest(false);
    localStorage.setItem('connectcircle_is_guest', 'false');
    setShowAuthModal(false);
  };

  const loginAsFamily = () => {
    soundService.playTap();
    dataService.setCurrentUser(FAMILY_USER_SARAH);
    setIsGuest(false);
    localStorage.setItem('connectcircle_is_guest', 'false');
    setShowAuthModal(false);
  };

  const loginWithEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
    soundService.playTap();
    // Simulate magic link or email login
    const newUser: UserProfile = {
      ...INITIAL_USER,
      email,
      fullName: email.split('@')[0],
      connectionCode: email.substring(0, 3).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900),
    };
    dataService.setCurrentUser(newUser);
    setIsGuest(false);
    localStorage.setItem('connectcircle_is_guest', 'false');
    setShowAuthModal(false);
    return { success: true, message: 'Signed in successfully!' };
  };

  const signOut = () => {
    soundService.playTap();
    setIsGuest(true);
    localStorage.setItem('connectcircle_is_guest', 'true');
    dataService.setCurrentUser(INITIAL_USER);
  };

  const updateProfile = (partial: Partial<UserProfile>) => {
    const updated = { ...currentUser, ...partial };
    dataService.setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isGuest,
        loginAsSenior,
        loginAsFamily,
        loginWithEmail,
        signOut,
        updateProfile,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
