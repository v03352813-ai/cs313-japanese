import React from 'react';
import { 
  X, 
  Globe2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { CS313_LANGUAGES, LanguageCode } from '../data/languages';

interface MultiLangModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiLangModal: React.FC<MultiLangModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const languages = Object.values(CS313_LANGUAGES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-50 via-indigo-50/50 to-white p-6 sm:p-8 text-slate-900 border-b border-sky-100 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl border border-sky-200">
              🌍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  CS313.CN 全球小语种矩阵架构
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold">
                  一套底座 · 矩阵复用
                </span>
              </div>
              <p className="text-xs text-sm text-slate-600 mt-1">
                同一套高性能交互与防盗版底层，支持日语、韩语、西语、俄语专属二级域名独立直达
              </p>
            </div>
          </div>
        </div>

        {/* Body Cards */}
        <div className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {languages.map((lang) => {
              const isOnline = lang.status === 'ONLINE';
              const isCurrentJapanese = lang.code === 'ja';

              return (
                <div
                  key={lang.code}
                  className={`p-5 rounded-3xl border transition relative overflow-hidden flex flex-col justify-between ${
                    isCurrentJapanese
                      ? 'bg-sky-50/60 border-sky-300 shadow-xs ring-2 ring-sky-500/10'
                      : isOnline
                      ? 'bg-slate-50/80 border-slate-200 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Top flag and name */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                            <span>{lang.brandTitle}</span>
                            {isCurrentJapanese && (
                              <span className="text-[10px] bg-sky-500 text-white px-1.5 py-0.2 rounded font-black">
                                本站
                              </span>
                            )}
                          </h3>
                          <p className="text-[11px] font-mono text-slate-400">
                            {lang.subdomain}
                          </p>
                        </div>
                      </div>

                      {isOnline ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ● 在线运行中
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 text-[10px] font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 数据就绪中
                        </span>
                      )}
                    </div>

                    {/* Exam & Features */}
                    <div className="space-y-1 text-xs text-slate-600">
                      <p className="font-semibold text-slate-800">
                        🎓 考级体系：{lang.examSystem.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {lang.features.vocabCount} · {lang.features.grammarCount}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        🎬 {lang.features.mediaTheme}
                      </p>
                    </div>

                  </div>

                  {/* Bottom Action */}
                  <div className="pt-3 border-t border-slate-200/60 mt-3">
                    {isCurrentJapanese ? (
                      <button
                        onClick={onClose}
                        className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>当前处于日语专区</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    ) : isOnline ? (
                      <button
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.open(`http://${window.location.hostname}:5173/`, '_blank');
                          }
                        }}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>直达{lang.name}独立平台 (5173端口)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2 bg-slate-200 text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed"
                      >
                        语种底座已就绪 · 即将上线
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Multi-language Matrix explanation */}
          <div className="bg-sky-50/80 p-4 rounded-2xl border border-sky-200/80 space-y-1.5 text-xs text-sky-900">
            <h4 className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>多语种矩阵体系：支持双平台物理隔离独立运行与数据互通</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-sky-800">
              日语平台独享 5174 端口，韩语平台独享 5173 端口。两套系统物理隔离，互不干扰影响！
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
