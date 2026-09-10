import { getDbStatus, getAnalyticsSummary } from '../lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const [dbStatus, analytics] = await Promise.all([
    getDbStatus(),
    getAnalyticsSummary()
  ]);

  return res.status(200).json({
    success: true,
    stats: {
      totalCards: 200,
      activeStudents: Math.max(dbStatus.activeLicensesCount, analytics.activeLicenses || 1),
      totalExams: 56,
      activationRate: '100%',
      serviceStatus: 'Online (Vercel Serverless Edge)',
      dbDriver: dbStatus.driver,
      dbStatus: dbStatus.status,
      maxDevicesPolicy: dbStatus.maxDevicesPolicy,
      icpRequired: false,
      
      // 访问与转化率数据
      totalPV: analytics.totalPV,
      todayPV: analytics.todayPV,
      totalUV: analytics.totalUV,
      todayUV: analytics.todayUV,
      vipIntentCount: analytics.vipIntentCount,
      conversionRate: analytics.conversionRate,
      intentRate: analytics.intentRate,
      deviceBreakdown: analytics.deviceBreakdown
    }
  });
}
