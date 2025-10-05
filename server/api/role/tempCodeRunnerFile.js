const { sqlQuery } = require('../../helpers/sqlQuery');
const { initViewConfig, mergeConfig } = require('../../helpers/viewConfig');
const defaultColumns = require('../../../config/defaultColumn');

async function getAllRoles(moduleCode) {
  const result = await sqlQuery('SELECT * FROM roles');
  if (!result.success) return result;

  const roles = [];
  for (const role of result.data) {
    let config = {};
    if (moduleCode) {
      const dbResult = await sqlQuery(
        'SELECT displayColumns, editColumns FROM view_configs WHERE code=? AND role_id=?',
        [moduleCode, role.id]
      );

      const defaultModule = defaultColumns.find(m => m.code === moduleCode);

      if (dbResult.success && dbResult.data.length > 0) {
        const dbConfig = {
            displayColumns: typeof dbResult.data[0].displayColumns === 'string'
                ? JSON.parse(dbResult.data[0].displayColumns)
                : dbResult.data[0].displayColumns,
            editColumns: typeof dbResult.data[0].editColumns === 'string'
                ? JSON.parse(dbResult.data[0].editColumns)
                : dbResult.data[0].editColumns,
        };
        config = mergeConfig(defaultModule, dbConfig);
      } else {
        config = await initViewConfig(moduleCode, role.id);
      }
    }
    roles.push({ ...role, viewConfig: config });
  }

  return { success: true, code: 200, message: 'Lấy danh sách role thành công', data: roles };
}
async function getRoleById(id, moduleCode) {
  const result = await sqlQuery('SELECT * FROM roles WHERE id=?', [id]);
  if (!result.success) return result;
  if (result.data.length === 0)
    return { success: false, code: 404, message: 'Role không tồn tại', data: null };

  const role = result.data[0];
  let config = {};

  if (moduleCode) {
    const dbResult = await sqlQuery(
      'SELECT displayColumns, editColumns FROM view_configs WHERE code=? AND role_id=?',
      [moduleCode, id]
    );

    const defaultModule = defaultColumns.find(m => m.code === moduleCode);

    if (dbResult.success && dbResult.data.length > 0) {
        const dbConfig = {
            displayColumns: typeof dbResult.data[0].displayColumns === 'string'
                ? JSON.parse(dbResult.data[0].displayColumns)
                : dbResult.data[0].displayColumns,
            editColumns: typeof dbResult.data[0].editColumns === 'string'
                ? JSON.parse(dbResult.data[0].editColumns)
                : dbResult.data[0].editColumns,
        };
      config = mergeConfig(defaultModule, dbConfig);
    } else {
      config = await initViewConfig(moduleCode, id);
    }
  }

  return { success: true, code: 200, message: 'Lấy role thành công', data: { ...role, viewConfig: config } };
}
async function createRole({ name, description }) {
  if (!name) return { success: false, code: 400, message: 'Thiếu tên role', data: null };
  const result = await sqlQuery('INSERT INTO roles (name, description) VALUES (?, ?)', [name, description]);
  if (!result.success) return result;

  return { success: true, code: 201, message: 'Tạo role thành công', data: { id: result.data.insertId, name, description } };
}

async function updateRole(id, { name, description }) {
  const result = await sqlQuery('UPDATE roles SET name=?, description=? WHERE id=?', [name, description, id]);
  if (!result.success) return result;
  if (result.data.affectedRows === 0)
    return { success: false, code: 404, message: 'Role không tồn tại', data: null };

  return { success: true, code: 200, message: 'Cập nhật role thành công', data: null };
}

async function deleteRole(id) {
  const result = await sqlQuery('DELETE FROM roles WHERE id=?', [id]);
  if (!result.success) return result;
  if (result.data.affectedRows === 0)
    return { success: false, code: 404, message: 'Role không tồn tại', data: null };

  return { success: true, code: 200, message: 'Xóa role thành công', data: null };
}

module.exports = { getAllRoles, getRoleById, createRole, updateRole, deleteRole };
