const { sqlQuery } = require('./sqlQuery');
const defaultColumns = require('../../config/defaultColumn');

function getDefaultConfig(moduleCode) {
  const moduleObj = defaultColumns.find(m => m.code === moduleCode);
  if (!moduleObj) return null;

  return {
    code: moduleObj.code,
    name: moduleObj.name,
    displayColumns: moduleObj.displayColumns || [],
    editColumns: moduleObj.editColumns || [],
  };
}

async function initViewConfig(moduleCode, roleId) {
  const defaultConfig = getDefaultConfig(moduleCode);
  if (!defaultConfig) return null;

  const displayStr = JSON.stringify(defaultConfig.displayColumns);
  const editStr = JSON.stringify(defaultConfig.editColumns);

  try {
    const result = await sqlQuery(
      `INSERT INTO view_configs (code, name, role_id, displayColumns, editColumns)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         displayColumns = VALUES(displayColumns),
         editColumns = VALUES(editColumns),
         updated_at = CURRENT_TIMESTAMP`,
      [moduleCode, defaultConfig.name, roleId, displayStr, editStr]
    );

    if (!result.success) {
      console.error('❌ Lỗi khi init view_config:', result.message);
      return null;
    }

    return { ...defaultConfig, role_id: roleId };
  } catch (error) {
    console.error('❌ Lỗi SQL khi khởi tạo view config:', error);
    return null;
  }
}

function mergeConfig(defaultConfig, dbConfig) {
  if (!defaultConfig) return dbConfig || null;
  if (!dbConfig) return defaultConfig;

  const safeArray = arr => (Array.isArray(arr) ? arr : []);

  const merged = {
    ...defaultConfig,
    displayColumns: defaultConfig.displayColumns.map(dc => {
      const match = safeArray(dbConfig.displayColumns).find(d => d.name === dc.name);
      return match ? { ...dc, ...match } : dc;
    }),
    editColumns: defaultConfig.editColumns.map(ec => {
      const match = safeArray(dbConfig.editColumns).find(d => d.name === ec.name);
      return match ? { ...ec, ...match } : ec;
    }),
  };

  return merged;
}

async function initAllViewConfig(modules = [], roles = []) {
  if (!Array.isArray(modules) || !Array.isArray(roles)) {
    console.error('❌ modules hoặc roles không hợp lệ.');
    return;
  }

  for (const role of roles) {
    for (const moduleCode of modules) {
      await initViewConfig(moduleCode, role.id);
    }
  }
}

module.exports = {
  getDefaultConfig,
  initViewConfig,
  mergeConfig,
  initAllViewConfig,
};
