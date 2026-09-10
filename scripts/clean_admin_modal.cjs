const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/components/AdminKeyGeneratorModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The clean Generated Keys Display Box
const cleanBox = `            {/* Generated Keys Display Box */}
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
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
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
                <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs max-h-56 overflow-y-auto space-y-1 select-all border border-slate-800">
                  {generatedKeys.map((key, idx) => (
                    <div key={idx} className="flex items-center justify-between hover:bg-slate-800/80 px-2 py-1 rounded">
                      <span className="text-amber-300 font-bold">{key}</span>
                      <span className="text-[10px] text-slate-400">
                        {keyType === 'KR' ? '韩语¥49.9' : '全语种通卡'} · 2设备
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}`;

// Replace the whole area from {/* Generated Keys Display Box */} up to {/* Multi-language Platform Matrix Quick Entry
const startIdx = content.indexOf('{/* Generated Keys Display Box */}');
const endIdx = content.indexOf('{/* Multi-language Platform Matrix Quick Entry (Admin Only) */}');

if (startIdx !== -1 && endIdx !== -1) {
  content = content.slice(0, startIdx) + cleanBox + '\n\n            ' + content.slice(endIdx);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully cleaned Generated Keys block in AdminKeyGeneratorModal.tsx!');
} else {
  console.log('Indexes not found:', startIdx, endIdx);
}