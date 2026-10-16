/**
 * Time Master: Junior High English Clock & Time Game
 * A comprehensive, delightful learning platform for middle school English teachers and students.
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { SoundSettingsModal } from './components/SoundSettingsModal';
import { ExploreMode } from './components/ExploreMode';
import { QuizGameMode } from './components/QuizGameMode';
import { SetClockGameMode } from './components/SetClockGameMode';
import { DailyRoutineMode } from './components/DailyRoutineMode';
import { GrammarRulesMode } from './components/GrammarRulesMode';
import { soundEngine } from './utils/audio';
import {
  Clock,
  Music,
  Volume2,
  Sparkles,
  Trophy,
  BookOpen,
  ArrowRight,
  Headphones,
  CheckCircle2,
} from 'lucide-react';

// Path to the high-fidelity generated classroom image
const HERO_IMAGE_PATH = '/src/assets/images/hero_clock_learning_1792124513066.jpg';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('explore');
  const [isSoundModalOpen, setIsSoundModalOpen] = useState<boolean>(false);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  // Initialize audio and voice engine on mount
  useEffect(() => {
    soundEngine.initVoices();
  }, []);

  const handleToggleBgm = () => {
    const playing = soundEngine.toggleBgm();
    setIsBgmPlaying(playing);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Bar adhering to the Top Bar Contract */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSoundModal={() => setIsSoundModalOpen(true)}
        isBgmPlaying={isBgmPlaying}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Hero Section */}
        <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column: Hero Editorial Brief (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                {/* Clean unboxed metadata per Anti-Slop / Zero-Pill discipline */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
                  <span>中学英语核心语法</span>
                  <span aria-hidden="true">·</span>
                  <span>What time is it?</span>
                  <span aria-hidden="true">·</span>
                  <span>Past & To 体系</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
                  轻松玩转英语时间：钟表、发音与趣味闯关
                </h1>

                <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                  专为初中英语备课与课堂互动设计。告别机械背诵，在生动的钟表拨针、标准语音朗读、轻松的背景音乐和听力测试中，彻底攻克{' '}
                  <strong className="text-blue-600 font-semibold">o'clock</strong>、
                  <strong className="text-emerald-600 font-semibold">past</strong>、
                  <strong className="text-orange-600 font-semibold">to</strong> 以及{' '}
                  <strong className="text-purple-600 font-semibold">quarter / half</strong> 中考考点！
                </p>
              </div>

              {/* Action Buttons & BGM Quick Start */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setCurrentTab('quiz')}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  <span>立即开始闯关挑战</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleToggleBgm}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl border transition-colors flex items-center gap-2 ${
                    isBgmPlaying
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Music className={`w-4 h-4 ${isBgmPlaying ? 'animate-bounce text-emerald-600' : 'text-slate-400'}`} />
                  <span>{isBgmPlaying ? '暂停轻松音乐 (BGM On)' : '开启背景音乐 (Relaxing BGM)'}</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.speak("What time is it? It's a quarter past eight. Time for English class!");
                  }}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>朗读示范音</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset (5 cols) */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-slate-100 border-t lg:border-t-0 lg:border-l border-slate-200 flex items-center justify-center overflow-hidden">
              {!imageError ? (
                <img
                  src={HERO_IMAGE_PATH}
                  alt="Students learning English clock and time in classroom"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Styled fallback container satisfying Zero-Broken-Image Policy */
                <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-50 to-indigo-100">
                  <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600 mb-3">
                    <Clock className="w-10 h-10" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">Time Master Classroom</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Mastering English Time with interactive clocks & natural voice
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Dynamic Mode Content */}
        {currentTab === 'explore' && <ExploreMode onGoToQuiz={() => setCurrentTab('quiz')} />}
        {currentTab === 'quiz' && <QuizGameMode />}
        {currentTab === 'set_clock' && <SetClockGameMode />}
        {currentTab === 'daily' && <DailyRoutineMode />}
        {currentTab === 'grammar' && <GrammarRulesMode />}
      </main>

      {/* Audio and Voice Settings Modal */}
      <SoundSettingsModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        isBgmPlaying={isBgmPlaying}
        setIsBgmPlaying={setIsBgmPlaying}
      />

      {/* Editorial Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Time Master</span>
            <span>· 中学英语时钟与时间表达备课游戏助手</span>
          </div>

          <div className="flex items-center gap-6">
            <span>涵盖: What time is it? / o'clock / past / to / half / quarter</span>
            <span>Web Audio 纯净无损合成 · 纯正语音朗读</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
