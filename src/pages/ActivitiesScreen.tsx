import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { dataService } from '../services/dataService';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';
import { QUIZ_QUESTIONS, SHORT_STORIES } from '../data/mockData';
import { HobbyProject } from '../types';
import { 
  Sparkles, 
  Brain, 
  Flame, 
  Palette, 
  BookOpen, 
  Music, 
  Flower2, 
  Check, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Play, 
  Sun, 
  Droplet, 
  Plus, 
  Heart,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActivitiesScreenProps {
  initialTab?: string;
}

export const ActivitiesScreen: React.FC<ActivitiesScreenProps> = ({ initialTab = 'all' }) => {
  const { t, language, direction } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('knitting'); // Default spotlight on Knitting Streak!

  // --- 1. Memory Game State ---
  const initialCards = ['🍎', '🍌', '🍇', '🍓', '🍒', '🥑'];
  const [memoryCards, setMemoryCards] = useState<string[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState<number>(0);

  const resetMemoryGame = () => {
    const deck = [...initialCards, ...initialCards].sort(() => Math.random() - 0.5);
    setMemoryCards(deck);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMemoryMoves(0);
  };

  useEffect(() => {
    resetMemoryGame();
  }, []);

  const handleCardClick = (idx: number) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(idx) || matchedPairs.includes(memoryCards[idx])) {
      return;
    }
    soundService.playTap();
    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (memoryCards[first] === memoryCards[second]) {
        soundService.playSuccess();
        const newMatched = [...matchedPairs, memoryCards[first]];
        setMatchedPairs(newMatched);
        setFlippedIndices([]);
        if (newMatched.length === initialCards.length) {
          confetti({ particleCount: 50, spread: 80 });
        }
      } else {
        setTimeout(() => setFlippedIndices([]), 1000);
      }
    }
  };

  // --- 2. Tile Puzzle State (3x3 grid) ---
  const [puzzleTiles, setPuzzleTiles] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 0, 8]); // 0 is empty
  const [puzzleMoves, setPuzzleMoves] = useState<number>(0);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState<boolean>(false);

  const handleTileClick = (index: number) => {
    const emptyIndex = puzzleTiles.indexOf(0);
    const validMoves = [
      emptyIndex - 1, // left
      emptyIndex + 1, // right
      emptyIndex - 3, // up
      emptyIndex + 3, // down
    ];

    // Check boundary
    const isAdjacent = validMoves.includes(index) &&
      !(emptyIndex % 3 === 0 && index === emptyIndex - 1) &&
      !(emptyIndex % 3 === 2 && index === emptyIndex + 1);

    if (isAdjacent) {
      soundService.playTap();
      const newTiles = [...puzzleTiles];
      newTiles[emptyIndex] = newTiles[index];
      newTiles[index] = 0;
      setPuzzleTiles(newTiles);
      setPuzzleMoves(m => m + 1);

      // Check win
      const solved = newTiles.slice(0, 8).every((val, i) => val === i + 1);
      if (solved) {
        setIsPuzzleSolved(true);
        soundService.playSuccess();
        confetti({ particleCount: 40 });
      }
    }
  };

  // --- 3. Chess Board Demo State ---
  const [selectedChessSquare, setSelectedChessSquare] = useState<string | null>(null);
  const [chessMoveLog, setChessMoveLog] = useState<string>('White: e4, Black: e5');

  // --- 4. Daily Quiz State ---
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const currentQuestion = QUIZ_QUESTIONS[quizIndex];

  const handleSelectOption = (idx: number) => {
    soundService.playTap();
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === currentQuestion.correctIndex) {
      soundService.playSuccess();
      setQuizScore(s => s + 1);
      confetti({ particleCount: 20 });
    }
  };

  const handleNextQuizQuestion = () => {
    soundService.playTap();
    setSelectedOption(null);
    setShowExplanation(false);
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(i => i + 1);
    } else {
      setQuizIndex(0); // Restart
    }
  };

  // --- 5. Drawing Canvas State ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawColor, setDrawColor] = useState<string>('#15803d');
  const [brushSize, setBrushSize] = useState<number>(8);
  const [canvasSavedNotice, setCanvasSavedNotice] = useState<string>('');

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = drawColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    soundService.playTap();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveCanvas = () => {
    soundService.playSuccess();
    setCanvasSavedNotice(t.activitiesScreen.drawingCanvas.savedSuccess);
    setTimeout(() => setCanvasSavedNotice(''), 3000);
    confetti({ particleCount: 25 });
  };

  // --- 6. Short Stories & TTS ---
  const [storyIndex, setStoryIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const currentStory = SHORT_STORIES[storyIndex];

  const handleToggleStoryTts = () => {
    if (isPlayingAudio) {
      speechService.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      const textToRead = language === 'ur' ? currentStory.textUr : currentStory.textEn;
      speechService.speak(textToRead, language);
      setIsPlayingAudio(true);
    }
  };

  // --- 7. Music Melodies Game ---
  const [musicLevel, setMusicLevel] = useState<number>(1);
  const [musicCheer, setMusicCheer] = useState<string>('');

  const playChimeNote = (noteFreq: number) => {
    soundService.playTap();
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  };

  // --- 8. Virtual Garden Simulator ---
  const [gardenWater, setGardenWater] = useState<number>(3);
  const [gardenSun, setGardenSun] = useState<number>(3);
  const [gardenBloom, setGardenBloom] = useState<boolean>(true);

  const handleWaterGarden = () => {
    soundService.playTap();
    setGardenWater(w => w + 1);
    setGardenBloom(true);
    confetti({ particleCount: 15, colors: ['#38bdf8', '#0284c7'] });
  };

  const handleSunGarden = () => {
    soundService.playTap();
    setGardenSun(s => s + 1);
    setGardenBloom(true);
    confetti({ particleCount: 15, colors: ['#facc15', '#f59e0b'] });
  };

  // --- 9. Knitting & Hobby Streaks (Special Feature) ---
  const [hobby, setHobby] = useState<HobbyProject>(() => dataService.getHobbyProject());
  const [hobbyNote, setHobbyNote] = useState<string>('');
  const [streakSuccess, setStreakSuccess] = useState<string>('');

  const handleMarkHobbyProgress = () => {
    soundService.playSuccess();
    const updated = dataService.logHobbyProgressToday(hobbyNote);
    setHobby(updated);
    setHobbyNote('');
    setStreakSuccess(t.activitiesScreen.knittingProject.positiveCheer);
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const activityNavButtons = [
    { id: 'knitting', label: language === 'ur' ? '🧶 بنائی کا سلسلہ' : '🧶 Knitting Streak', icon: '🧶' },
    { id: 'memory', label: language === 'ur' ? '🃏 یادداشت کا کھیل' : '🃏 Memory Game', icon: '🃏' },
    { id: 'puzzle', label: language === 'ur' ? '🧩 تصویری پہیلی' : '🧩 Picture Puzzle', icon: '🧩' },
    { id: 'chess', label: language === 'ur' ? '♟️ آسان شطرنج' : '♟️ Gentle Chess', icon: '♟️' },
    { id: 'quiz', label: language === 'ur' ? '💡 روزانہ کوئز' : '💡 Daily Quiz', icon: '💡' },
    { id: 'drawing', label: language === 'ur' ? '🎨 رنگ و تصویر' : '🎨 Coloring & Art', icon: '🎨' },
    { id: 'stories', label: language === 'ur' ? '📖 پیاری کہانیاں' : '📖 Short Stories', icon: '📖' },
    { id: 'music', label: language === 'ur' ? '🎵 موسیقی کی دھنیں' : '🎵 Music Chimes', icon: '🎵' },
    { id: 'garden', label: language === 'ur' ? '🌱 مجازی باغیچہ' : '🌱 Virtual Garden', icon: '🌱' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 animate-fade-in pb-24">
      
      {/* 1. Header */}
      <div className="pb-2 border-b-2 border-slate-200">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
          {t.activitiesScreen.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium">
          {t.activitiesScreen.subtitle}
        </p>
      </div>

      {/* 2. Activity Horizontal Selector Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {activityNavButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => {
              soundService.playTap();
              setActiveSection(btn.id);
            }}
            className={`min-h-touch px-4 py-2.5 rounded-2xl border-2 font-bold text-base sm:text-lg shrink-0 transition-all ${
              activeSection === btn.id
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: KNITTING & HOBBY STREAKS (SPECIAL SENIOR FEATURE) */}
      {/* ============================================================ */}
      {activeSection === 'knitting' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-400 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-200 pb-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <span className="text-6xl p-3 bg-amber-50 rounded-3xl border-2 border-amber-300">
                🧶
              </span>
              <div>
                <span className="text-xs sm:text-sm font-bold text-amber-800 uppercase tracking-wider block">
                  {t.activitiesScreen.knittingProject.title}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                  {language === 'ur' ? hobby.titleUrdu : hobby.title}
                </h2>
                <p className="text-base sm:text-lg text-slate-600 mt-1">
                  {language === 'ur' ? hobby.descriptionUrdu : hobby.description}
                </p>
              </div>
            </div>

            {/* Streak Counter Badge */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-3xl p-5 text-center shadow-lg shrink-0 min-w-[170px]">
              <span className="text-3xl block">🔥</span>
              <span className="text-3xl sm:text-4xl font-black block">
                {hobby.currentStreak}
              </span>
              <span className="text-sm font-extrabold uppercase tracking-wide">
                {t.homeScreen.dayStreak}
              </span>
            </div>
          </div>

          {/* Positive Encouragement Banner */}
          <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 flex items-center gap-3 text-emerald-900 font-bold text-lg">
            <Heart className="w-8 h-8 text-emerald-600 fill-emerald-500 shrink-0" />
            <p>{t.activitiesScreen.knittingProject.positiveCheer}</p>
          </div>

          {/* Mark Today's Progress Form */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
            <label className="block text-lg font-bold text-slate-800">
              {t.activitiesScreen.knittingProject.markProgressToday}:
            </label>
            <input
              type="text"
              value={hobbyNote}
              onChange={(e) => setHobbyNote(e.target.value)}
              placeholder={t.activitiesScreen.knittingProject.addNotePlaceholder}
              className="w-full min-h-touch px-4 py-3 rounded-xl border-2 border-slate-300 text-lg focus:border-emerald-600 focus:outline-none"
            />
            <button
              onClick={handleMarkHobbyProgress}
              className="w-full min-h-touch py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xl rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              {t.activitiesScreen.knittingProject.markProgressToday} ✨
            </button>
          </div>

          {/* Recent Journal History */}
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-3">
              {t.activitiesScreen.knittingProject.progressHistory}
            </h3>
            <div className="space-y-2">
              {hobby.progressNotes.map((pn, i) => (
                <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-base text-slate-800 font-medium">{pn.note}</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                    {pn.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: MEMORY GAME                                       */}
      {/* ============================================================ */}
      {activeSection === 'memory' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-emerald-500 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t.activitiesScreen.memoryGame.title}
              </h2>
              <p className="text-slate-600 text-base">
                {t.activitiesScreen.memoryGame.desc}
              </p>
            </div>
            <button
              onClick={resetMemoryGame}
              className="min-h-touch px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{t.activitiesScreen.memoryGame.restart}</span>
            </button>
          </div>

          <div className="flex items-center gap-6 text-lg font-bold text-slate-800">
            <span>{t.activitiesScreen.memoryGame.moves} {memoryMoves}</span>
            <span>{t.activitiesScreen.memoryGame.matched} {matchedPairs.length} / {initialCards.length}</span>
          </div>

          {matchedPairs.length === initialCards.length && (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-600 rounded-2xl text-emerald-950 font-black text-xl text-center">
              🎉 {t.activitiesScreen.memoryGame.wellDone}
            </div>
          )}

          {/* 3x4 Card Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
            {memoryCards.map((card, idx) => {
              const isFlipped = flippedIndices.includes(idx) || matchedPairs.includes(card);
              return (
                <button
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  className={`h-24 sm:h-28 rounded-2xl text-4xl sm:text-5xl flex items-center justify-center transition-all duration-300 shadow-md border-3 active:scale-95 ${
                    isFlipped
                      ? 'bg-emerald-50 border-emerald-500 shadow-inner'
                      : 'bg-emerald-700 border-emerald-800 text-transparent hover:bg-emerald-800'
                  }`}
                  aria-label={`Card ${idx + 1}`}
                >
                  {isFlipped ? card : '❓'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 3: VISUAL TILE PUZZLE                                */}
      {/* ============================================================ */}
      {activeSection === 'puzzle' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-blue-500 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t.activitiesScreen.puzzleGame.title}
              </h2>
              <p className="text-slate-600 text-base">
                {t.activitiesScreen.puzzleGame.solveNotice}
              </p>
            </div>
            <span className="text-lg font-bold text-slate-700">
              {t.activitiesScreen.puzzleGame.moves} {puzzleMoves}
            </span>
          </div>

          {isPuzzleSolved && (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-600 rounded-2xl text-emerald-950 font-black text-xl text-center">
              🌟 {t.activitiesScreen.puzzleGame.solved}
            </div>
          )}

          {/* 3x3 Puzzle Board */}
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto p-4 bg-slate-100 rounded-3xl border-4 border-slate-300">
            {puzzleTiles.map((val, idx) => (
              <button
                key={idx}
                onClick={() => handleTileClick(idx)}
                disabled={val === 0}
                className={`h-24 rounded-2xl text-3xl font-black flex items-center justify-center transition-all ${
                  val === 0
                    ? 'bg-slate-200/50 border-2 border-dashed border-slate-300'
                    : 'bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95 border-2 border-blue-400'
                }`}
              >
                {val !== 0 ? val : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 4: GENTLE CHESS BOARD                                */}
      {/* ============================================================ */}
      {activeSection === 'chess' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-indigo-500 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t.activitiesScreen.chessGame.title}
              </h2>
              <p className="text-slate-600 text-base">
                {t.activitiesScreen.chessGame.friendlyAdvice}
              </p>
            </div>
            <span className="bg-indigo-100 text-indigo-900 font-bold px-3 py-1 rounded-xl text-sm">
              {t.activitiesScreen.chessGame.turn}
            </span>
          </div>

          {/* Simple Interactive 8x8 Chess Demonstration Board */}
          <div className="max-w-md mx-auto aspect-square grid grid-cols-8 border-4 border-amber-900 rounded-2xl overflow-hidden shadow-2xl">
            {Array.from({ length: 64 }).map((_, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const isDark = (row + col) % 2 === 1;

              // Simple starting pieces symbol map
              let piece = '';
              if (row === 0) piece = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'][col];
              else if (row === 1) piece = '♟';
              else if (row === 6) piece = '♙';
              else if (row === 7) piece = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'][col];

              const isSelected = selectedChessSquare === `${row}-${col}`;

              return (
                <button
                  key={i}
                  onClick={() => {
                    soundService.playTap();
                    setSelectedChessSquare(`${row}-${col}`);
                  }}
                  className={`w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-serif transition-colors ${
                    isSelected
                      ? 'bg-amber-300 ring-4 ring-amber-500'
                      : isDark
                      ? 'bg-amber-800 text-amber-100'
                      : 'bg-amber-100 text-amber-950'
                  }`}
                >
                  {piece}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 5: DAILY FUN QUIZ                                    */}
      {/* ============================================================ */}
      {activeSection === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-teal-500 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t.activitiesScreen.dailyQuiz.title}
              </h2>
              <p className="text-slate-600 text-base">
                {t.activitiesScreen.dailyQuiz.desc}
              </p>
            </div>
            <span className="text-lg font-black text-teal-900 bg-teal-100 px-3 py-1 rounded-xl">
              {t.activitiesScreen.dailyQuiz.score} {quizScore}
            </span>
          </div>

          <div className="bg-teal-50 rounded-2xl p-5 border border-teal-200">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wide">
              {t.activitiesScreen.dailyQuiz.question} {quizIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {language === 'ur' ? currentQuestion.questionUr : currentQuestion.questionEn}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(language === 'ur' ? currentQuestion.optionsUr : currentQuestion.optionsEn).map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(i)}
                className={`min-h-touch p-4 rounded-2xl border-3 text-left font-bold text-xl transition-all ${
                  selectedOption === i
                    ? i === currentQuestion.correctIndex
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                      : 'bg-red-500 text-white border-red-600'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <span>{opt}</span>
              </button>
            ))}
          </div>

          {/* Feedback & Next Button */}
          {showExplanation && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 space-y-3 animate-fade-in">
              <p className="text-lg font-extrabold text-emerald-950">
                {selectedOption === currentQuestion.correctIndex
                  ? t.activitiesScreen.dailyQuiz.correct
                  : t.activitiesScreen.dailyQuiz.incorrect + ' ' + (language === 'ur' ? currentQuestion.optionsUr[currentQuestion.correctIndex] : currentQuestion.optionsEn[currentQuestion.correctIndex])}
              </p>
              <p className="text-base text-slate-700">
                {language === 'ur' ? currentQuestion.explanationUr : currentQuestion.explanationEn}
              </p>
              <button
                onClick={handleNextQuizQuestion}
                className="min-h-touch px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-lg rounded-xl shadow-md active:scale-95"
              >
                {t.activitiesScreen.dailyQuiz.nextQuestion}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 6: COLORING & DRAWING CANVAS                         */}
      {/* ============================================================ */}
      {activeSection === 'drawing' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-purple-500 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t.activitiesScreen.drawingCanvas.title}
              </h2>
              <p className="text-slate-600 text-base">
                {t.activitiesScreen.drawingCanvas.desc}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearCanvas}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
              >
                {t.activitiesScreen.drawingCanvas.clear}
              </button>
              <button
                onClick={saveCanvas}
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md"
              >
                {t.activitiesScreen.drawingCanvas.save}
              </button>
            </div>
          </div>

          {canvasSavedNotice && (
            <div className="p-3 bg-emerald-100 border border-emerald-400 rounded-xl text-emerald-900 font-bold text-center">
              {canvasSavedNotice}
            </div>
          )}

          {/* Palette Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 rounded-2xl border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700">{t.activitiesScreen.drawingCanvas.color}</span>
              {['#15803d', '#1e40af', '#dc2626', '#b45309', '#7e22ce', '#000000'].map((c) => (
                <button
                  key={c}
                  onClick={() => setDrawColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-9 h-9 rounded-full border-2 transition-transform ${
                    drawColor === c ? 'scale-125 ring-2 ring-slate-400' : ''
                  }`}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-700">{t.activitiesScreen.drawingCanvas.brushSize}</span>
              {[4, 8, 14, 20].map((s) => (
                <button
                  key={s}
                  onClick={() => setBrushSize(s)}
                  className={`w-8 h-8 rounded-full bg-slate-200 font-bold text-xs flex items-center justify-center ${
                    brushSize === s ? 'bg-purple-700 text-white ring-2 ring-purple-400' : ''
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Box */}
          <div className="border-4 border-slate-300 rounded-2xl overflow-hidden bg-white shadow-inner">
            <canvas
              ref={canvasRef}
              width={650}
              height={360}
              onMouseDown={startDraw}
              onMouseMove={drawMove}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={drawMove}
              onTouchEnd={stopDraw}
              className="w-full h-80 touch-none cursor-crosshair"
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 7: SHORT STORIES WITH AUDIO (TTS)                    */}
      {/* ============================================================ */}
      {activeSection === 'stories' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-500 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t.activitiesScreen.shortStories.title}
              </h2>
              <p className="text-slate-600 text-base">
                {t.activitiesScreen.shortStories.desc}
              </p>
            </div>

            <button
              onClick={handleToggleStoryTts}
              className={`min-h-touch px-6 py-3 rounded-2xl font-extrabold text-lg flex items-center gap-2 shadow-md active:scale-95 ${
                isPlayingAudio
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              <span>{isPlayingAudio ? t.activitiesScreen.shortStories.stopReading : t.activitiesScreen.shortStories.readAloud}</span>
            </button>
          </div>

          {/* Story Card */}
          <div className="bg-amber-50/60 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 space-y-4 font-serif">
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950">
              {language === 'ur' ? currentStory.titleUr : currentStory.titleEn}
            </h3>
            <p className="text-xl sm:text-2xl text-slate-800 leading-relaxed whitespace-pre-line">
              {language === 'ur' ? currentStory.textUr : currentStory.textEn}
            </p>
          </div>

          {/* Switch Story */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => {
                soundService.playTap();
                speechService.stopSpeaking();
                setIsPlayingAudio(false);
                setStoryIndex(i => (i === 0 ? SHORT_STORIES.length - 1 : i - 1));
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold"
            >
              {t.previous}
            </button>
            <span className="text-sm font-bold text-slate-500">
              {storyIndex + 1} / {SHORT_STORIES.length}
            </span>
            <button
              onClick={() => {
                soundService.playTap();
                speechService.stopSpeaking();
                setIsPlayingAudio(false);
                setStoryIndex(i => (i === SHORT_STORIES.length - 1 ? 0 : i + 1));
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold"
            >
              {t.next}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 8: MUSIC MELODIES                                    */}
      {/* ============================================================ */}
      {activeSection === 'music' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-rose-500 shadow-xl space-y-6 text-center">
          <div className="pb-3 border-b border-slate-200">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t.activitiesScreen.musicMemory.title}
            </h2>
            <p className="text-slate-600 text-base mt-1">
              {t.activitiesScreen.musicMemory.desc}
            </p>
          </div>

          {/* Chime Bells */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto py-4">
            {[
              { note: 'C', freq: 523.25, color: 'bg-rose-500', name: 'Bell 1' },
              { note: 'E', freq: 659.25, color: 'bg-amber-500', name: 'Bell 2' },
              { note: 'G', freq: 783.99, color: 'bg-emerald-500', name: 'Bell 3' },
              { note: 'C6', freq: 1046.50, color: 'bg-blue-500', name: 'Bell 4' },
            ].map((bell) => (
              <button
                key={bell.note}
                onClick={() => playChimeNote(bell.freq)}
                className={`h-32 rounded-3xl text-white font-extrabold text-2xl flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform ${bell.color}`}
              >
                <Music className="w-8 h-8 mb-2" />
                <span>{bell.note}</span>
              </button>
            ))}
          </div>

          <p className="text-emerald-800 font-bold text-lg">
            🎶 {t.activitiesScreen.musicMemory.cheer}
          </p>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 9: VIRTUAL GARDEN                                    */}
      {/* ============================================================ */}
      {activeSection === 'garden' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-emerald-600 shadow-xl space-y-6 text-center">
          <div className="pb-3 border-b border-slate-200">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t.activitiesScreen.gardenGame.title}
            </h2>
            <p className="text-slate-600 text-base mt-1">
              {t.activitiesScreen.gardenGame.desc}
            </p>
          </div>

          {/* Plant Visual */}
          <div className="py-8 flex flex-col items-center">
            <div className="text-8xl sm:text-9xl animate-bounce">
              {gardenBloom ? '🌸' : '🌱'}
            </div>
            <p className="text-2xl font-black text-emerald-900 mt-4">
              {t.activitiesScreen.gardenGame.statusBlooming}
            </p>
            <span className="inline-block mt-2 bg-emerald-100 text-emerald-800 font-bold px-4 py-1 rounded-full text-base">
              {t.activitiesScreen.gardenGame.plantedStreak}
            </span>
          </div>

          {/* Care Actions: Water & Sun */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleWaterGarden}
              className="min-h-touch px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center gap-2"
            >
              <Droplet className="w-6 h-6 fill-current" />
              <span>{t.activitiesScreen.gardenGame.waterPlant}</span>
            </button>
            <button
              onClick={handleSunGarden}
              className="min-h-touch px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xl rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center gap-2"
            >
              <Sun className="w-6 h-6 fill-current" />
              <span>{t.activitiesScreen.gardenGame.giveSun}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
