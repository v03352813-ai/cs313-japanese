const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/components/AdminKeyGeneratorModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetBroken = `                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    全站强制卡密验证，未激活买家无法进入任何                  <option value="KR">韩语单语种终身卡 (¥49.9)</option>
                  <option value="ALL">全语种黑金通卡 (¥88.8)</option>
                </select>
              </div>`;

const targetReplacement = `                  <p className="text-[11px] text-slate-500 leading-relaxed">
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
                  onChange={(e) => setKeyType(e.target.value as 'KR' | 'ALL')}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                >
                  <option value="KR">韩语单语种终身卡 (¥49.9)</option>
                  <option value="ALL">全语种黑金通卡 (¥88.8)</option>
                </select>
              </div>`;

if (content.includes('全站强制卡密验证，未激活买家无法进入任何')) {
  // Use regex to replace accurately
  const regex = /<p className="text-\[11px\] text-slate-500 leading-relaxed">[\s\S]*?全站强制卡密验证，未激活买家无法进入任何[\s\S]*?<option value="ALL">全语种黑金通卡 \(¥88\.8\)<\/option>\s*<\/select>\s*<\/div>/;
  content = content.replace(regex, targetReplacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully fixed broken JSX in AdminKeyGeneratorModal.tsx!');
} else {
  console.log('Target string not found, inspecting...');
}