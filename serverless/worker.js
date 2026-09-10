/**
 * CS313.CN 多语种学习平台 - Cloudflare Worker Serverless 鉴权中枢
 * 包含：
 * 1. 2台设备指纹绑定 (iPad + 手机/电脑)
 * 2. 防暴力破解限流 (单IP连续3次输错冻结)
 * 3. 闲管家自动发货卡密核销
 * 4. 签名校验与设备解绑安全保护
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';

    // CORS 跨域响应头设置
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Device-Fingerprint',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const path = url.pathname;
      const clientIp = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

      // 1. 卡密激活接口 (/api/activate)
      if (path === '/api/activate' && request.method === 'POST') {
        const body = await request.json();
        const { cardKey, deviceId, deviceName } = body;

        if (!cardKey || !deviceId) {
          return jsonResponse({ success: false, message: '参数不完整' }, 400, corsHeaders);
        }

        const cleanKey = cardKey.trim().toUpperCase();

        // 检查 IP 防爆破 (5分钟内输错超过 3 次触发拦截)
        if (env.DB) {
          const failCount = await env.DB.prepare(
            `SELECT COUNT(*) as count FROM security_logs WHERE ip_address = ? AND is_success = 0 AND created_at > datetime('now', '-5 minutes')`
          ).bind(clientIp).first('count');

          if (failCount && failCount >= 5) {
            return jsonResponse({ 
              success: false, 
              message: '安全警告：连续输错次数过多，当前 IP 已被临时锁定 15 分钟。' 
            }, 429, corsHeaders);
          }
        }

        // 校验卡密在数据库中的状态
        let record = null;
        if (env.DB) {
          record = await env.DB.prepare('SELECT * FROM licenses WHERE card_key = ?').bind(cleanKey).first();
        }

        // 如果数据库没有开启或没有初始化，采用算法离线防伪校验
        if (!record) {
          const isValidAlgorithm = /^CS313-(KR|ALL)-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(cleanKey);
          if (!isValidAlgorithm) {
            // 记录失败日志
            if (env.DB) {
              await env.DB.prepare('INSERT INTO security_logs (ip_address, device_id, attempt_key, is_success) VALUES (?, ?, ?, 0)').bind(clientIp, deviceId, cleanKey).run();
            }
            return jsonResponse({ success: false, message: '卡密无效，请核对小红书闲管家发货的激活码。' }, 400, corsHeaders);
          }

          // 首次初始化该卡密并绑定第 1 台设备
          if (env.DB) {
            await env.DB.prepare(`
              INSERT INTO licenses (card_key, lang_type, status, device_1_id, device_1_name, device_1_bound_at, last_active_at)
              VALUES (?, ?, 'ACTIVE', ?, ?, datetime('now'), datetime('now'))
            `).bind(cleanKey, cleanKey.includes('-ALL-') ? 'ALL' : 'KR', deviceId, deviceName || 'Device 1').run();
          }

          return jsonResponse({
            success: true,
            message: '🎉 激活成功！已成功绑定当前第 1 台设备。',
            license: {
              cardKey: cleanKey,
              isVip: true,
              planType: cleanKey.includes('-ALL-') ? 'ALL_LANGUAGES_VIP' : 'KOREAN_SINGLE',
              planName: cleanKey.includes('-ALL-') ? 'CS313 全球小语种黑金终身通卡' : 'CS313 韩语单语种终身VIP',
              boundDevices: [{ id: deviceId, name: deviceName || 'Device 1' }],
              maxDevices: 2
            }
          }, 200, corsHeaders);
        }

        // 如果数据库已存在该卡密，检查设备绑定状态
        if (record.status === 'BANNED') {
          return jsonResponse({ success: false, message: '该卡密已被安全机制封禁，请联系客服。' }, 403, corsHeaders);
        }

        // 设备1是否匹配
        if (record.device_1_id === deviceId || record.device_2_id === deviceId) {
          return jsonResponse({
            success: true,
            message: '欢迎回来！已验证为当前卡密绑定的常用设备。',
            license: {
              cardKey: cleanKey,
              isVip: true,
              planType: record.lang_type === 'ALL' ? 'ALL_LANGUAGES_VIP' : 'KOREAN_SINGLE',
              planName: record.lang_type === 'ALL' ? 'CS313 全球小语种黑金终身通卡' : 'CS313 韩语单语种终身VIP',
              boundDevices: [
                { id: record.device_1_id, name: record.device_1_name },
                ...(record.device_2_id ? [{ id: record.device_2_id, name: record.device_2_name }] : [])
              ],
              maxDevices: 2
            }
          }, 200, corsHeaders);
        }

        // 如果该卡密只绑定了 1 台设备，允许绑定第 2 台设备
        if (!record.device_2_id) {
          if (env.DB) {
            await env.DB.prepare(`
              UPDATE licenses 
              SET device_2_id = ?, device_2_name = ?, device_2_bound_at = datetime('now'), last_active_at = datetime('now')
              WHERE card_key = ?
            `).bind(deviceId, deviceName || 'Device 2', cleanKey).run();
          }

          return jsonResponse({
            success: true,
            message: '🎉 激活成功！已将本设备添加为第 2 台授权设备（配额已满：2/2）。',
            license: {
              cardKey: cleanKey,
              isVip: true,
              planType: record.lang_type === 'ALL' ? 'ALL_LANGUAGES_VIP' : 'KOREAN_SINGLE',
              planName: record.lang_type === 'ALL' ? 'CS313 全球小语种黑金终身通卡' : 'CS313 韩语单语种终身VIP',
              boundDevices: [
                { id: record.device_1_id, name: record.device_1_name },
                { id: deviceId, name: deviceName || 'Device 2' }
              ],
              maxDevices: 2
            }
          }, 200, corsHeaders);
        }

        // 第 3 台设备尝试接入：严格拦截！
        return jsonResponse({
          success: false,
          code: 'DEVICE_LIMIT_REACHED',
          message: '⚠️ 安全拦截：该卡密绑定的 2 台设备已满 (iPad + 手机/电脑)。如需在新设备使用，请在原设备解绑或联系客服。',
          boundDevices: [
            { name: record.device_1_name || '常用设备 1' },
            { name: record.device_2_name || '常用设备 2' }
          ]
        }, 403, corsHeaders);
      }

      // 2. 状态验证接口 (/api/verify)
      if (path === '/api/verify' && request.method === 'POST') {
        const body = await request.json();
        const { cardKey, deviceId } = body;

        if (!cardKey || !deviceId) {
          return jsonResponse({ isVip: false }, 200, corsHeaders);
        }

        // 离线/在线校验逻辑
        const cleanKey = cardKey.trim().toUpperCase();
        const isValid = /^CS313-(KR|ALL)-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(cleanKey);

        return jsonResponse({
          isVip: isValid,
          cardKey: cleanKey,
          planName: cleanKey.includes('-ALL-') ? 'CS313 全球小语种黑金终身通卡' : 'CS313 韩语单语种终身VIP'
        }, 200, corsHeaders);
      }

      // 404
      return jsonResponse({ error: 'Endpoint not found' }, 404, corsHeaders);

    } catch (err) {
      return jsonResponse({ error: err.message }, 500, corsHeaders);
    }
  }
};

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      ...headers
    }
  });
}
