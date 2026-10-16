import React, { useState } from 'react';
import { DAILY_ROUTINES, DailyRoutineItem, getTimeExpression } from '../utils/timeLogic';
import { InteractiveClock } from './InteractiveClock';
import { soundEngine } from '../utils/audio';
import {
  Volume2,
  Sun,
  Coffee,
  Backpack,
  BookOpen,
  Utensils,
  Activity,
  Soup,
  Pencil,
  Moon,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Sun: <Sun className="w-5 h-5 text-amber-500" />,
  Coffee: <Coffee className="w-5 h-5 text-amber-700" />,
  Backpack: <Backpack className="w-5 h-5 text-blue-600" />,
  BookOpen: <BookOpen className="w-5 h-5 text-indigo-600" />,
  Utensils: <Utensils className="w-5 h-5 text-emerald-600" />,
  Activity: <Activity className="w-5 h-5 text-orange-500" />,
  Soup: <Soup className="w-5 h-5 text-rose-500" />,
  Pencil: <Pencil className="w-5 h-5 text-cyan-600" />,
  Moon: <Moon className="w-5 h-5 text-violet-500" />,
};

export const DailyRoutineMode: React.FC = () => {
  const [selectedRoutine, setSelectedRoutine] = useState<DailyRoutineItem>(DAILY_ROUTINES[0]);
  const [activePeriod, setActivePeriod] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  const filtered = DAILY_ROUTINES.filter(
    (item) => activePeriod === 'all' || item.period === activePeriod
  );

  const timeExp = getTimeExpression(selectedRoutine.hour, selectedRoutine.minute);

  const handlePlayDialogue = () => {
    soundEngine.speak(
      `${selectedRoutine.sentenceQuestion} ... ${selectedRoutine.sentenceAnswer}`
    );
  };

  const handlePlayQuestion = () => {
    soundEngine.speak(selectedRoutine.sentenceQuestion);
  };

  const handlePlayAnswer = () => {
    soundEngine.speak(selectedRoutine.sentenceAnswer);
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            一日作息语境拓展 (My Day & Daily Routine)
          </h2>
          <p className="text-xs text-slate-500">
            人教版/外研版初中核心句型：What time do you ...? 结合时间与介词 at 的生活运用
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActivePeriod('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activePeriod === 'all' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            全部作息 (All Day)
          </button>
          <button
            onClick={() => setActivePeriod('morning')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activePeriod === 'morning' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            早晨 (Morning)
          </button>
          <button
            onClick={() => setActivePeriod('afternoon')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activePeriod === 'afternoon' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            下午 (Afternoon)
          </button>
          <button
            onClick={() => setActivePeriod('evening')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activePeriod === 'evening' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            晚上 (Evening)
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Routine Cards Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((item) => {
              const isSelected = selectedRoutine.id === item.id;
              const padM = item.minute < 10 ? `0${item.minute}` : item.minute;
              const padH = item.hour < 10 ? `0${item.hour}` : item.hour;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedRoutine(item);
                    soundEngine.playTick();
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
                      {ICON_MAP[item.iconName] || <Sun className="w-5 h-5 text-blue-600" />}
                    </div>
                    <span className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {padH}:{padM}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-slate-900">{item.activityEn}</h4>
                    <p className="text-xs text-slate-500">{item.activityZh}</p>
                    <p className="text-xs font-semibold text-blue-700 mt-2">
                      at {item.timePhrase}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grammar Callout Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-xs space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              中考重点：时间的介词用法
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-blue-600">at + 具体时间点</span>
                <p className="text-slate-600 mt-0.5">at 7:00, at half past six, at noon, at night</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-emerald-600">in + 时间段</span>
                <p className="text-slate-600 mt-0.5">in the morning, in the afternoon, in the evening</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-purple-600">on + 具体某天的时间</span>
                <p className="text-slate-600 mt-0.5">on Monday morning, on a sunny afternoon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected Routine Clock & Dialogue Player (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="text-center">
            <span className="text-xs font-bold text-blue-600 tracking-wider">
              ACTIVITY CLOCK
            </span>
            <h3 className="text-base font-bold text-slate-800 mt-0.5">
              {selectedRoutine.activityZh} · {selectedRoutine.activityEn}
            </h3>
          </div>

          {/* Clock */}
          <div className="flex justify-center py-1">
            <InteractiveClock
              hour={selectedRoutine.hour}
              minute={selectedRoutine.minute}
              interactive={false}
              showHelpers={true}
              size={260}
            />
          </div>

          {/* Interactive Dialogue Practice */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Question bubble */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                Q
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800">
                    {selectedRoutine.sentenceQuestion}
                  </p>
                  <button
                    onClick={handlePlayQuestion}
                    className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                    title="听问句"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">你什么时候{selectedRoutine.activityZh}？</p>
              </div>
            </div>

            {/* Answer bubble */}
            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                A
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-emerald-900">
                    {selectedRoutine.sentenceAnswer}
                  </p>
                  <button
                    onClick={handlePlayAnswer}
                    className="text-emerald-700 hover:text-emerald-900 p-1 transition-colors"
                    title="听答句"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">我在{selectedRoutine.timePhrase}{selectedRoutine.activityZh}。</p>
              </div>
            </div>
          </div>

          {/* Read Entire Dialogue Button */}
          <button
            onClick={handlePlayDialogue}
            className="w-full py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            <span>连贯情境朗读 (Listen to Full Conversation)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
