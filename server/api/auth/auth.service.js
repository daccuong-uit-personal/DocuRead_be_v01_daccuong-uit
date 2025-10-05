const { sqlQuery } = require('../../helpers/sqlQuery');
const { generateToken } = require('../../helpers/generateToken');
const bcrypt = require('bcrypt');

async function login({ email, password }) {
  const userResult = await sqlQuery('SELECT * FROM users WHERE email = ?', [email]);
  if (!userResult.success) return userResult;

  const user = userResult.data[0];
  if (!user)
    return { success: false, code: 404, message: 'Email không tồn tại', data: null };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return { success: false, code: 401, message: 'Sai mật khẩu', data: null };

  const token = generateToken({ id: user.id, email: user.email });

  return {
    success: true,
    code: 200,
    message: 'Đăng nhập thành công',
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status,
      },
    },
  };
}

async function register({ username, email, password }) {
  const exists = await sqlQuery('SELECT id FROM users WHERE email = ?', [email]);
  if (exists.success && exists.data.length > 0) {
    return { success: false, code: 409, message: 'Email đã được đăng ký', data: null };
  }

  const password_hash = await bcrypt.hash(password, 10);

  const result = await sqlQuery(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password_hash]
  );

  if (!result.success) return result;

  return {
    success: true,
    code: 201,
    message: 'Đăng ký tài khoản thành công',
    data: { id: result.data.insertId, username, email },
  };
}

module.exports = { login, register };
