/* ================================================================
   api/_config.js — 共享配置（Vercel Serverless Functions 共用）
   ----------------------------------------------------------------
   ★ 修改密码 / 添加用户只需要改这一个文件 ★
   ================================================================ */

const jwt = require('jsonwebtoken');

// JWT 密钥：Vercel 环境变量 JWT_SECRET，本地回退用默认值
const JWT_SECRET = process.env.JWT_SECRET || 'mbti-personality-test-secret-key-2026-change-me';

// 密码 → 用户标签映射表
// 每个密码对应一个用户标签，不同朋友用不同密码访问
const PASSWORD_MAP = {
  '1357':      '管理员',
  'friend001': '好友A',
  'friend002': '好友B',
  'friend003': '好友C',
};

// JWT 有效期
const JWT_EXPIRES_IN = '7d';

module.exports = { jwt, JWT_SECRET, PASSWORD_MAP, JWT_EXPIRES_IN };
