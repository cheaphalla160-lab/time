import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Mic, X, Play, Check } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface SoundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBgmPlaying: boolean;
  setIsBgmPlaying: (playing: boolean) => void;
}

export const SoundSettingsModal: React.FC<SoundSettingsModalProps> = ({
  isOpen,
  onClose,
  isBgmPlaying,
  setIsBgmPlaying,
}) => {
  const [bgmVol, setBgmVol] = useState(soundEngine.getBgmVolume());
  const [sfxVol, setSfxVol] = useState(soundEngine.getSfxVolume());
  const [speechRate, setSpeechRate] = useState(soundEngine.speechRate);
  const [isMuted, setIsMuted] = useState(soundEngine.getIsMuted());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoiceName, setCurrentVoiceName] = useState(soundEngine.getSelectedVoiceName());

  useEffect(() => {
    if (isOpen) {
      setVoices(soundEngine.getAvailableEnglishVoices());
      setCurrentVoiceName(soundEngine.getSelectedVoiceName());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleBgm = () => {
    const playing = soundEngine.toggleBgm();
    setIsBgmPlaying(playing);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleBgmVolChange = (val: number) => {
    setBgmVol(val);
    soundEngine.setBgmVolume(val);
  };

  const handleSfxVolChange = (val: number) => {
    setSfxVol(val);
    soundEngine.setSfxVolume(val);
  };

  const handleRateChange = (val: number) => {
    setSpeechRate(val);
    soundEngine.speechRate = val;
  };

  const handleVoiceChange = (uri: string) => {
    soundEngine.setVoice(uri);
    setCurrentVoiceName(soundEngine.getSelectedVoiceName());
  };

  const handleTestSpeech = () => {
    soundEngine.speak("What time is it? It's a quarter past seven!", {
      rate: speechRate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">音频与发音设置 (Audio & Voice)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Global Mute Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <p className="text-sm font-semibold text-slate-800">静音控制</p>
              <p className="text-xs text-slate-500">一键开启或静音所有音效与音乐</p>
            </div>
            <button
              onClick={handleToggleMute}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                isMuted
                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isMuted ? '已静音' : '声音正常'}
            </button>
          </div>

          {/* Background Music */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-emerald-600" />
                轻松愉快的背景音乐 (BGM)
              </label>
              <button
                onClick={handleToggleBgm}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  isBgmPlaying
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {isBgmPlaying ? '正在播放' : '点击开启'}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-12">音乐音量</span>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={bgmVol}
                onChange={(e) => handleBgmVolChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-600 w-8 text-right">
                {Math.round(bgmVol * 125)}%
              </span>
            </div>
          </div>

          {/* Sound Effects */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">游戏互动音效 (SFX)</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-12">音效音量</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={(e) => handleSfxVolChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-600 w-8 text-right">
                {Math.round(sfxVol * 100)}%
              </span>
            </div>
          </div>

          {/* English Voice Reading (TTS) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-blue-600" />
                英语朗读语速 (Speech Speed)
              </label>
              <button
                onClick={handleTestSpeech}
                className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5" />
                试听发音
              </button>
            </div>

            <div className="flex items-center gap-2">
              {[
                { label: '慢速教学 0.7x', val: 0.7 },
                { label: '标准初中 0.85x', val: 0.85 },
                { label: '自然母语 1.0x', val: 1.0 },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => handleRateChange(item.val)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    Math.abs(speechRate - item.val) < 0.05
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {voices.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs text-slate-500">发音人声 (English Voice)</span>
                <select
                  value={voices.find((v) => v.name === currentVoiceName)?.voiceURI || ''}
                  onChange={(e) => handleVoiceChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {voices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            完成设置
          </button>
        </div>
      </div>
    </div>
  );
};
