import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCall } from '../contexts/CallContext';
import { dataService } from '../services/dataService';
import { soundService } from '../services/soundService';
import { AlertCircle, Phone, X, HeartHandshake, Stethoscope, Siren } from 'lucide-react';

interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHelpModal: React.FC<EmergencyHelpModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { startCall } = useCall();

  if (!isOpen) return null;

  const contacts = dataService.getEmergencyContacts();
  const connections = dataService.getConnections();

  const handleCallFamily = () => {
    soundService.playSosChime();
    const familyConn = connections.find(c => c.isEmergencyContact) || connections[0];
    onClose();
    if (familyConn) {
      startCall(familyConn);
    }
  };

  const handleCallCaregiver = () => {
    soundService.playSosChime();
    const caregiverContact = contacts.find(c => !c.isPrimary) || contacts[1] || contacts[0];
    onClose();
    startCall({
      id: 'conn-caregiver',
      userId: 'usr-maggie-001',
      contactId: 'usr-dr-arshad',
      name: caregiverContact.name,
      nameUrdu: caregiverContact.nameUrdu,
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      category: 'friend',
      relationship: 'caregiver',
      relationshipUrdu: 'معالج / تیماردار',
      isEmergencyContact: true,
      isOnline: true,
    });
  };

  const handleSimulateHelpline = () => {
    soundService.playSosChime();
    onClose();
    startCall({
      id: 'conn-emergency-services',
      userId: 'usr-maggie-001',
      contactId: 'usr-helpline',
      name: language === 'ur' ? 'امدادی ہیلپ لائن (ڈیمو)' : 'Emergency Helpline (Demo)',
      nameUrdu: 'امدادی ہیلپ لائن (ڈیمو)',
      avatarUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
      category: 'friend',
      relationship: 'caregiver',
      relationshipUrdu: 'ہنگامی خدمت',
      isEmergencyContact: true,
      isOnline: true,
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-title"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-red-600 p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
              <span className="text-3xl font-extrabold">🆘</span>
            </div>
            <div>
              <h2 id="emergency-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t.helpEmergency.title}
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                {t.helpEmergency.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-slate-700 rounded-xl active:scale-90"
            aria-label={t.close}
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* University Demo Notice */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3 text-red-800 text-sm mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="leading-snug">
            {t.helpEmergency.simulationWarning}
          </p>
        </div>

        {/* 3 Prominent Options */}
        <div className="flex flex-col gap-4">
          {/* Family Contact Button */}
          <button
            onClick={handleCallFamily}
            className="w-full min-h-touch-lg p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex items-center justify-between shadow-lg transition-transform active:scale-98 border-2 border-emerald-500"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 bg-emerald-700 rounded-xl flex items-center justify-center">
                <HeartHandshake className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold leading-snug">
                  {t.helpEmergency.callFamilyEmergency}
                </h3>
                <p className="text-emerald-100 font-medium text-base">
                  {t.helpEmergency.familyContactName}
                </p>
              </div>
            </div>
            <Phone className="w-8 h-8 text-emerald-200" />
          </button>

          {/* Caregiver Button */}
          <button
            onClick={handleCallCaregiver}
            className="w-full min-h-touch-lg p-5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white flex items-center justify-between shadow-lg transition-transform active:scale-98 border-2 border-blue-500"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 bg-blue-700 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold leading-snug">
                  {t.helpEmergency.callCaregiver}
                </h3>
                <p className="text-blue-100 font-medium text-base">
                  {t.helpEmergency.caregiverName}
                </p>
              </div>
            </div>
            <Phone className="w-8 h-8 text-blue-200" />
          </button>

          {/* Emergency Helpline (Demo) Button */}
          <button
            onClick={handleSimulateHelpline}
            className="w-full min-h-touch-lg p-5 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white flex items-center justify-between shadow-lg transition-transform active:scale-98 border-2 border-red-500"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 bg-red-700 rounded-xl flex items-center justify-center">
                <Siren className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold leading-snug">
                  {t.helpEmergency.callEmergencyServices}
                </h3>
                <p className="text-red-100 font-medium text-base">
                  {t.helpEmergency.emergencyHelpline}
                </p>
              </div>
            </div>
            <Phone className="w-8 h-8 text-red-200" />
          </button>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-4 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold text-lg border border-slate-300"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
};
