import React, { useState, useEffect } from 'react';
import { InteractiveClock } from './InteractiveClock';
import { generateRandomQuiz, QuizQuestion, getTimeExpression } from '../utils/timeLogic';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
  Trophy,
  ArrowRight,
  Headphones,
  Eye,
  RotateCcw,
} from 'lucide-react';

export const QuizGameMode: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [isListeningMode, setIsListeningMode] = useState<boolean>(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);

  // Generate new quiz question
  const loadNextQuestion = () => {
    const q = generateRandomQuiz(difficulty);
    setCurrentQuiz(q);
    setSelectedAnswer(null);
    setIsAnswered(false);

    // Auto-read in listening mode
    if (isListeningMode) {
      setTimeout(() => {
        soundEngine.speak(q.audioText);
      }, 300);
    }
  };

  useEffect(() => {
    loadNextQuestion();
  }, [difficulty, isListeningMode]);

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQuiz) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    setTotalAnswered((prev) => prev + 1);

    const isCorrect = option === currentQuiz.correctAnswer;
    if (isCorrect) {
      soundEngine.playCorrectSound();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setScore((prev) => prev + 10 + newStreak * 2);

      // Trigger confetti on 3, 5, 10 streak
      if (newStreak % 3 === 0) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } else {
      soundEngine.playWrongSound();
      setStreak(0);
    }
  };

  const handlePlayAudio = () => {
    if (!currentQuiz) return;
    soundEngine.speak(currentQuiz.audioText);
  };

  if (!currentQuiz) return null;

  const isCurrentCorrect = selectedAnswer === currentQuiz.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Top Game Status & Mode Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Difficulty Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => {
              setDifficulty('beginner');
              setStreak(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              difficulty === 'beginner'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            基础 (整点/半点)
          </button>
          <button
            onClick={() => {
              setDifficulty('intermediate');
              setStreak(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              difficulty === 'intermediate'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            进阶 (一刻钟/差一刻)
          </button>
          <button
            onClick={() => {
              setDifficulty('advanced');
              setStreak(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              difficulty === 'advanced'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            大师 (任意 past/to)
          </button>
        </div>

        {/* Listening Mode Toggle */}
        <button
          onClick={() => {
            setIsListeningMode(!isListeningMode);
            setStreak(0);
          }}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 border transition-all ${
            isListeningMode
              ? 'bg-purple-50 text-purple-700 border-purple-300'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {isListeningMode ? <Headphones className="w-4 h-4 text-purple-600" /> : <Eye className="w-4 h-4 text-slate-400" />}
          <span>{isListeningMode ? '中考听力盲测模式 (已开启)' : '开启听力盲测模式'}</span>
        </button>

        {/* Score & Streak Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5 text-amber-600 font-bold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span>连胜: {streak}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-800 font-bold">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>得分: {score}</span>
          </div>
        </div>
      </div>

      {/* Main Quiz Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Clock Question Visual (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center justify-center relative">
          <div className="w-full text-center mb-3">
            <span className="text-xs font-bold text-slate-400 tracking-wider">QUESTION CLOCK</span>
            <h3 className="text-sm font-bold text-slate-800 mt-0.5">
              {isListeningMode ? '听对话音频，选出对应的时间表达：' : '看钟表，选出正确的英语表达：'}
            </h3>
          </div>

          {/* Clock Display or Listening Mask */}
          {isListeningMode && !isAnswered ? (
            <div className="w-64 h-64 rounded-full bg-purple-50 border-2 border-dashed border-purple-200 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <Headphones className="w-12 h-12 text-purple-500 animate-pulse" />
              <p className="text-xs font-semibold text-purple-900">
                听力模式中：钟面已遮盖
              </p>
              <button
                onClick={handlePlayAudio}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                重新播放听力音频
              </button>
            </div>
          ) : (
            <div className="py-2">
              <InteractiveClock
                hour={currentQuiz.hour}
                minute={currentQuiz.minute}
                interactive={false}
                showHelpers={false}
                size={270}
              />
            </div>
          )}

          {/* Audio Button for Question */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handlePlayAudio}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>播放标准读音 (Listen to Question)</span>
            </button>
          </div>
        </div>

        {/* Right: Options & Feedback (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold text-blue-600">
                — What time is it?
              </span>
              <span className="text-xs text-slate-400">
                第 {totalAnswered + 1} 题
              </span>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuiz.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuiz.correctAnswer;

                let btnStyle = 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 bg-white text-slate-800';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                  } else {
                    btnStyle = 'border-slate-200 bg-slate-50/50 text-slate-400';
                  }
                }

                return (
                  <button
                    key={option}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-base font-semibold">{option}</span>
                    </div>

                    {isAnswered && (
                      <div>
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
              <div
                className={`p-4 rounded-xl border ${
                  isCurrentCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {isCurrentCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <p className="font-bold text-sm">
                    {isCurrentCorrect ? '回答正确！Well done!' : '遗憾答错了，继续加油！'}
                  </p>
                </div>
                <p className="text-xs leading-relaxed mt-1">
                  <strong>考点讲解：</strong> {currentQuiz.explanation}
                </p>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={loadNextQuestion}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <span>下一题 (Next Question)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
