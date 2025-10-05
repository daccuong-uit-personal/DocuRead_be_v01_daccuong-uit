const { sqlQuery } = require('../../helpers/sqlQuery');
const { initViewConfig, mergeConfig } = require('../../helpers/viewConfig');
const defaultColumns = require('../../../config/defaultColumn');

/**
 * Lấy danh sách tất cả roles và kèm cấu hình view (nếu có moduleCode)
 */
async function getAllRoles(moduleCode) {
  const roleResult = await sqlQuery('SELECT * FROM roles');
  if (!roleResult.success) return roleResult;
  const roles = roleResult.data;

  // Nếu không có moduleCode => chỉ trả roles
  if (!moduleCode) {
    return { success: true, code: 200, message: 'Lấy danh sách role thành công', data: roles };
  }

  const defaultModule = defaultColumns.find(m => m.code === moduleCode);
  if (!defaultModule) {
    return { success: false, code: 400, message: 'Module không hợp lệ', data: null };
  }

  // Lấy tất cả view_configs 1 lần để tránh N+1 query
  const viewConfigResult = await sqlQuery('SELECT role_id, displayColumns, editColumns FROM view_configs WHERE code=?', [moduleCode]);
  const viewConfigMap = new Map();

  if (viewConfigResult.success) {
    for (const vc of viewConfigResult.data) {
      try {
        viewConfigMap.set(vc.role_id, {
          displayColumns: typeof vc.displayColumns === 'string' ? JSON.parse(vc.displayColumns) : vc.displayColumns,
          editColumns: typeof vc.editColumns === 'string' ? JSON.parse(vc.editColumns) : vc.editColumns,
        });
      } catch (err) {
        console.error(`❌ Lỗi parse JSON cho role_id=${vc.role_id}:`, err);
      }
    }
  }

  // Merge config cho từng role
  const finalRoles = [];
  for (const role of roles) {
    let config = viewConfigMap.get(role.id);

    if (config) {
      config = mergeConfig(defaultModule, config);
    } else {
      config = await initViewConfig(moduleCode, role.id);
    }

    finalRoles.push({ ...role, viewConfig: config });
  }

  return { success: true, code: 200, message: 'Lấy danh sách role thành công', data: finalRoles };
}

/**
 * Lấy role theo ID (và kèm cấu hình view nếu có moduleCode)
 */
async function getRoleById(id, moduleCode) {
  const roleResult = await sqlQuery('SELECT * FROM roles WHERE id=?', [id]);
  if (!roleResult.success) return roleResult;
  if (roleResult.data.length === 0)
    return { success: false, code: 404, message: 'Role không tồn tại', data: null };

  const role = roleResult.data[0];
  let config = null;

  if (moduleCode) {
    const defaultModule = defaultColumns.find(m => m.code === moduleCode);
    if (!defaultModule) {
      return { success: false, code: 400, message: 'Module không hợp lệ', data: null };
    }

    const dbResult = await sqlQuery(
      'SELECT displayColumns, editColumns FROM view_configs WHERE code=? AND role_id=?',
      [moduleCode, id]
    );

    if (dbResult.success && dbResult.data.length > 0) {
      try {
        const dbConfig = {
          displayColumns: typeof dbResult.data[0].displayColumns === 'string'
            ? JSON.parse(dbResult.data[0].displayColumns)
            : dbResult.data[0].displayColumns,
          editColumns: typeof dbResult.data[0].editColumns === 'string'
            ? JSON.parse(dbResult.data[0].editColumns)
            : dbResult.data[0].editColumns,
        };
        config = mergeConfig(defaultModule, dbConfig);
      } catch (err) {
        console.error('❌ Lỗi parse JSON trong getRoleById:', err);
        config = defaultModule;
      }
    } else {
      config = await initViewConfig(moduleCode, id);
    }
  }

  return { success: true, code: 200, message: 'Lấy role thành công', data: { ...role, viewConfig: config } };
}

/**
 * Tạo role mới
 */
async function createRole({ name, description = null }) {
  if (!name) return { success: false, code: 400, message: 'Thiếu tên role', data: null };

  const result = await sqlQuery('INSERT INTO roles (name, description) VALUES (?, ?)', [name, description]);
  if (!result.success) return result;

  return {
    success: true,
    code: 201,
    message: 'Tạo role thành công',
    data: { id: result.data.insertId, name, description },
  };
}

/**
 * Cập nhật role
 */
async function updateRole(id, { name, description = null }) {
  const result = await sqlQuery('UPDATE roles SET name=?, description=? WHERE id=?', [name, description, id]);
  if (!result.success) return result;
  if (result.data.affectedRows === 0)
    return { success: false, code: 404, message: 'Role không tồn tại', data: null };

  return { success: true, code: 200, message: 'Cập nhật role thành công', data: null };
}

/**
 * Xóa role
 */
async function deleteRole(id) {
  const result = await sqlQuery('DELETE FROM roles WHERE id=?', [id]);
  if (!result.success) return result;
  if (result.data.affectedRows === 0)
    return { success: false, code: 404, message: 'Role không tồn tại', data: null };

  return { success: true, code: 200, message: 'Xóa role thành công', data: null };
}

module.exports = { getAllRoles, getRoleById, createRole, updateRole, deleteRole };
