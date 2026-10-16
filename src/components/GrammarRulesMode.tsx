import React from 'react';
import { Volume2, BookOpen, AlertTriangle, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface RuleExample {
  digitalTime: string;
  traditional: string;
  directDigital: string;
  noteZh: string;
}

const RULE_EXAMPLES: RuleExample[] = [
  {
    digitalTime: '07:00',
    traditional: "seven o'clock",
    directDigital: 'seven',
    noteZh: "整点：点钟 + o'clock",
  },
  {
    digitalTime: '07:05',
    traditional: 'five past seven',
    directDigital: 'seven oh five',
    noteZh: '≤30分钟：分钟 + past + 原点钟',
  },
  {
    digitalTime: '07:15',
    traditional: 'a quarter past seven',
    directDigital: 'seven fifteen',
    noteZh: '15分钟：a quarter past + 原点钟 (切记 a)',
  },
  {
    digitalTime: '07:30',
    traditional: 'half past seven',
    directDigital: 'seven thirty',
    noteZh: '半点：固定用 half past + 原点钟',
  },
  {
    digitalTime: '07:40',
    traditional: 'twenty to eight',
    directDigital: 'seven forty',
    noteZh: '>30分钟：(60-40=20) + to + 下一点钟(8)',
  },
  {
    digitalTime: '07:45',
    traditional: 'a quarter to eight',
    directDigital: 'seven forty-five',
    noteZh: '差一刻：a quarter to + 下一点钟(8)',
  },
  {
    digitalTime: '07:55',
    traditional: 'five to eight',
    directDigital: 'seven fifty-five',
    noteZh: '差5分：five to + 下一点钟(8)',
  },
];

export const GrammarRulesMode: React.FC = () => {
  const handleSpeak = (text: string) => {
    soundEngine.speak(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            初中英语时间规则大宝典 (Grammar & Exam Master)
          </h2>
          <p className="text-xs text-slate-500">
            整理中考必考点、顺逆读法对照表、高频易错避坑陷阱，支持点击发音朗读
          </p>
        </div>
      </div>

      {/* Visual Infographic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Past Rule Card */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              01
            </span>
            <h3 className="text-base font-bold text-emerald-950">
              顺读区间：past (过)
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            当分钟数在 <strong>1~30 分钟</strong> 之间时，使用 <strong>past</strong>，意为“过了几点几分”。
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-900">核心公式</span>
                <p className="font-mono text-emerald-700 mt-0.5">分钟数 + past + 原点钟</p>
              </div>
              <button
                onClick={() => handleSpeak("It's ten past eight.")}
                className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 rounded-md transition-colors"
                title="听例句发音"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">15分钟特殊表达</span>
                <p className="text-slate-600 mt-0.5">
                  15分常换为 <strong>a quarter</strong>（一刻钟），如 8:15 ＝ a quarter past eight
                </p>
              </div>
              <button
                onClick={() => handleSpeak("It's a quarter past eight.")}
                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">30分钟特殊表达</span>
                <p className="text-slate-600 mt-0.5">
                  30分固定使用 <strong>half past</strong>，如 8:30 ＝ half past eight
                </p>
              </div>
              <button
                onClick={() => handleSpeak("It's half past eight.")}
                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* To Rule Card */}
        <div className="bg-white rounded-2xl border border-orange-200 p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
              02
            </span>
            <h3 className="text-base font-bold text-orange-950">
              逆读区间：to (差)
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            当分钟数在 <strong>31~59 分钟</strong> 之间时，使用 <strong>to</strong>，意为“差几分到下一个点钟”。
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-orange-900">核心公式</span>
                <p className="font-mono text-orange-700 mt-0.5">
                  (60 - 当前分钟) + to + 下一个点钟 (原点钟+1)
                </p>
              </div>
              <button
                onClick={() => handleSpeak("It's twenty to nine.")}
                className="p-1.5 text-orange-700 hover:text-orange-900 hover:bg-orange-100 rounded-md transition-colors"
                title="听例句发音"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">45分钟特殊表达</span>
                <p className="text-slate-600 mt-0.5">
                  还差15分到下一点钟，固定用 <strong>a quarter to + 下一点钟</strong>，如 8:45 ＝ a quarter to nine
                </p>
              </div>
              <button
                onClick={() => handleSpeak("It's a quarter to nine.")}
                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">避坑要点：时钟+1</span>
                <p className="text-slate-600 mt-0.5">
                  切记：to 后面必须是<strong>下一个点钟</strong>！例如 7:50 是 ten to <strong>eight</strong>。
                </p>
              </div>
              <button
                onClick={() => handleSpeak("It's ten to eight.")}
                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Reference Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">
              中考时间双轨对照表 (Traditional vs Digital Reading Table)
            </h3>
          </div>
          <span className="text-xs text-slate-400">点击小喇叭朗读标准发音</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="py-3 px-4 font-semibold">数字时间</th>
                <th className="py-3 px-4 font-semibold">自然表达 (Past / To 顺逆读法)</th>
                <th className="py-3 px-4 font-semibold">直读法 (Digital 直读)</th>
                <th className="py-3 px-4 font-semibold">规则解析与记忆窍门</th>
                <th className="py-3 px-4 font-semibold text-right">听读</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {RULE_EXAMPLES.map((row) => (
                <tr key={row.digitalTime} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 text-sm">
                    {row.digitalTime}
                  </td>
                  <td className="py-3 px-4 font-bold text-blue-700 text-sm">
                    {row.traditional}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    {row.directDigital}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {row.noteZh}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleSpeak(`It's ${row.traditional}.`)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1"
                      title="点击发音"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Junior High 5 Major Exam Traps */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-800">
            中考高频易错「五大避坑陷阱」 (Exam Pitfalls)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
            <p className="font-bold text-rose-900">
              陷阱 1：漏掉 a quarter 前的不定冠词 a
            </p>
            <p className="text-slate-600 leading-relaxed">
              ❌ 错误：quarter past eight / quarter to nine<br />
              ✅ 正确：<strong>a quarter</strong> past eight / <strong>a quarter</strong> to nine
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
            <p className="font-bold text-rose-900">
              陷阱 2：to 逆读法忘记将时针「加1」
            </p>
            <p className="text-slate-600 leading-relaxed">
              ❌ 错误：7:50 误写为 ten to seven（这样成了差10分到7点，即6:50）<br />
              ✅ 正确：7:50 应该是 ten to <strong>eight</strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
            <p className="font-bold text-rose-900">
              陷阱 3：半点 30 分绝不能使用 to
            </p>
            <p className="text-slate-600 leading-relaxed">
              ❌ 错误：half to eight（没有这种说法）<br />
              ✅ 正确：固定为 <strong>half past seven</strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
            <p className="font-bold text-rose-900">
              陷阱 4：介词搭配混淆 (at vs in vs on)
            </p>
            <p className="text-slate-600 leading-relaxed">
              具体时刻用 <strong>at</strong>（at 8 o'clock, at noon）；<br />
              时间段用 <strong>in</strong>（in the morning）；具体某天用 <strong>on</strong>（on Sunday）。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
