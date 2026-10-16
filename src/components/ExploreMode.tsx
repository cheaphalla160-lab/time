import React, { useState } from 'react';
import { InteractiveClock } from './InteractiveClock';
import { getTimeExpression, TimeExpression } from '../utils/timeLogic';
import { soundEngine } from '../utils/audio';
import {
  Volume2,
  Sparkles,
  Eye,
  EyeOff,
  RotateCcw,
  Plus,
  Minus,
  HelpCircle,
  Clock,
  BookOpen,
} from 'lucide-react';

interface ExploreModeProps {
  onGoToQuiz?: () => void;
}

export const ExploreMode: React.FC<ExploreModeProps> = ({ onGoToQuiz }) => {
  const [hour, setHour] = useState<number>(7);
  const [minute, setMinute] = useState<number>(15);
  const [showHelpers, setShowHelpers] = useState<boolean>(true);
  const [hideAnswerForClass, setHideAnswerForClass] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const timeExp: TimeExpression = getTimeExpression(hour, minute);

  const handleTimeChange = (newH: number, newM: number) => {
    setHour(newH);
    setMinute(newM);
  };

  const handleAdjustMinute = (delta: number) => {
    let totalMinutes = hour * 60 + minute + delta;
    if (totalMinutes < 0) totalMinutes += 12 * 60;
    const rawH = Math.floor(totalMinutes / 60) % 12;
    const finalH = rawH === 0 ? 12 : rawH;
    const finalM = totalMinutes % 60;
    setHour(finalH);
    setMinute(finalM);
    soundEngine.playTick();
  };

  const handleAdjustHour = (delta: number) => {
    let nextH = (hour + delta) % 12;
    if (nextH <= 0) nextH += 12;
    setHour(nextH);
    soundEngine.playTick();
  };

  const handleRandomTime = () => {
    const randomH = Math.floor(Math.random() * 12) + 1;
    const commonMinutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const randomM = commonMinutes[Math.floor(Math.random() * commonMinutes.length)];
    setHour(randomH);
    setMinute(randomM);
    soundEngine.playTick();
  };

  const handleReadAloud = (textToRead?: string) => {
    const text = textToRead || `What time is it? ${timeExp.traditionalSentence}`;
    setIsSpeaking(true);
    soundEngine.speak(text, {
      onEnd: () => setIsSpeaking(false),
    });
  };

  const PRESET_TIMES = [
    { label: "7:00 整点 o'clock", h: 7, m: 0 },
    { label: '7:15 一刻钟 quarter past', h: 7, m: 15 },
    { label: '7:30 半点 half past', h: 7, m: 30 },
    { label: '7:45 差一刻 quarter to', h: 7, m: 45 },
    { label: '8:10 过了10分 ten past', h: 8, m: 10 },
    { label: '8:40 差20分 twenty to', h: 8, m: 40 },
    { label: '9:55 差5分 five to', h: 9, m: 55 },
    { label: '12:00 正午 noon', h: 12, m: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Teacher Presentation Banner / Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              探究钟表教学台 (Interactive Time Stage)
            </h2>
            <p className="text-xs text-slate-500">
              拖动指针或点击表盘，实时生成纯正英语时间发音与中考考点解析
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Hide/Reveal for Teacher Classroom Quiz */}
          <button
            onClick={() => setHideAnswerForClass(!hideAnswerForClass)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border ${
              hideAnswerForClass
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {hideAnswerForClass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{hideAnswerForClass ? '课堂提问中 (答案已隐藏)' : '课堂提问模式 (隐藏答案)'}</span>
          </button>

          {/* Toggle Past/To Visual Helpers */}
          <button
            onClick={() => setShowHelpers(!showHelpers)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
              showHelpers
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showHelpers ? '已开启 Past/To 扇区' : '显示 Past/To 扇区'}
          </button>

          <button
            onClick={handleRandomTime}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            随机生成时间
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Stage (Clock) & Right Deck (Analysis & Sound) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Interactive Clock Stage (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center">
          {/* Digital readout header */}
          <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold text-slate-400">当前数字时间</span>
              <span className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                {timeExp.displayDigital}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500">时区分类:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-sm ${
                  timeExp.zone === 'PAST' || timeExp.zone === 'QUARTER_PAST'
                    ? 'bg-emerald-100 text-emerald-800'
                    : timeExp.zone === 'TO' || timeExp.zone === 'QUARTER_TO'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {timeExp.zoneTitle}
              </span>
            </div>
          </div>

          {/* Interactive Clock SVG */}
          <div className="py-2">
            <InteractiveClock
              hour={hour}
              minute={minute}
              onChangeTime={handleTimeChange}
              showHelpers={showHelpers}
              size={340}
            />
          </div>

          {/* Step Adjustment Buttons */}
          <div className="w-full mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => handleAdjustHour(-1)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              -1 小时
            </button>
            <button
              onClick={() => handleAdjustHour(1)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              +1 小时
            </button>
            <div className="h-4 w-px bg-slate-300 mx-1" />
            <button
              onClick={() => handleAdjustMinute(-15)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              -15 分
            </button>
            <button
              onClick={() => handleAdjustMinute(-5)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              -5 分
            </button>
            <button
              onClick={() => handleAdjustMinute(5)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              +5 分
            </button>
            <button
              onClick={() => handleAdjustMinute(15)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              +15 分
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="w-full mt-4">
            <p className="text-xs font-medium text-slate-400 mb-2">中学高频经典时间点：</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TIMES.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setHour(preset.h);
                    setMinute(preset.m);
                    soundEngine.playTick();
                  }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                    hour === preset.h && minute === preset.m
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Concept & Audio Reading Deck (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Expression Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
            {/* Header Question */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-600 tracking-wider">
                CURRICULUM QUESTION
              </span>
              <button
                onClick={() => soundEngine.speak("What time is it? What's the time?")}
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                title="读问句"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>读问句</span>
              </button>
            </div>

            <div className="my-3">
              <h3 className="text-lg font-bold text-slate-900">
                — What time is it? / What's the time?
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">（现在几点了？）</p>
            </div>

            {/* Answer Display (Supports Hide/Reveal for classroom teaching) */}
            {hideAnswerForClass ? (
              <div className="my-6 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center space-y-3">
                <p className="text-sm font-semibold text-slate-600">
                  课堂互动提问中：请同学们看左侧钟表，回答时间！
                </p>
                <button
                  onClick={() => setHideAnswerForClass(false)}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
                >
                  揭晓标准英语答案与发音
                </button>
              </div>
            ) : (
              <div className="space-y-4 my-4">
                {/* 1. Traditional Expression (Past / To) - Primary Focus in Junior High */}
                <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-blue-800">
                      自然表达法 (Past & To 顺逆读法 · 重点考点)
                    </span>
                    <button
                      onClick={() => handleReadAloud(timeExp.traditionalSentence)}
                      className="px-2 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>点我朗读</span>
                    </button>
                  </div>

                  <p className="text-2xl font-black text-blue-900 tracking-tight">
                    {timeExp.traditionalSentence}
                  </p>

                  <div className="mt-2 text-xs text-blue-700 font-mono bg-white/80 px-2.5 py-1 rounded-md border border-blue-200/60 inline-block">
                    公式拆解: {timeExp.formula}
                  </div>
                </div>

                {/* 2. Direct Digital Expression (Hour + Minute) */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-600">
                      直接读法 (Digital 直读法: 点钟 + 分钟)
                    </span>
                    <button
                      onClick={() => handleReadAloud(timeExp.digitalSentence)}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>听发音</span>
                    </button>
                  </div>
                  <p className="text-base font-bold text-slate-800">
                    {timeExp.digitalSentence}
                  </p>
                </div>

                {/* Main Read All Aloud Button */}
                <button
                  onClick={() => handleReadAloud()}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    isSpeaking
                      ? 'bg-emerald-600 text-white shadow-md animate-pulse'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isSpeaking ? '正在朗读中...' : '标准完整对话朗读 (Listen to Q&A)'}</span>
                </button>
              </div>
            )}

            {/* Teaching Explanation & Memory Hook */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                备课讲解要点 (Teacher's Teaching Notes)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {timeExp.zoneExplanation}
              </p>
            </div>
          </div>

          {/* Quick Memory Tips Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800">💡 中考英语时间记忆口诀</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-100">
                <p className="font-bold">分小于等于30用 past</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">分钟 + past + 点钟</p>
                <p className="text-[10px] text-emerald-600 font-mono mt-1">7:10 → ten past seven</p>
              </div>
              <div className="p-2.5 rounded-lg bg-orange-50 text-orange-900 border border-orange-100">
                <p className="font-bold">分大于30用 to</p>
                <p className="text-[11px] text-orange-700 mt-0.5">(60-分) + to + 下一点</p>
                <p className="text-[10px] text-orange-600 font-mono mt-1">7:50 → ten to eight</p>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-100">
                <p className="font-bold">15分钟 = a quarter</p>
                <p className="text-[11px] text-indigo-700 mt-0.5">一刻钟切记加不定冠词 a</p>
                <p className="text-[10px] text-indigo-600 font-mono mt-1">8:15 → a quarter past eight</p>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-50 text-purple-900 border border-purple-100">
                <p className="font-bold">30分钟 = half</p>
                <p className="text-[11px] text-purple-700 mt-0.5">半点固定搭配 half past</p>
                <p className="text-[10px] text-purple-600 font-mono mt-1">8:30 → half past eight</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
