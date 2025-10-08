const { pool } = require('../../config/db');

async function sqlQuery(sql, params = [], connection = null) {
  try {
    const executor = connection || pool;
    const [rows] = await executor .query(sql, params);
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
async function withTransaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    return { success: false, code: 500, message: error.message };
  } finally {
    connection.release();
  }
}
module.exports = { sqlQuery, withTransaction };
