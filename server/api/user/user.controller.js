const userService = require('./user.service');
const { handleError } = require('../../helpers/handleError');
const { validateFields, validateGetUsersQuery } = require('../../helpers/validation');

async function getUsers(req, res) {
  try {
    const { valid, errors } = validateGetUsersQuery(req.query);

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors,
      });
    }

    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      order = 'DESC',
      search = '',
      status,
      email_verified
    } = req.query;

    const filters = {
      page: Number(page),
      limit: Number(limit),
      sortBy,
      order: order.toUpperCase(),
      search,
      status,
      email_verified:
        email_verified === 'true'
          ? true
          : email_verified === 'false'
          ? false
          : undefined,
    };

    const result = await userService.getAllUsers(filters);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi lấy danh sách user');
  }
}

async function getUserById(req, res) {
  try {
    const requiredFields = ['id'];
    const validate = validateFields(req.body, requiredFields);
    if (!validate.success) return res.status(validate.code).json(validate);

    const { id } = req.body;

    const result = await userService.getUserById(id);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi lấy thông tin user');
  }
}


async function createUser(req, res) {
  try {
    const requiredFields = ['username', 'email', 'password'];
    const validate = validateFields(req.body, requiredFields);
    if (!validate.success) return res.status(validate.code).json(validate);
    
    const { username, email, password } = req.body;

    const result = await userService.createUser(username, email, password);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi tạo user');
  }
}

async function updateUser(req, res) {
  try {
    const requiredFields = ['id', 'data'];
    const validate = validateFields(req.body, requiredFields);
    if (!validate.success) return res.status(validate.code).json(validate);

    const { id, data } = req.body;

    const result = await userService.updateUser(id, data);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi cập nhật user');
  }
}

async function deleteUser(req, res) {
  try {
    const requiredFields = ['id'];
    const validate = validateFields(req.body, requiredFields);
    if (!validate.success) return res.status(validate.code).json(validate);

    const { id } = req.body;

    const result = await userService.deleteUser(id);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi xóa user');
  }
}

async function changePassword(req, res) {
  try {
    const requiredFields = ['id', 'oldPassword', 'newPassword'];
    const validate = validateFields(req.body, requiredFields);
    if (!validate.success) return res.status(validate.code).json(validate);

    const { id, oldPassword, newPassword } = req.body;
    const result = await userService.changePassword(id, oldPassword, newPassword);

    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi đổi mật khẩu');
  }
}
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
