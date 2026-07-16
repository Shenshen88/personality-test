/* ================================================================
   server.js — 性格测试网站后端服务器
   ----------------------------------------------------------------
   功能：
   1. 提供静态文件服务（index.html 等）
   2. POST /api/verify-password — 密码验证 + JWT 签发
   3. GET  /api/me              — JWT 验证，返回用户标签
   ================================================================ */

const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

/* ================================================================
   配置区 — 修改这里即可自定义
   ================================================================ */

// JWT 密钥：用于签发和验证 token
// 本地开发用默认值；部署到 Render 时通过环境变量 JWT_SECRET 设置
const JWT_SECRET = process.env.JWT_SECRET || 'mbti-personality-test-secret-key-2026-change-me';

// 密码 → 用户标签映射表
// 每个密码对应一个用户标签，不同朋友用不同密码访问
// ★ 在这里添加 / 修改密码和标签 ★
const PASSWORD_MAP = {
  '1357':      '管理员',
  'friend001': '好友A',
  'friend002': '好友B',
  'friend003': '好友C',
};

// JWT 有效期
const JWT_EXPIRES_IN = '7d';

/* ================================================================
   中间件
   ================================================================ */

// 解析 JSON 请求体
app.use(express.json());

// 提供静态文件服务（index.html、图片等）
app.use(express.static(__dirname));

/* ================================================================
   API 路由
   ================================================================ */

/**
 * POST /api/verify-password
 * 验证密码，成功则签发 JWT
 *
 * 请求体: { "password": "1357" }
 * 成功响应: { "success": true, "token": "eyJ...", "userTag": "管理员" }
 * 失败响应: { "success": false, "message": "密码不正确" }
 */
app.post('/api/verify-password', (req, res) => {
  const { password } = req.body;

  // 参数校验
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: '请输入密码' });
  }

  // 查找密码对应的用户标签
  const userTag = PASSWORD_MAP[password];

  if (!userTag) {
    // 密码不匹配 — 返回 401
    return res.status(401).json({ success: false, message: '密码不正确' });
  }

  // 密码正确 → 签发 JWT
  const token = jwt.sign(
    { userTag },           // payload：只存用户标签，不存密码
    JWT_SECRET,            // 密钥
    { expiresIn: JWT_EXPIRES_IN }  // 有效期 7 天
  );

  // 返回 token 和用户标签
  res.json({
    success: true,
    token,
    userTag
  });
});

/**
 * GET /api/me
 * 验证 JWT，返回用户标签
 *
 * 请求头: Authorization: Bearer <token>
 * 成功响应: { "success": true, "userTag": "管理员" }
 * 失败响应: { "success": false, "message": "Token 无效或已过期" }
 */
app.get('/api/me', (req, res) => {
  // 从 Authorization 头提取 token
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '未提供认证信息' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 验证 JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, userTag: decoded.userTag });
  } catch (err) {
    // token 无效或过期
    res.status(401).json({ success: false, message: '认证已过期，请重新输入密码' });
  }
});

/* ================================================================
   启动服务器
   ================================================================ */

app.listen(PORT, () => {
  console.log('========================================');
  console.log('  性格测试服务器已启动');
  console.log(`  地址: http://localhost:${PORT}`);
  console.log(`  密码数量: ${Object.keys(PASSWORD_MAP).length} 个`);
  console.log('========================================');
});
