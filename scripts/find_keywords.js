import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const srcDir = path.resolve('d:/小语种学习/cs313-korean/src');
const found = [];

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.json')) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes('小红书') || content.includes('流量密码') || content.includes('变现') || content.includes('小语笔记')) {
      found.push(filePath);
    }
  }
});

fs.writeFileSync('d:/小语种学习/cs313-korean/scripts/found_xiaohongshu.json', JSON.stringify(found, null, 2));
console.log('Files with 小红书 / 变现 keywords:', found);
