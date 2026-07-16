/* ================================================================
   api/me.js — JWT 验证，返回用户标签（Vercel Serverless）
   ----------------------------------------------------------------
   GET /api/me
   请求头: Authorization: Bearer <token>
   成功:  { "success": true, "userTag": "管理员" }
   失败:  { "success": false, "message": "认证已过期，请重新输入密码" }
   ================================================================ */

const { jwt, JWT_SECRET } = require('./_config');

module.exports = async (req, res) => {
  // 仅允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // 从 Authorization 头提取 token
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '未提供认证信息' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, userTag: decoded.userTag });
  } catch (err) {
    res.status(401).json({ success: false, message: '认证已过期，请重新输入密码' });
  }
};
