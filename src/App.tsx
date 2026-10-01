import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CallProvider } from './contexts/CallContext';

// Components & Modals
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { LanguageSelectionModal } from './components/LanguageSelectionModal';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { CallModal } from './components/CallModal';
import { EmergencyHelpModal } from './components/EmergencyHelpModal';
import { VoiceCommandModal } from './components/VoiceCommandModal';
import { AccessibilitySettingsModal } from './components/AccessibilitySettingsModal';
import { AuthModal } from './components/AuthModal';

// Screens
import { HomeScreen } from './pages/HomeScreen';
import { ConnectionsScreen } from './pages/ConnectionsScreen';
import { MessagesScreen } from './pages/MessagesScreen';
import { PhotosScreen } from './pages/PhotosScreen';
import { CommunitiesScreen } from './pages/CommunitiesScreen';
import { ActivitiesScreen } from './pages/ActivitiesScreen';
import { AiAssistantScreen } from './pages/AiAssistantScreen';
import { SettingsScreen } from './pages/SettingsScreen';

const MainAppContent: React.FC = () => {
  const { language } = useLanguage();
  const { currentUser } = useAuth();

  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [screenPayload, setScreenPayload] = useState<any>(null);

  // Modals state
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(() => {
    return !localStorage.getItem('connectcircle_tutorial_done');
  });

  const handleNavigate = (screen: string, payload?: any) => {
    setCurrentScreen(screen);
    setScreenPayload(payload);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTutorialComplete = () => {
    localStorage.setItem('connectcircle_tutorial_done', 'true');
    setShowTutorial(false);
  };

  return (
    <div className="min-h-screen bg-senior-warm text-slate-900 flex flex-col justify-between selection:bg-emerald-200">
      
      {/* Top Accessible Navbar */}
      <Navbar
        onOpenVoice={() => setShowVoiceModal(true)}
        onOpenEmergency={() => setShowEmergencyModal(true)}
        onNavigateHome={() => handleNavigate('home')}
        onNavigateProfile={() => handleNavigate('settings')}
      />

      {/* Main Content Area (Mobile/Tablet Centered Frame for Desktop) */}
      <main className="flex-1 w-full max-w-4xl mx-auto">
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onOpenEmergency={() => setShowEmergencyModal(true)}
          />
        )}

        {currentScreen === 'connections' && (
          <ConnectionsScreen
            initialTab={screenPayload?.tab || 'family'}
            onNavigateToChat={(contactId) => handleNavigate('messages', { contactId })}
            onNavigateToPhotos={() => handleNavigate('photos')}
          />
        )}

        {currentScreen === 'messages' && (
          <MessagesScreen
            selectedContactId={screenPayload?.contactId}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {currentScreen === 'photos' && (
          <PhotosScreen />
        )}

        {currentScreen === 'communities' && (
          <CommunitiesScreen />
        )}

        {currentScreen === 'activities' && (
          <ActivitiesScreen
            initialTab={screenPayload?.tab || 'all'}
          />
        )}

        {currentScreen === 'ai-helper' && (
          <AiAssistantScreen />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            onReplayTutorial={() => setShowTutorial(true)}
          />
        )}
      </main>

      {/* Bottom Senior Touch Navigation Bar */}
      <BottomNav
        currentTab={currentScreen}
        onSelectTab={(tab) => handleNavigate(tab)}
        unreadMessagesCount={2}
      />

      {/* Global Modals & Overlays */}
      <LanguageSelectionModal />
      
      {showTutorial && (
        <OnboardingTutorial onComplete={handleTutorialComplete} />
      )}

      <CallModal />
      
      <EmergencyHelpModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />

      <VoiceCommandModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onNavigate={(screen) => handleNavigate(screen)}
      />

      <AccessibilitySettingsModal />
      <AuthModal />

    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <CallProvider>
            <MainAppContent />
          </CallProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
}

export default App;
