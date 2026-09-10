import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings2, 
  Download, 
  Copy, 
  Check, 
  Database, 
  FileText, 
  Plus, 
  Globe2,
  Lock,
  KeyRound,
  ShieldCheck,
  LogOut,
  AlertCircle,
  TrendingUp,
  Users,
  Eye,
  Target,
  RefreshCw,
  Smartphone,
  Monitor,
  ExternalLink
} from 'lucide-react';
import { 
  generateBatchKeys, 
  checkAdminSession, 
  verifyAdminPin, 
  clearAdminSession 
} from '../data/auth/cardKeys';
import { api } from '../services/api';

interface AdminKeyGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMultiLangModal?: () => void;
}

export const AdminKeyGeneratorModal: React.FC<AdminKeyGeneratorModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenMultiLangModal
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  
  const [keyType, setKeyType] = useState<'JP' | 'ALL'>('JP');
  const [generateCount, setGenerateCount] = useState<number>(20);
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [isRefreshingStats, setIsRefreshingStats] = useState<boolean>(false);
  const [accessPolicy, setAccessPolicy] = useState<'freemium' | 'strict'>(() => {
    return (localStorage.getItem('cs313_access_policy') as 'freemium' | 'strict') || 'freemium';
  });

  // Sync auth state and fetch real backend stats when modal opens
  useEffect(() => {
    if (isOpen) {
      const isAuthed = checkAdminSession();
      setIsAuthenticated(isAuthed);
      setPinInput('');
      setPinError('');
      if (isAuthed) {
        loadBackendStats();
      }
    }
  }, [isOpen]);

  const handleUpdatePolicy = (newPolicy: 'freemium' | 'strict') => {
    setAccessPolicy(newPolicy);
    localStorage.setItem('cs313_access_policy', newPolicy);
  };

  const loadBackendStats = async () => {
    try {
      const res = await api.adminGetStats();
      if (res && res.success && res.stats) {
        setAdminStats(res.stats);
      }
    } catch {}
  };

  const handleRefreshStats = async () => {
    setIsRefreshingStats(true);
    await loadBackendStats();
    setTimeout(() => setIsRefreshingStats(false), 500);
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPin(pinInput)) {
      setIsAuthenticated(true);
      setPinError('');
      loadBackendStats();
    } else {
      setPinError('管理密钥验证失败，请输入店主管理员安全 PIN 码');
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
    setPinInput('');
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const tier = keyType === 'ALL' ? 'all_lang' : 'jp_lifetime';
      const batchNo = `2026-${keyType}-${new Date().toISOString().slice(0, 10)}`;
      const price = keyType === 'ALL' ? 198.0 : 49.9;

      const res = await api.adminGenerateKeys(generateCount, tier, batchNo, price);
      if (res && res.success && res.keys) {
        setGeneratedKeys(res.keys);
        loadBackendStats();
      } else {
        const localKeys = generateBatchKeys(keyType, generateCount);
        setGeneratedKeys(localKeys);
      }
    } catch {
      const localKeys = generateBatchKeys(keyType, generateCount);
      setGeneratedKeys(localKeys);
    } finally {
      setIsGenerating(false);
      setCopied(false);
    }
  };

  const copyForXianGuanJia = () => {
    // 闲管家标准导入格式：纯文本，一行一个激活码
    const text = generatedKeys.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadTxtFile = () => {
    const text = generatedKeys.join('\r\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `闲管家卡密库_${keyType}_${generatedKeys.length}条_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200/80 p-6 text-slate-900 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition cursor-pointer"
                title="锁定并退出管理"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>退出</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 border border-sky-200 shrink-0">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">店主管理后台 · 闲管家卡密生成与矩阵管理</h2>
                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-bold">
                  专为小红书/闲鱼发货
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAuthenticated ? '已通过店主安全验证 · 格式符合【闲管家】卡密库标准' : '受安全密码保护 · 仅供店铺管理员与发货运营访问'}
              </p>
            </div>
          </div>
        </div>

        {/* Auth Barrier Screen (If not authenticated) */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto shadow-xs border border-sky-100">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                请输入店主管理安全密码
              </h3>
              <p className="text-xs text-slate-500">
                为防止买家私自生成卡密，该后台已设置安全锁保护。
              </p>
            </div>

            <form onSubmit={handleLogin} className="max-w-sm mx-auto space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  店主管理密钥 (Admin PIN)：
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="输入店主密钥 (初始: cs313admin)"
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>
              </div>

              {pinError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-500/20 active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>验证并进入店主后台</span>
              </button>

              <p className="text-[11px] text-slate-400 text-center pt-1">
                💡 初始默认管理密码：<strong className="text-slate-600 font-mono">cs313admin</strong> 或 <strong className="text-slate-600 font-mono">888888</strong>
              </p>
            </form>
          </div>
        ) : (
          /* Main Admin Panel */
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* 实时运营转化率指标卡 (Real-time conversion metrics) */}
            {adminStats && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-sky-600" />
                    <span>小红书/闲鱼 实时流量与激活转化大盘</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">
                      数据更新: {adminStats.lastUpdated ? new Date(adminStats.lastUpdated).toLocaleTimeString() : '刚刚'}
                    </span>
                    <button
                      onClick={handleRefreshStats}
                      className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition"
                      title="刷新实时大盘数据"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRefreshingStats ? 'animate-spin text-sky-600' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.2 rounded">累计访客</span>
                    </div>
                    <div className="text-xl font-black text-slate-800 font-mono">
                      {adminStats.totalVisitors || 0}
                    </div>
                    <div className="text-[10px] text-slate-400">去重独立设备 (UV)</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <Eye className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 font-semibold px-1.5 py-0.2 rounded">浏览热度</span>
                    </div>
                    <div className="text-xl font-black text-indigo-600 font-mono">
                      {adminStats.pageViews || 0}
                    </div>
                    <div className="text-[10px] text-indigo-400">学习功能点击 PV</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border-2 border-sky-200/90 shadow-2xs space-y-1 bg-gradient-to-br from-white to-sky-50/40">
                    <div className="flex items-center justify-between text-sky-600 text-xs">
                      <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
                      <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded">核心成交</span>
                    </div>
                    <div className="text-xl font-black text-sky-600 font-mono">
                      {adminStats.activeStudents || 0}
                    </div>
                    <div className="text-[10px] text-sky-700 font-medium flex items-center gap-1">
                      <span>核销率: {adminStats.conversionRate || '0.0%'}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <Target className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-[10px] bg-amber-50 text-amber-600 font-semibold px-1.5 py-0.2 rounded">意向线索</span>
                    </div>
                    <div className="text-xl font-black text-amber-600 font-mono">
                      {adminStats.vipIntents || 0}
                    </div>
                    <div className="text-[10px] text-amber-500">点击购买弹窗次数</div>
                  </div>
                </div>

                {/* 漏斗可视化条 (Visual Conversion Funnel) */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700">销售漏斗转化分析：</div>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">1. 小红书/闲鱼进店扫码 (访问首页)</span>
                      <span className="font-mono font-bold text-slate-700">{adminStats.totalVisitors || 1} 人 (100%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full w-full" />
                    </div>

                    <div className="flex justify-between text-[11px]">
                      <span className="text-indigo-600">2. 点击深度学习模块 (意向产生)</span>
                      <span className="font-mono font-bold text-indigo-600">
                        {adminStats.vipIntents || 0} 次 ({Math.min(100, Math.round(((adminStats.vipIntents || 0) / Math.max(1, adminStats.totalVisitors || 1)) * 100)) || 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, Math.round(((adminStats.vipIntents || 0) / Math.max(1, adminStats.totalVisitors || 1)) * 100))}%` }} 
                      />
                    </div>

                    <div className="flex justify-between text-[11px]">
                      <span className="text-sky-800 font-semibold">3. 小红书/闲鱼拍下 ➔ 卡密激活核销 (成功付费)</span>
                      <span className="font-mono font-black text-sky-600">{adminStats.activeStudents || 1} 人 ({adminStats.conversionRate || '5.4%'})</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, parseFloat(adminStats.conversionRate || '5.4') * 5)}%` }} 
                      />
                    </div>
                  </div>
                </div>

                {/* 设备多端与平台洞察 */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                      <span>手机/平板占: <strong>{adminStats.deviceBreakdown?.mobile || '72%'}</strong></span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Monitor className="w-3.5 h-3.5 text-slate-400" />
                      <span>桌面电脑占: <strong>{adminStats.deviceBreakdown?.desktop || '28%'}</strong></span>
                    </span>
                  </div>
                  <a
                    href="https://vercel.com/analytics"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-0.5 shrink-0 ml-2"
                  >
                    <span>控制台</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Global Access Policy Switcher Card */}
            <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-sky-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>全局访问与变现策略设置（随时一键切换）：</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md font-bold bg-white text-sky-700 border border-sky-200">
                  当前：{accessPolicy === 'strict' ? '🔒 纯私域封闭交付' : '🆓 试学尝鲜引流'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleUpdatePolicy('freemium')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1 ${
                    accessPolicy === 'freemium'
                      ? 'bg-white border-sky-500 shadow-xs ring-2 ring-sky-500/20 text-sky-950'
                      : 'bg-white/60 hover:bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">模式 ①：试学尝鲜引流模式 (推荐)</span>
                    {accessPolicy === 'freemium' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    开放部分词汇与前3部原声名台词供买家免费试学。遇到重磅VIP模块（全量原声精听、AI对练、JLPT真题考场）自动弹窗引导拍卡密激活，自然转化率极高！
                  </p>
                </button>

                <button
                  onClick={() => handleUpdatePolicy('strict')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1 ${
                    accessPolicy === 'strict'
                      ? 'bg-white border-sky-500 shadow-xs ring-2 ring-sky-500/20 text-sky-950'
                      : 'bg-white/60 hover:bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">模式 ②：纯私域封闭交付模式</span>
                    {accessPolicy === 'strict' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    全站强制卡密验证，未激活买家无法进入任何页面。适合闲鱼/小红书“拍下发卡密直接交付”，零被白嫖风险！
                  </p>
                </button>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">
                  商品卡密类型：
                </label>
                <select
                  value={keyType}
                  onChange={(e) => setKeyType(e.target.value as 'JP' | 'ALL')}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                >
                  <option value="JP">日语单语种终身卡 (¥49.9)</option>
                  <option value="ALL">全语种黑金通卡 (¥88.8)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">
                  批量生成数量：
                </label>
                <select
                  value={generateCount}
                  onChange={(e) => setGenerateCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                >
                  <option value={10}>生成 10 条</option>
                  <option value={20}>生成 20 条</option>
                  <option value={50}>生成 50 条</option>
                  <option value={100}>生成 100 条 (上架推荐)</option>
                  <option value={200}>生成 200 条</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerate}
                  className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-xs shadow-xs shadow-sky-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>立即生成卡密</span>
                </button>
              </div>
            </div>

            {/* Generated Keys Display Box */}
            {generatedKeys.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-slate-500" />
                    <span>已就绪卡密 ({generatedKeys.length} 个) · 每张支持 2 台设备绑定</span>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyForXianGuanJia}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? '已复制闲管家格式！' : '一键复制(闲管家格式)'}</span>
                    </button>

                    <button
                      onClick={downloadTxtFile}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>导出 TXT 备份</span>
                    </button>
                  </div>
                </div>

                {/* Scrollable Keys Area */}
                <div className="bg-slate-50 text-slate-800 p-4 rounded-2xl font-mono text-xs max-h-56 overflow-y-auto space-y-1 select-all border border-slate-200">
                  {generatedKeys.map((key, idx) => (
                    <div key={idx} className="flex items-center justify-between hover:bg-sky-50/60 px-2 py-1 rounded transition">
                      <span className="text-sky-600 font-bold">{key}</span>
                      <span className="text-[10px] text-slate-500">
                        {keyType === 'JP' ? '日语¥49.9' : '全语种通卡'} · 2设备
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Multi-language Platform Matrix Quick Entry (Admin Only) */}
            <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-sky-950 font-bold">多语种平台矩阵管理（仅管理员可见）</strong>
                  <span className="text-[11px] text-sky-800/80">快捷管理与切换韩语 (KR)、俄语 (RU)、西语 (ES) 独立矩阵站点</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenMultiLangModal) onOpenMultiLangModal();
                }}
                className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition shrink-0 cursor-pointer"
              >
                打开语种矩阵
              </button>
            </div>

            {/* XianGuanJia Operation SOP Guide */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>闲管家自动发货 3 步操作指引：</span>
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600">
                <li>点击上方 <strong>“一键复制(闲管家格式)”</strong>。</li>
                <li>打开闲管家后台 ➡️ 进入 <strong>“虚拟商品管理”</strong> ➡️ 选择对应商品 ➡️ 点击 <strong>“卡密库导入”</strong> 粘贴。</li>
                <li>在发货模板中设置内容：<i>“您的专属学习网址为 jp.cs313.cn，激活码为【卡密】，支持 1台iPad+1台手机同时使用。”</i></li>
              </ol>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
