const roleService = require('./role.service');
const { handleError } = require('../../helpers/handleError');
const { validateFields } = require('../../helpers/validateFields');

async function getRoles(req, res) {
  try {
    const { code } = req.body || {};
    const result = await roleService.getAllRoles(code);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi lấy danh sách role');
  }
}

async function getRoleById(req, res) {
  try {
    const { id, code } = req.body;
    if (!id) return res.status(400).json({ success: false, code: 400, message: 'Thiếu ID' });

    const result = await roleService.getRoleById(id, code);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi lấy role');
  }
}

async function createRole(req, res) {
  try {
    const validate = validateFields(req.body, ['name']);
    if (!validate.success) return res.status(validate.code).json(validate);

    const result = await roleService.createRole(req.body);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi tạo role');
  }
}

async function updateRole(req, res) {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, code: 400, message: 'Thiếu ID' });

    const result = await roleService.updateRole(id, req.body);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi cập nhật role');
  }
}

async function deleteRole(req, res) {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, code: 400, message: 'Thiếu ID' });

    const result = await roleService.deleteRole(id);
    res.status(result.code).json(result);
  } catch (err) {
    handleError(err, res, 'Lỗi hệ thống khi xóa role');
  }
}

module.exports = { getRoles, getRoleById, createRole, updateRole, deleteRole };
