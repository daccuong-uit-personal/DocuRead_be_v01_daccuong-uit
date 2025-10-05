const { pool } = require('../../config/db');

async function sqlQuery(sql, params = []) {
  try {
    const [rows] = await pool.query(sql, params);
    return {
      success: true,
      code: 200,
      message: 'Query executed successfully',
      data: rows,
    };
  } catch (error) {
    console.error('[SQL ERROR]', error.message);
    return {
      success: false,
      code: 500,
      message: 'Database query failed',
      data: { error: error.message },
    };
  }
}

module.exports = { sqlQuery };
