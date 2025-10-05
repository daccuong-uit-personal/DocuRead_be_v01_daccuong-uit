const userService = require('./user.service');
const { handleError } = require('../../helpers/handleError');
const { validateFields } = require('../../helpers/validateFields');

async function getUsers(req, res) {
  try {
    const result = await userService.getAllUsers(req.query);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi lấy danh sách user');
  }
}

async function getUserById(req, res) {
  try {
    const validate = validateFields(req.body, ['id']);
    if (!validate.success) return res.status(validate.code).json(validate);

    const result = await userService.getUserById(req.body.id);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi lấy thông tin user');
  }
}


async function createUser(req, res) {
  try {
    const validate = validateFields(req.body, ['username', 'email', 'password']);
    if (!validate.success) return res.status(validate.code).json(validate);

    const result = await userService.createUser(req.body);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi tạo user');
  }
}

async function updateUser(req, res) {
  try {
    const validate = validateFields(req.body, ['id']);
    if (!validate.success) return res.status(validate.code).json(validate);

    const result = await userService.updateUser(req.body.id, req.body);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi cập nhật user');
  }
}

async function deleteUser(req, res) {
  try {
    const validate = validateFields(req.body, ['id']);
    if (!validate.success) return res.status(validate.code).json(validate);

    const result = await userService.deleteUser(req.body.id);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi xóa user');
  }
}

async function changePassword(req, res) {
  try {
    const validate = validateFields(req.body, ['id', 'oldPassword', 'newPassword']);
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
