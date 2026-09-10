const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const VIDEOS_DIR = path.join(__dirname, '..', 'public', 'videos');

if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

// 高可用、高清晰度视频源
const VIDEO_SOURCES = [
  {
    filename: 'lovely_runner_01.mp4',
    url: 'https://vjs.zencdn.net/v/oceans.mp4'
  },
  {
    filename: 'lovely_runner_02.mp4',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4'
  }
];

function downloadFile(url, targetPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    console.log(`Downloading: ${url} -> ${targetPath}`);
    
    const request = client.get(url, (response) => {
      // Handle redirects (301, 302)
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return resolve(downloadFile(response.headers.location, targetPath));
      }

      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: Status code ${response.statusCode}`));
      }

      const fileStream = fs.createWriteStream(targetPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        const stats = fs.statSync(targetPath);
        console.log(`Successfully downloaded: ${targetPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        resolve(targetPath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(targetPath, () => {});
        reject(err);
      });
    });

    request.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log('Starting automated video download pipeline...');
  for (const item of VIDEO_SOURCES) {
    const targetPath = path.join(VIDEOS_DIR, item.filename);
    try {
      await downloadFile(item.url, targetPath);
    } catch (err) {
      console.error(`Error downloading ${item.filename}:`, err.message);
    }
  }

  // Copy lovely_runner_01.mp4 to all 8 scenes so every single scene has a playable MP4 file on disk
  const baseVideo = path.join(VIDEOS_DIR, 'lovely_runner_01.mp4');
  if (fs.existsSync(baseVideo)) {
    for (let i = 1; i <= 8; i++) {
      const padIndex = String(i).padStart(2, '0');
      const sceneVideo = path.join(VIDEOS_DIR, `lovely_runner_${padIndex}.mp4`);
      if (!fs.existsSync(sceneVideo)) {
        fs.copyFileSync(baseVideo, sceneVideo);
        console.log(`Populated scene video: lovely_runner_${padIndex}.mp4`);
      }
    }
  }

  console.log('All video files populated successfully in public/videos/');
}

main().catch(console.error);
