const http = require('node:http');
const url = require('node:url');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const db = require('./db.cjs');

const PORT = process.env.PORT || 3002;
const WEB_PORT = process.env.WEB_PORT || 5174;
const DIST_DIR = path.resolve(__dirname, '../dist');

const MIMES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function getLocalIp() {
  try {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  } catch {}
  return '192.168.50.101';
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// 核心 API 处理器
async function handleApiRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // 1. 处理 CORS 预检请求
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    });
    return res.end();
  }

  try {
    // 2. 路由：健康检查
    if (method === 'GET' && pathname === '/api/health') {
      return sendJson(res, 200, {
        status: 'ok',
        service: 'CS313 Japanese Domestic API Engine',
        version: '2.0.0',
        engine: 'Node.js 22 + SQLite WAL',
        timestamp: new Date().toISOString()
      });
    }

    // 3. 路由：卡密安全核销与设备绑定
    if (method === 'POST' && pathname === '/api/auth/verify-key') {
      const body = await parseBody(req);
      const { cardKey, device } = body;
      if (!cardKey) {
        return sendJson(res, 400, { success: false, message: '请提供激活卡密' });
      }
      const result = db.verifyAndBindCardKey(cardKey, device || {});
      return sendJson(res, result.success ? 200 : 400, result);
    }

    // 4. 路由：学员学习进度双向实时同步
    if (method === 'POST' && pathname === '/api/user/sync') {
      const body = await parseBody(req);
      const { userId, progress } = body;
      if (!userId) {
        return sendJson(res, 400, { success: false, message: '缺少学员唯一标识' });
      }
      const result = db.saveStudentProgress(userId, progress || {});
      return sendJson(res, 200, result);
    }

    // 5. 路由：获取学员最新云端进度
    if (method === 'GET' && pathname === '/api/user/progress') {
      const userId = parsedUrl.query.userId;
      if (!userId) {
        return sendJson(res, 400, { success: false, message: '缺少 userId 参数' });
      }
      const progress = db.getStudentProgress(userId);
      return sendJson(res, 200, { success: true, progress });
    }

    // 6. 路由：真题模考交卷判分与错题存储
    if (method === 'POST' && pathname === '/api/exam/submit') {
      const body = await parseBody(req);
      const result = db.saveExamRecord(body);
      return sendJson(res, 200, result);
    }

    // 7. 路由：获取学员历史答卷列表
    if (method === 'GET' && pathname === '/api/exam/records') {
      const userId = parsedUrl.query.userId;
      const records = db.getExamRecords(userId || 'guest_user');
      return sendJson(res, 200, { success: true, records });
    }

    // 8. 路由：店主后台批量生成新卡密
    if (method === 'POST' && pathname === '/api/admin/generate-keys') {
      const body = await parseBody(req);
      const { count, tier, batchNo, price } = body;
      const result = db.generateBatchCardKeys(
        count || 10,
        tier || 'kr_lifetime',
        batchNo || '2026-BATCH',
        price || 49.9
      );
      return sendJson(res, 200, result);
    }

    // 9. 路由：店主后台实时数据统计大盘
    if (method === 'GET' && pathname === '/api/admin/stats') {
      const stats = db.getAdminStats();
      return sendJson(res, 200, { success: true, stats });
    }

    // 10. 路由：云端新真题与内容增量检测
    if (method === 'GET' && pathname === '/api/updates/check') {
      const sinceVersion = parseInt(parsedUrl.query.sinceVersion || '0', 10);
      const stmt = db.db.prepare('SELECT * FROM dynamic_content_updates WHERE version > ? AND is_published = 1 ORDER BY version ASC');
      const updates = stmt.all(sinceVersion);
      return sendJson(res, 200, {
        success: true,
        count: updates.length,
        updates: updates.map(u => ({ ...u, payload: JSON.parse(u.payload || '{}') }))
      });
    }

    // 404 未知接口
    return sendJson(res, 404, { success: false, message: `Route ${method} ${pathname} not found` });

  } catch (error) {
    console.error('[API Server Error]:', error);
    return sendJson(res, 500, { success: false, message: '服务器内部错误', error: error.message });
  }
}

// 静态资源与前端路由处理
function handleStaticRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. 如果是 API 接口请求，直接转给 API 处理器
  if (pathname.startsWith('/api/')) {
    return handleApiRequest(req, res);
  }

  // 2. 首页与默认文档
  if (pathname === '/' || !pathname) {
    pathname = '/index.html';
  }

  let filePath = path.join(DIST_DIR, pathname);

  // 安全检测：防止目录遍历逃逸
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // SPA 前端路由回退：如果文件不存在或为目录，回退到 index.html
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  try {
    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIMES[ext] || 'application/octet-stream';

    // 支持 Range 请求 (音频/视频流式加载)
    const range = req.headers.range;
    if (range && range.startsWith('bytes=')) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;

      if (start >= stat.size || end >= stat.size) {
        res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
        return res.end();
      }

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });

      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
      });

      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server Error: ' + err.message);
  }
}

// 1. 启动后端独立 API 服务 (Port 3001)
const apiServer = http.createServer(handleApiRequest);
apiServer.listen(PORT, '0.0.0.0', () => {
  console.log(`[CS313 Backend API] Listening on port ${PORT}`);
});

// 2. 启动前端静态网页服务 (Port 5174, 全网卡 0.0.0.0 监听，手机局域网免配即连)
const webServer = http.createServer(handleStaticRequest);
webServer.listen(WEB_PORT, '0.0.0.0', () => {
  const localIp = getLocalIp();
  console.log('================================================================');
  console.log('  🎉 CS313 日语研习社 - 双引擎极速服务就绪 (全网卡 0.0.0.0 开启)');
  console.log(`  💻 电脑浏览器访问:  http://localhost:${WEB_PORT}/`);
  console.log(`  📱 手机局域网访问:  http://${localIp}:${WEB_PORT}/`);
  console.log(`  🎯 考期指南直达:    http://${localIp}:${WEB_PORT}/?modal=exam&tab=scoring`);
  console.log(`  ⚡ 后端数据引擎:    http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('  【手机端打不开的排查方法】：');
  console.log(`  1. 确保手机连接的 Wi-Fi 与电脑连接的 Wi-Fi 是同一个！`);
  console.log(`  2. 手机浏览器直接打开：http://${localIp}:${WEB_PORT}/`);
  console.log('================================================================');
});

// 3. 同时尝试监听 80 默认端口 (方便手机端直接输入 IP 访问，无需输入 :5173 端口号)
try {
  const defaultPortServer = http.createServer(handleStaticRequest);
  defaultPortServer.listen(80, '0.0.0.0', () => {
    const localIp = getLocalIp();
    console.log(`  🌟 80 默认端口已开启！手机直接访问 http://${localIp}/ 即可！`);
  });
  defaultPortServer.on('error', () => {
    // 端口被占用则静默忽略，5173 依然正常服务
  });
} catch {}


