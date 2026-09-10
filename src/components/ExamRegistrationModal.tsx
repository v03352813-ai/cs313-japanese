import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Calculator, 
  BellRing, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  Sparkles,
  Award,
  Zap,
  ExternalLink
} from 'lucide-react';
import { 
  JLPT_EXAM_SCHEDULE, 
  JLPT_TEST_CENTERS, 
  JLPT_SCORING_CRITERIA 
} from '../data/japanese/jlptRegistration';
import { getJlptExamCountdown } from '../utils/examCountdown';

interface ExamRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'process' | 'centers' | 'scoring' | 'alarm';
}

export const ExamRegistrationModal: React.FC<ExamRegistrationModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'process'
}) => {
  const [activeTab, setActiveTab] = useState<'process' | 'centers' | 'scoring' | 'alarm'>(defaultTab);
  const countdown = getJlptExamCountdown();

  // 180分制算分定级计算器状态
  const [calcLevel, setCalcLevel] = useState<'N1' | 'N2' | 'N3' | 'N4' | 'N5'>('N2');
  const [inputVocab, setInputVocab] = useState<number>(35);
  const [inputReading, setInputReading] = useState<number>(35);
  const [inputListening, setInputListening] = useState<number>(35);

  if (!isOpen) return null;

  // 判定是否及格
  const totalScore = inputVocab + inputReading + inputListening;
  const isSectionPass = inputVocab >= 19 && inputReading >= 19 && inputListening >= 19;
  const passThreshold = calcLevel === 'N1' ? 100 : calcLevel === 'N2' ? 90 : calcLevel === 'N3' ? 95 : 90;
  const isPassed = totalScore >= passThreshold && isSectionPass;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black backdrop-blur-xs">
              官方权威考情
            </span>
            <span className="text-sky-100 text-xs font-semibold">
              教育部考试院 JLPT 考期全景
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                JLPT 全球统考全景指南
              </h2>
              <p className="text-xs text-sky-100 mt-0.5">
                抢考位全攻略 · 考点紧俏指数 · 180分制算分定级神器
              </p>
            </div>

            {/* Dynamic Countdown Badge */}
            <div className="bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-center sm:text-right shrink-0">
              <span className="text-[10px] text-sky-100 block font-bold">
                {countdown.subText}
              </span>
              <span className="text-sm font-black text-amber-300 block">
                {countdown.displayText}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Tabs Navigator */}
        <div className="flex items-center border-b border-slate-100 bg-slate-50/80 px-4 sm:px-6 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('process')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'process'
                ? 'border-sky-600 text-sky-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>报考全流程与日程</span>
          </button>
          <button
            onClick={() => setActiveTab('centers')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'centers'
                ? 'border-sky-600 text-sky-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>全国考点分布一览</span>
          </button>
          <button
            onClick={() => setActiveTab('scoring')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'scoring'
                ? 'border-sky-600 text-sky-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>180分算分定级</span>
          </button>
          <button
            onClick={() => setActiveTab('alarm')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'alarm'
                ? 'border-sky-600 text-sky-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>抢考位防漏闹钟</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: 报考全流程与官方考期 */}
          {activeTab === 'process' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sky-900 text-sm">
                  <ExternalLink className="w-4 h-4 text-sky-600" />
                  <span>官方唯一报名入口：中国教育考试网</span>
                </div>
                <p>
                  报名官方网址：<a href="https://jlpt.neea.edu.cn" target="_blank" rel="noreferrer" className="font-bold underline text-sky-700">jlpt.neea.edu.cn</a> (教育网) 或 <a href="https://jlpt.neea.cn" target="_blank" rel="noreferrer" className="font-bold underline text-sky-700">jlpt.neea.cn</a> (公网)。
                </p>
                <p className="text-[11px] text-sky-700">
                  ⚠️ 考位抢报秘籍：提前 1 周注册账号并上传合规免冠白底证件照（像素 360*480，大小 30KB~100KB），开考报名当天提前 20 分钟登录并开启多标签页防卡顿。
                </p>
              </div>

              <div className="space-y-2.5">
                <h3 className="font-bold text-slate-800 text-sm">📅 近期大考官方时间表</h3>
                {JLPT_EXAM_SCHEDULE.map(sch => (
                  <div key={sch.id} className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{sch.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        官方考试日：{sch.examDate}
                      </span>
                    </div>
                    <p className="text-slate-500">
                      报名周期：{sch.registrationStart} ~ {sch.registrationEnd} · 成绩放榜：{sch.resultsDate}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">{sch.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 全国考点紧俏分布 */}
          {activeTab === 'centers' && (
            <div className="space-y-3 text-xs">
              {JLPT_TEST_CENTERS.map(c => (
                <div key={c.region} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{c.region}</span>
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      c.isHot ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {c.hotLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {c.cities.map((city, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                        {city}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">{c.tips}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: 180分制算分定级神器 */}
          {activeTab === 'scoring' && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                <span className="font-bold text-sky-900 text-sm block">
                  🧮 JLPT 动态算分与及格线判定模拟器
                </span>
                <p className="text-sky-800">
                  JLPT 考试满分 180 分。除了总分必须达到合格线外，<strong>单项得分也必须达到最低基准线 (通常为 19 分)</strong>，任一单项不及格即全盘不合格！
                </p>
              </div>

              {/* Level Selector */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">目标考级：</span>
                {(['N1', 'N2', 'N3', 'N4', 'N5'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setCalcLevel(lvl)}
                    className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition ${
                      calcLevel === lvl
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Sliders Input */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">言语知识 (满分60)</span>
                    <span className="font-black text-sky-700 text-sm">{inputVocab}分</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={inputVocab}
                    onChange={e => setInputVocab(Number(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                  <span className={`text-[10px] block ${inputVocab >= 19 ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}`}>
                    {inputVocab >= 19 ? '✓ 单项及格 (≥19)' : '✗ 单项未达标 (<19)'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">读解 (满分60)</span>
                    <span className="font-black text-sky-700 text-sm">{inputReading}分</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={inputReading}
                    onChange={e => setInputReading(Number(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                  <span className={`text-[10px] block ${inputReading >= 19 ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}`}>
                    {inputReading >= 19 ? '✓ 单项及格 (≥19)' : '✗ 单项未达标 (<19)'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">听解 (满分60)</span>
                    <span className="font-black text-sky-700 text-sm">{inputListening}分</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={inputListening}
                    onChange={e => setInputListening(Number(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                  <span className={`text-[10px] block ${inputListening >= 19 ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}`}>
                    {inputListening >= 19 ? '✓ 单项及格 (≥19)' : '✗ 单项未达标 (<19)'}
                  </span>
                </div>
              </div>

              {/* Calculated Result Card */}
              <div className={`p-4 rounded-2xl border text-center space-y-1 ${
                isPassed ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <span className="text-2xl font-black block">
                  预计总分：{totalScore} 分 / 180 分
                </span>
                <p className="font-bold text-sm">
                  {isPassed ? `🎉 恭喜！预计顺利通过 JLPT ${calcLevel} 考试！(合格线 ${passThreshold} 分)` : `⚠️ 尚未及格！距离 ${calcLevel} 合格线还差 ${Math.max(0, passThreshold - totalScore)} 分或单项未满 19 分`}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: 闹钟预约提醒 */}
          {activeTab === 'alarm' && (
            <div className="space-y-4 text-xs text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center">
                <BellRing className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-black text-base text-slate-900">
                  开启 2026 年第 2 回 JLPT 开报提醒
                </h3>
                <p className="text-slate-500">
                  JLPT 考位历年竞争激烈，微信/浏览器通知会在报名通道开启前 1 小时自动弹窗预警，抢位绝不错过！
                </p>
              </div>
              <div className="max-w-xs mx-auto pt-2">
                <button
                  onClick={() => alert('已成功开启 JLPT 考期开报专属预警通知！')}
                  className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition cursor-pointer"
                >
                  🔔 一键开启考位预警闹钟
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
