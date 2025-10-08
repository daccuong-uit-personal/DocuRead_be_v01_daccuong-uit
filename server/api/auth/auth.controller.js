const { validateFields } = require('../../helpers/validation');
const { handleError } = require('../../helpers/handleError');
const authService = require('./auth.service');

async function login(req, res) {
  try {
    const requiredFields = ['email', 'password'];
    const validate = validateFields(req.body, requiredFields);
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
    const requiredFields = ['username', 'email', 'password'];
    const validate = validateFields(req.body, requiredFields);
    if (!validate.success) return res.status(validate.code).json(validate);

    const { username, email, password } = req.body;

    const result = await authService.register(username, email, password);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi đăng ký');
  }
}

module.exports = { login, register };
