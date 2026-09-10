import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Target, 
  Award, 
  Building2, 
  CheckCircle2, 
  Users, 
  CreditCard, 
  Printer
} from 'lucide-react';
import { JLPT_EXAM_SCHEDULE, JLPT_TEST_CENTERS, JLPT_SCORING_CRITERIA } from '../data/japanese/jlptRegistration';
import { getJlptExamCountdown } from '../utils/examCountdown';

export const ExamRegistrationBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'tips' | 'scoring' | 'centers'>('timeline');

  const countdown = getJlptExamCountdown();
  const nextExam = JLPT_EXAM_SCHEDULE[1]; // 2026年第2回大考

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-300">
      
      {/* 顶部主横幅条 (默认常驻，点击任意位置即可平滑折叠/展开) */}
      <div 
        onClick={() => setIsExpanded(prev => !prev)}
        className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition select-none bg-gradient-to-r from-sky-50/40 via-white to-sky-50/30"
      >
        {/* 左侧：官方考期与倒计时状态 */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20 font-black">
            <Calendar className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200">
                JLPT 官方考期全景
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-black animate-pulse">
                {countdown.displayText}
              </span>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                考试日：{nextExam.examDate}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              教育部考试院唯一网报入口 · 抢考位实战攻略 · 180分制算分定级神器
            </p>
          </div>
        </div>

        {/* 右侧：展开/收起按钮与操作提示 */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-right hidden lg:block">
            <span className="text-[11px] font-bold text-sky-700 block">
              {isExpanded ? '点击收起全景指引' : '展开抢考位与全国考点指南'}
            </span>
            <span className="text-[10px] text-slate-400">
              考点紧俏指数 · 算分模拟
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-sky-100 text-slate-600 group-hover:text-sky-700 transition">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* 展开后的 4 大全景指引内容区 */}
      {isExpanded && (
        <div className="border-t border-slate-100 p-5 sm:p-6 bg-slate-50/50 space-y-5 animate-in slide-in-from-top duration-300">
          
          {/* 子 Tab 切换条 */}
          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveSubTab('timeline'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeSubTab === 'timeline' ? 'bg-sky-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              📅 报考关键节点
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveSubTab('tips'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeSubTab === 'tips' ? 'bg-sky-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              ⚡ 抢考位避坑攻略
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveSubTab('scoring'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeSubTab === 'scoring' ? 'bg-sky-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              🧮 180分算分与合格线
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveSubTab('centers'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeSubTab === 'centers' ? 'bg-sky-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              📍 全国考点分布
            </button>
          </div>

          {/* SubTab 1: 关键节点 */}
          {activeSubTab === 'timeline' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-sky-700 block">第一步：网报预热</span>
                <p className="font-bold text-slate-900 text-sm">注册账号与照片预审</p>
                <p className="text-xs text-slate-500">提前 1 周登录教育考试网，备好 360*480 像素白底证件照。</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-sky-700 block">第二步：抢座交费</span>
                <p className="font-bold text-slate-900 text-sm">锁定考位并在24小时内交费</p>
                <p className="text-xs text-slate-500">N1/N2 报名当天准时开抢，预选 2~3 个备用周边考点。</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-sky-700 block">第三步：准考证与大考</span>
                <p className="font-bold text-slate-900 text-sm">打印准考证并按时赴考</p>
                <p className="text-xs text-slate-500">考前 1 周打印准考证，备好身份证原件、HB/2B铅笔与橡皮。</p>
              </div>
            </div>
          )}

          {/* SubTab 2: 抢位秘籍 */}
          {activeSubTab === 'tips' && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-900 text-sm">💡 JLPT 抢考位四大实战技巧：</p>
              <p>1. <strong>网络首选有线宽带</strong>：Wi-Fi 波动大，建议电脑插网线或手机连 5G 独立热点进行双开。</p>
              <p>2. <strong>提前 15 分钟登录系统</strong>：报名开放前数分钟是服务器负载平稳期，提前输入验证码并保持会话活跃。</p>
              <p>3. <strong>跨省捡漏梯队规划</strong>：若京沪浙秒光，立刻按照“周边省份高铁1小时圈”改报合肥、南昌、大连、武汉等考点，切忌犹豫！</p>
            </div>
          )}

          {/* SubTab 3: 算分规则 */}
          {activeSubTab === 'scoring' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {JLPT_SCORING_CRITERIA.map(sc => (
                <div key={sc.level} className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{sc.level}</span>
                    <span className="text-sky-700 font-black">及格线: {sc.totalPass}分 / 180分</span>
                  </div>
                  <p className="text-slate-500">{sc.summary}</p>
                </div>
              ))}
            </div>
          )}

          {/* SubTab 4: 考点一览 */}
          {activeSubTab === 'centers' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {JLPT_TEST_CENTERS.map(tc => (
                <div key={tc.region} className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{tc.region}</span>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">{tc.hotLevel}</span>
                  </div>
                  <p className="text-slate-500">{tc.cities.join(' · ')}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
