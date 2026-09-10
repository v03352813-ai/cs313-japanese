-- CS313 云端 Serverless (Cloudflare D1) 数据库表结构
-- 专为 2 台设备绑定、闲管家批量发货与防刷设计

CREATE TABLE IF NOT EXISTS licenses (
    card_key TEXT PRIMARY KEY,             -- 激活码: CS313-KR-XXXX-XXXX
    lang_type TEXT DEFAULT 'KR',           -- 语种: KR(韩语) / ALL(全语种)
    status TEXT DEFAULT 'UNUSED',          -- UNUSED(未激活) / ACTIVE(已激活) / BANNED(已封禁)
    batch_id TEXT,                         -- 批次号 (方便闲管家对账)
    
    -- 2 台设备绑定核心字段
    device_1_id TEXT,                      -- 第 1 台设备指纹 (如 iPad)
    device_1_name TEXT,                    -- 第 1 台设备名称 (如 "iPad Pro 11-inch")
    device_1_bound_at TEXT,                -- 第 1 台绑定时间
    
    device_2_id TEXT,                      -- 第 2 台设备指纹 (如 iPhone / Windows PC)
    device_2_name TEXT,                    -- 第 2 台设备名称
    device_2_bound_at TEXT,                -- 第 2 台绑定时间
    
    max_devices INTEGER DEFAULT 2,         -- 限制最多 2 台设备
    created_at TEXT DEFAULT (datetime('now')),
    last_active_at TEXT,                   -- 最后活跃时间
    unbind_count INTEGER DEFAULT 0         -- 解绑次数 (防恶意频繁换机)
);

-- 防暴力破解尝试日志表
CREATE TABLE IF NOT EXISTS security_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT,
    device_id TEXT,
    attempt_key TEXT,
    is_success INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);
