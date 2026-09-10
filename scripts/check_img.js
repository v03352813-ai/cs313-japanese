import fs from 'fs';
import path from 'path';

const imgPath = path.resolve('d:/小语种学习/frame_0825.jpg');
const buf = fs.readFileSync(imgPath);

for (let i = 0; i < buf.length - 8; i++) {
  if (buf[i] === 0xFF && (buf[i+1] === 0xC0 || buf[i+1] === 0xC2)) {
    const height = buf.readUInt16BE(i + 5);
    const width = buf.readUInt16BE(i + 7);
    fs.writeFileSync('d:/小语种学习/cs313-korean/scripts/size_output.txt', `Dimensions: ${width}x${height}`);
    console.log(`Dimensions: ${width}x${height}`);
    break;
  }
}
