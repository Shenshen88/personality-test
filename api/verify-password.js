/* ================================================================
   api/verify-password.js — 密码验证 + JWT 签发（Vercel Serverless）
   ----------------------------------------------------------------
   POST /api/verify-password
   请求体: { "password": "1357" }
   成功:  { "success": true, "token": "eyJ...", "userTag": "管理员" }
   失败:  { "success": false, "message": "密码不正确" }
   ================================================================ */

const { jwt, JWT_SECRET, PASSWORD_MAP, JWT_EXPIRES_IN } = require('./_config');

module.exports = async (req, res) => {
  // 仅允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { password } = req.body;

  // 参数校验
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: '请输入密码' });
  }

  // 查找密码对应的用户标签
  const userTag = PASSWORD_MAP[password];

  if (!userTag) {
    return res.status(401).json({ success: false, message: '密码不正确' });
  }

  // 密码正确 → 签发 JWT
  const token = jwt.sign(
    { userTag },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.json({ success: true, token, userTag });
};
