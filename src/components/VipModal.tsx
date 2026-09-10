import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  Check, 
  Smartphone, 
  Tablet, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  QrCode,
  ShoppingCart,
  MessageCircle,
  Copy,
  Zap,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { verifyCardKey } from '../data/auth/cardKeys';
import type { LicenseInfo } from '../data/auth/cardKeys';
import { getDeviceFingerprint } from '../utils/fingerprint';
import type { DeviceInfo } from '../utils/fingerprint';
import { api } from '../services/api';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivated: (license: LicenseInfo) => void;
  reason?: string;
}

export const VipModal: React.FC<VipModalProps> = ({ isOpen, onClose, onActivated, reason }) => {
  const [modalTab, setModalTab] = useState<'buy' | 'input'>('buy');
  const [inputKey, setInputKey] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedWeChat, setCopiedWeChat] = useState<boolean>(false);
  const [copiedXianyu, setCopiedXianyu] = useState<boolean>(false);
  const [currentDevice] = useState<DeviceInfo>(() => getDeviceFingerprint());

  const XIANYU_ITEM_ID = '1082513349743';
  const XIANYU_ITEM_URL = `https://h5.m.goofish.com/item?id=${XIANYU_ITEM_ID}`;

  const copyXianyuLink = async () => {
    try {
      await navigator.clipboard.writeText(XIANYU_ITEM_URL);
      setCopiedXianyu(true);
      setTimeout(() => setCopiedXianyu(false), 2500);
    } catch {
      // fallback
    }
  };

  if (!isOpen) return null;

  const handleActivate = async (keyToUse?: string) => {
    const key = (keyToUse || inputKey).trim().toUpperCase();
    if (!key) {
      setErrorMsg('请输入激活卡密');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const result = await api.verifyCardKey(key, currentDevice);
      setIsLoading(false);

      if (result.success && result.license) {
        setSuccessMsg(result.message || '🎉 激活成功！');
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          onActivated(result.license!);
          onClose();
        }, 1500);
      } else {
        setErrorMsg(result.message || '卡密无效');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('网络请求异常，请稍后重试');
    }
  };

  const copyWeChatContact = () => {
    navigator.clipboard.writeText('cs313study');
    setCopiedWeChat(true);
    setTimeout(() => setCopiedWeChat(false), 2000);
  };

  const testKeys = [
    { key: 'CS313-JP-8888-HL3Y', name: '日语终身VIP (¥49.9示范码)' },
    { key: 'CS313-ALL-GOLD-7U7R', name: '全语种黑金卡 (示范码)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header Ribbon (Sky & Indigo theme matching Japanese platform) */}
        <div className="bg-gradient-to-r from-sky-50/90 via-indigo-50/80 to-sky-50/60 p-5 sm:p-6 border-b border-sky-200/70 text-slate-900 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 border border-amber-200/80 flex items-center justify-center text-2xl shadow-xs shrink-0">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900">CS313 日语研习社 · 终身 VIP</h2>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200/60 text-[10px] font-extrabold">
                  终身授权
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                JLPT N5~N1全真考场 + 6,500+分级词库 + 420+文法宝典 + 30部动漫精听 + 2台设备授权
              </p>
            </div>
          </div>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex items-center border-b border-slate-100 bg-slate-50/80 p-1.5 gap-1.5">
          <button
            onClick={() => setModalTab('buy')}
            className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
              modalTab === 'buy'
                ? 'bg-white text-sky-600 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">在线获取卡密 (¥49.9)</span>
          </button>

          <button
            onClick={() => setModalTab('input')}
            className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
              modalTab === 'input'
                ? 'bg-white text-sky-600 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">输入卡密激活</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Specific Trigger Reason / Context Prompt */}
          {reason && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-sky-500/10 border border-sky-200 text-xs text-sky-950 font-bold flex items-center gap-2 shadow-2xs animate-in fade-in duration-200">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{reason}</span>
            </div>
          )}

          {/* TAB 1: Online Purchase Channel for Direct Organic Visitors */}
          {modalTab === 'buy' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Pricing Offer Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-50 border border-sky-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-sky-950 block">【限时特惠 · 日语单语种终身卡】</span>
                    <span className="text-[11px] text-slate-500">一次付费，永久免费更新 · 无二次收费</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 line-through mr-1.5">¥198</span>
                    <span className="text-2xl font-black text-sky-600">¥49.9</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>JLPT 历届全真机考大卷</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>6,500+ 分级核心词库</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>420+ 体系文法与动词变形</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>30 部经典动漫日剧精听</span>
                  </div>
                </div>
              </div>

              {/* Channel 1: Xianyu Official Escrow Purchase Card */}
              <div className="bg-gradient-to-br from-amber-50/90 via-amber-50/60 to-yellow-50/80 p-4 rounded-2xl border-2 border-amber-300 shadow-sm space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-sm">
                      闲
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <span>闲鱼官方担保交易</span>
                        <span className="bg-amber-400/30 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded">24h 自动发卡</span>
                      </h4>
                      <p className="text-[10px] text-amber-800/90 font-medium">阿里平台资金托管 · 假一赔十 · 拍下 10 秒私信发卡</p>
                    </div>
                  </div>
                </div>

                {/* Big Yellow CTA Button: Direct Jump to Xianyu Listing */}
                <a
                  href={XIANYU_ITEM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-sm shadow-md shadow-amber-400/25 transition flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                  <span>前往闲鱼官方拍下 (秒发卡密) →</span>
                </a>

                {/* Secondary helper: Copy Xianyu link & customer service note */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-slate-600 pt-2 border-t border-amber-200/60">
                  <span className="text-[10px] text-slate-500">拍下后闲管家机器人自动在闲鱼私信发送卡密</span>
                  <button
                    onClick={copyXianyuLink}
                    className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer bg-white/70 px-2 py-0.5 rounded-md border border-amber-200"
                  >
                    {copiedXianyu ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedXianyu ? '已复制闲鱼链接！' : '一键复制闲鱼链接'}</span>
                  </button>
                </div>
              </div>

              {/* Switch to manual key input button */}
              <button
                onClick={() => setModalTab('input')}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-700 text-white font-black text-sm shadow-md shadow-sky-500/15 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>输入卡密激活</span>
              </button>

            </div>
          )}

          {/* TAB 2: Card Key Input Form */}
          {modalTab === 'input' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* 2-Device Policy Assurance Card */}
              <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>支持 2 台主力设备同时使用 (如 iPad + 手机)</span>
                  </span>
                  <span className="bg-sky-200/60 text-sky-900 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    防转卖保护
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  当前检测设备：<strong className="text-slate-700 font-semibold">{currentDevice.deviceName}</strong>
                </p>
              </div>

              {/* Input & Activate Form */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    请输入卡密激活码：
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="在此粘贴或输入激活码"
                      value={inputKey}
                      onChange={(e) => {
                        setInputKey(e.target.value.toUpperCase());
                        setErrorMsg('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono tracking-wider focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 uppercase transition font-bold text-slate-900 placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-bold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <button
                  onClick={() => handleActivate()}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-700 text-white font-black text-sm shadow-md shadow-sky-500/20 active:scale-98 transition disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? '正在安全校验中...' : '立即激活 / 恢复本设备 VIP'}
                </button>

                {/* Reassurance Notice: 彻底消除学员误删缓存丢 VIP 的顾虑 */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed space-y-1">
                  <div className="font-bold text-slate-700 flex items-center gap-1">
                    <span>💡 换手机或清理微信缓存了？</span>
                    <span className="text-sky-600">永久质保 · 无需重买</span>
                  </div>
                  <p>
                    输入购买时客服发您的卡密激活码，系统将立即识别并 0 秒恢复终身 VIP 权益及云端做题本，绝不让您重复掏钱。
                  </p>
                </div>
              </div>

              {/* Direct Test Keys Demo (仅在本地开发模式展示，严禁线上普通买家免付激活) */}
              {Boolean((import.meta as any).env?.DEV) && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-400">
                    💡 演示与测试通道（仅供管理员测试，点击一键填入卡密）：
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {testKeys.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputKey(item.key);
                          handleActivate(item.key);
                        }}
                        className="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200/80 hover:border-sky-200 text-[11px] text-slate-700 transition flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <strong className="block font-mono text-sky-600 group-hover:underline">{item.key}</strong>
                          <span className="text-slate-400 text-[10px]">{item.name}</span>
                        </div>
                        <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
