import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { soundService } from '../services/soundService';
import { PhotoItem } from '../types';
import { 
  Heart, 
  ArrowLeft, 
  ArrowRight, 
  UploadCloud, 
  X, 
  Check, 
  Lock, 
  Globe2, 
  Users, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PhotosScreen: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { currentUser } = useAuth();

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [captionInput, setCaptionInput] = useState<string>('');
  const [audience, setAudience] = useState<'family' | 'friends' | 'all'>('family');
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    const update = () => {
      setPhotos(dataService.getPhotos());
    };
    update();
    return dataService.subscribe(update);
  }, []);

  const currentPhoto = photos[currentIndex] || photos[0];

  const handleNextPhoto = () => {
    soundService.playTap();
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handlePrevPhoto = () => {
    soundService.playTap();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(photos.length - 1);
    }
  };

  const handleLike = () => {
    if (!currentPhoto) return;
    soundService.playSuccess();
    dataService.toggleLikePhoto(currentPhoto.id);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#ef4444', '#ec4899', '#f59e0b']
    });
  };

  const handleUploadNewPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playSuccess();
    
    // Sample high quality image urls for demo uploads
    const sampleStockPhotos = [
      'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528732263440-4dd1a18a4cc2?auto=format&fit=crop&w=800&q=80',
    ];
    const pickedPhoto = sampleStockPhotos[Math.floor(Math.random() * sampleStockPhotos.length)];

    dataService.uploadPhoto(pickedPhoto, captionInput || 'A cherished family moment.', audience);
    setCaptionInput('');
    setShowUploadModal(false);
    setCurrentIndex(0); // Show newly uploaded photo
    setFeedback(t.photosScreen.photoUploadedSuccess);
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 animate-fade-in pb-24">
      
      {/* 1. Header with Add Photo Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b-2 border-slate-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            {t.photosScreen.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            {language === 'ur'
              ? 'خاندان اور دوستوں کی پیاری یادیں بڑے سائز میں دیکھیں۔'
              : 'Cherished memories shared by your loved ones, presented in clear, large format.'}
          </p>
        </div>

        <button
          onClick={() => {
            soundService.playTap();
            setShowUploadModal(true);
          }}
          className="w-full sm:w-auto min-h-touch px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-extrabold text-xl rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform"
        >
          <UploadCloud className="w-7 h-7" />
          <span>{t.photosScreen.uploadPhoto}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-100 border-2 border-emerald-500 rounded-2xl text-emerald-900 font-bold text-lg text-center animate-fade-in">
          {feedback}
        </div>
      )}

      {/* 2. Senior-First Large Photo Gallery Viewer */}
      {photos.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200">
          <p className="text-2xl text-slate-600 font-bold mb-4">{t.photosScreen.noPhotos}</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-3 border-slate-200 shadow-xl overflow-hidden flex flex-col">
          
          {/* Photo Top Bar: Author, Audience Badge, and Counter */}
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentPhoto.authorAvatar}
                alt={currentPhoto.authorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600"
              />
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {currentPhoto.authorName}
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {currentPhoto.createdAt}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="bg-purple-100 text-purple-900 text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>
                  {currentPhoto.audience === 'family' 
                    ? t.photosScreen.audienceFamily 
                    : currentPhoto.audience === 'friends' 
                    ? t.photosScreen.audienceFriends 
                    : t.photosScreen.audienceAll}
                </span>
              </span>

              <span className="text-base font-black text-slate-700 bg-slate-200 px-3 py-1 rounded-xl">
                {currentIndex + 1} / {photos.length}
              </span>
            </div>
          </div>

          {/* Big Photo Image */}
          <div className="relative bg-slate-950 flex items-center justify-center min-h-[350px] sm:min-h-[460px]">
            <img
              src={currentPhoto.photoUrl}
              alt={currentPhoto.caption}
              className="w-full max-h-[520px] object-contain shadow-inner"
            />
          </div>

          {/* Photo Caption & Reaction Bar */}
          <div className="p-5 sm:p-6 bg-white space-y-4">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              {language === 'ur' && currentPhoto.captionUrdu ? currentPhoto.captionUrdu : currentPhoto.caption}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {/* Heart Reaction Button */}
              <button
                onClick={handleLike}
                className={`min-h-touch px-6 py-3 rounded-2xl flex items-center gap-3 text-xl font-extrabold shadow-md active:scale-95 transition-transform ${
                  currentPhoto.isLikedByMe
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-2 border-rose-300'
                }`}
              >
                <Heart className={`w-7 h-7 ${currentPhoto.isLikedByMe ? 'fill-white' : 'fill-rose-500 text-rose-500'}`} />
                <span>
                  {currentPhoto.likesCount} {currentPhoto.isLikedByMe ? t.photosScreen.liked : t.photosScreen.like}
                </span>
              </button>

              {/* Prev and Next Big Navigation Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevPhoto}
                  className="min-h-touch px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-lg flex items-center gap-2 border-2 border-slate-300 active:scale-95 transition-transform"
                  aria-label={t.previous}
                >
                  {direction === 'rtl' ? <ArrowRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
                  <span>{t.previous}</span>
                </button>

                <button
                  onClick={handleNextPhoto}
                  className="min-h-touch px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-lg flex items-center gap-2 shadow-md active:scale-95 transition-transform"
                  aria-label={t.next}
                >
                  <span>{t.next}</span>
                  {direction === 'rtl' ? <ArrowLeft className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. Upload Photo Modal */}
      {showUploadModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-emerald-600 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <h2 className="text-2xl font-black text-slate-900">
                {t.photosScreen.uploadPhoto}
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <form onSubmit={handleUploadNewPhoto} className="space-y-4">
              {/* Photo preview placeholder */}
              <div className="w-full h-44 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-500">
                <UploadCloud className="w-12 h-12 text-emerald-600 mb-2" />
                <span className="font-bold text-lg text-slate-700">{t.photosScreen.chooseFile}</span>
                <span className="text-xs text-slate-400">(A high quality garden/family photo is prepared)</span>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-base font-bold text-slate-800 mb-1">
                  Caption / یادداشت:
                </label>
                <input
                  type="text"
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  placeholder={t.photosScreen.captionPlaceholder}
                  className="w-full min-h-touch px-4 py-3 rounded-xl border-2 border-slate-300 text-lg focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Audience Selector */}
              <div>
                <label className="block text-base font-bold text-slate-800 mb-2">
                  {t.photosScreen.whoCanSee}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'family', label: t.photosScreen.audienceFamily },
                    { id: 'friends', label: t.photosScreen.audienceFriends },
                    { id: 'all', label: t.photosScreen.audienceAll },
                  ].map((aud) => (
                    <button
                      key={aud.id}
                      type="button"
                      onClick={() => setAudience(aud.id as any)}
                      className={`p-3 rounded-xl border-2 font-bold text-sm text-center ${
                        audience === aud.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      {aud.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-touch py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xl rounded-2xl shadow-lg mt-4 active:scale-95"
              >
                {t.share}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
