const { validateFields } = require('../../helpers/validateFields');
const { handleError } = require('../../helpers/handleError');
const authService = require('./auth.service');

async function login(req, res) {
  try {
    const validate = validateFields(req.body, ['email', 'password']);
    if (!validate.success) return res.status(validate.code).json(validate);

    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi đăng nhập');
  }
}

async function register(req, res) {
  try {
    const validate = validateFields(req.body, ['username', 'email', 'password']);
    if (!validate.success) return res.status(validate.code).json(validate);

    const result = await authService.register(req.body);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi đăng ký');
  }
}

module.exports = { login, register };
