import React from 'react';
import { Volume2, VolumeX, Music, Clock } from 'lucide-react';

export type NavTab = 'explore' | 'quiz' | 'set_clock' | 'daily' | 'grammar';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSoundModal: () => void;
  isBgmPlaying: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSoundModal,
  isBgmPlaying,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element Brand wordmark */}
        <button
          onClick={() => onSelectTab('explore')}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-black shadow-xs">
            TM
          </span>
          <span>Time Master 英语时间大冒险</span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('explore')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'explore'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            探究钟表
          </button>
          <button
            onClick={() => onSelectTab('quiz')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'quiz'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            看钟闯关
          </button>
          <button
            onClick={() => onSelectTab('set_clock')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'set_clock'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            拨针挑战
          </button>
          <button
            onClick={() => onSelectTab('daily')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'daily'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            一日作息
          </button>
          <button
            onClick={() => onSelectTab('grammar')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'grammar'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            语法宝典
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSoundModal}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
              isBgmPlaying
                ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isBgmPlaying ? <Music className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>音频设置 {isBgmPlaying && '· 音乐中'}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row for small screens */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50/80 px-2 py-1.5 text-xs">
        <button
          onClick={() => onSelectTab('explore')}
          className={`px-2 py-1 font-medium ${currentTab === 'explore' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          探究钟表
        </button>
        <button
          onClick={() => onSelectTab('quiz')}
          className={`px-2 py-1 font-medium ${currentTab === 'quiz' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          看钟闯关
        </button>
        <button
          onClick={() => onSelectTab('set_clock')}
          className={`px-2 py-1 font-medium ${currentTab === 'set_clock' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          拨针挑战
        </button>
        <button
          onClick={() => onSelectTab('daily')}
          className={`px-2 py-1 font-medium ${currentTab === 'daily' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          一日作息
        </button>
        <button
          onClick={() => onSelectTab('grammar')}
          className={`px-2 py-1 font-medium ${currentTab === 'grammar' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          语法宝典
        </button>
      </div>
    </header>
  );
};
