import React, { useState, useEffect } from 'react';
import { InteractiveClock } from './InteractiveClock';
import { getTimeExpression, TimeExpression } from '../utils/timeLogic';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Volume2,
  CheckCircle2,
  HelpCircle,
  Trophy,
  ArrowRight,
  RotateCcw,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface ChallengeTarget {
  targetHour: number;
  targetMinute: number;
  expression: TimeExpression;
}

export const SetClockGameMode: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [target, setTarget] = useState<ChallengeTarget | null>(null);
  
  // Student's clock current hands position (starts at 12:00 or random)
  const [clockHour, setClockHour] = useState<number>(12);
  const [clockMinute, setClockMinute] = useState<number>(0);

  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [feedbackHint, setFeedbackHint] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  // Generate target
  const generateNewChallenge = () => {
    let h = Math.floor(Math.random() * 12) + 1;
    let m = 0;

    if (difficulty === 'beginner') {
      m = Math.random() < 0.5 ? 0 : 30;
    } else if (difficulty === 'intermediate') {
      const presets = [0, 15, 30, 45];
      m = presets[Math.floor(Math.random() * presets.length)];
    } else {
      const common = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
      m = common[Math.floor(Math.random() * common.length)];
    }

    const exp = getTimeExpression(h, m);
    setTarget({ targetHour: h, targetMinute: m, expression: exp });
    
    // Reset clock hands to random other time
    let initH = Math.floor(Math.random() * 12) + 1;
    if (initH === h) initH = h === 12 ? 1 : h + 1;
    setClockHour(initH);
    setClockMinute(0);

    setHasSubmitted(false);
    setIsCorrect(false);
    setFeedbackHint('');

    // Play voice prompt
    setTimeout(() => {
      soundEngine.speak(`Can you set the clock to: ${exp.traditionalSentence}`);
    }, 200);
  };

  useEffect(() => {
    generateNewChallenge();
  }, [difficulty]);

  const handlePlayPrompt = () => {
    if (!target) return;
    soundEngine.speak(target.expression.traditionalSentence);
  };

  const handleCheck = () => {
    if (!target || hasSubmitted) return;

    const hourMatch = clockHour === target.targetHour;
    const minMatch = clockMinute === target.targetMinute;

    if (hourMatch && minMatch) {
      soundEngine.playCorrectSound();
      setIsCorrect(true);
      setHasSubmitted(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore((prev) => prev + 15 + newStreak * 3);
      setFeedbackHint('太棒了！指针拨动完全正确！');

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      soundEngine.playWrongSound();
      setIsCorrect(false);
      setHasSubmitted(true);
      setStreak(0);

      // Construct helpful educational hints
      let hint = '';
      if (!hourMatch && minMatch) {
        hint = `分针位置正确（${clockMinute} 分），但时针应该在 ${target.targetHour} 点，当前在 ${clockHour} 点。`;
      } else if (hourMatch && !minMatch) {
        hint = `时针位置正确（${clockHour} 点），但分针目前在 ${clockMinute} 分，应该拨到 ${target.targetMinute} 分。`;
      } else {
        hint = `目前时间是 ${clockHour}:${clockMinute < 10 ? '0' + clockMinute : clockMinute}，目标是 ${target.targetHour}:${target.targetMinute < 10 ? '0' + target.targetMinute : target.targetMinute}。`;
      }

      if (target.expression.zone === 'QUARTER_TO' || target.expression.zone === 'TO') {
        hint += ` 提示：${target.expression.traditional} 是"差几分到几点"，比如 to ${target.expression.nextHour12} 说明还差一点才到 ${target.expression.nextHour12} 点，实际时针是在 ${target.targetHour} 点哦！`;
      }

      setFeedbackHint(hint);
    }
  };

  if (!target) return null;

  return (
    <div className="space-y-6">
      {/* Top Bar Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setDifficulty('beginner')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              difficulty === 'beginner' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            基础 (整点/半点)
          </button>
          <button
            onClick={() => setDifficulty('intermediate')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              difficulty === 'intermediate' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            进阶 (一刻钟/差一刻)
          </button>
          <button
            onClick={() => setDifficulty('advanced')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              difficulty === 'advanced' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            大师 (任意 past/to)
          </button>
        </div>

        <div className="flex items-center gap-6 text-sm font-bold">
          <div className="text-amber-600">连胜: {streak}</div>
          <div className="text-slate-800 flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>得分: {score}</span>
          </div>
        </div>
      </div>

      {/* Main Challenge Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Task Prompt Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 tracking-wider">MISSION PROMPT</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              请根据英语语音或文字，拨动时针和分针！
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              在右侧钟面上拖动指针或点击表盘，设定到指定时间。
            </p>

            {/* Target Card */}
            <div className="mt-5 p-5 bg-blue-50/80 rounded-2xl border border-blue-100 text-center space-y-3">
              <span className="text-xs font-bold text-blue-700">🎯 目标时间 (Target Time)</span>
              <p className="text-2xl font-black text-blue-900">
                "{target.expression.traditionalSentence}"
              </p>
              <button
                onClick={handlePlayPrompt}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                <span>点我听英语朗读 (Listen)</span>
              </button>
            </div>

            {/* Rule Hint */}
            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">💡 提示：</p>
              <p>{target.expression.zoneExplanation}</p>
            </div>
          </div>

          {/* Feedback & Actions */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            {hasSubmitted ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                    )}
                    <span className="font-bold text-sm">
                      {isCorrect ? '恭喜！挑战成功！' : '再仔细看一下哦！'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">{feedbackHint}</p>
                </div>

                <div className="flex items-center gap-3">
                  {!isCorrect && (
                    <button
                      onClick={() => setHasSubmitted(false)}
                      className="flex-1 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      修改指针重试
                    </button>
                  )}
                  <button
                    onClick={generateNewChallenge}
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>下一关 (Next Mission)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleCheck}
                className="w-full py-3 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-colors"
              >
                提交检查 (Check My Clock)
              </button>
            )}
          </div>
        </div>

        {/* Right: Interactive Clock Workspace (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-400">你当前设定的钟表时间</span>
            <div className="text-2xl font-black font-mono text-slate-800">
              {clockHour < 10 ? `0${clockHour}` : clockHour}:
              {clockMinute < 10 ? `0${clockMinute}` : clockMinute}
            </div>
          </div>

          <div className="py-2">
            <InteractiveClock
              hour={clockHour}
              minute={clockMinute}
              onChangeTime={(h, m) => {
                if (!hasSubmitted) {
                  setClockHour(h);
                  setClockMinute(m);
                }
              }}
              interactive={!hasSubmitted}
              showHelpers={true}
              size={320}
            />
          </div>

          {/* Quick Step Buttons for students who prefer fine-tuning */}
          {!hasSubmitted && (
            <div className="w-full mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <button
                onClick={() => {
                  let nextH = clockHour === 1 ? 12 : clockHour - 1;
                  setClockHour(nextH);
                  soundEngine.playTick();
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
              >
                -1时
              </button>
              <button
                onClick={() => {
                  let nextH = clockHour === 12 ? 1 : clockHour + 1;
                  setClockHour(nextH);
                  soundEngine.playTick();
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
              >
                +1时
              </button>
              <div className="h-4 w-px bg-slate-300 mx-1" />
              <button
                onClick={() => {
                  const newM = (clockMinute - 5 + 60) % 60;
                  setClockMinute(newM);
                  soundEngine.playTick();
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
              >
                -5分
              </button>
              <button
                onClick={() => {
                  const newM = (clockMinute + 5) % 60;
                  setClockMinute(newM);
                  soundEngine.playTick();
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
              >
                +5分
              </button>
              <button
                onClick={() => {
                  const newM = (clockMinute + 15) % 60;
                  setClockMinute(newM);
                  soundEngine.playTick();
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
              >
                +15分
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
