const bcrypt = require('bcrypt');
const { sqlQuery } = require('../../helpers/sqlQuery');

async function getAllUsers({ page = 1, limit = 10, sortBy = 'created_at', order = 'DESC', search = '', status, email_verified }) {
  // ép kiểu và chuẩn hóa dữ liệu
  page = Number(page);
  limit = Number(limit);
  order = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  let whereClauses = [`status != 'inactive'`];
  let values = [];

  // nếu có filter search
  if (search) {
    whereClauses.push(`(username LIKE ? OR email LIKE ?)`);
    values.push(`%${search}%`, `%${search}%`);
  }

  if (status) {
    whereClauses.push(`status = ?`);
    values.push(status);
  }

  if (email_verified !== undefined) {
    whereClauses.push(`is_email_verified = ?`);
    values.push(email_verified ? 1 : 0);
  }

  const where = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // tính offset cho phân trang
  const offset = (page - 1) * limit;

  // đếm tổng số user
  const countQuery = `SELECT COUNT(*) AS total FROM users ${where}`;
  const countResult = await sqlQuery(countQuery, values);
  if (!countResult.success) return countResult;

  const total = countResult.data[0].total;
  const totalPages = Math.ceil(total / limit);

  // query lấy danh sách user
  const dataQuery = `
    SELECT
      u.id, u.username, u.email, u.status, u.is_email_verified,
      u.created_at, u.updated_at,
      up.display_name, up.avatar_url, up.bio, up.language, up.preferences
    FROM users u
    LEFT JOIN user_profiles up ON u.id = up.user_id
    ${where}
    ORDER BY ${sortBy} ${order === 'ASC' ? 'ASC' : 'DESC'}
    LIMIT ? OFFSET ?
  `;

  const dataValues = [...values, limit, offset];
  const dataResult = await sqlQuery(dataQuery, dataValues);
  if (!dataResult.success) return dataResult;

  return {
    success: true,
    code: 200,
    message: 'Lấy danh sách user thành công',
    data: {
      pagination: {
        total,
        totalPages,
        page,
        limit,
      },
      filters: { status, email_verified },
      sort: { by: sortBy, order },
      search,
      users: dataResult.data,
    },
  };
}

async function getUserById(id) {
  if (!id)
    return { success: false, code: 400, message: 'Thiếu user ID', data: null };

  const result = await sqlQuery('SELECT * FROM users WHERE id = ?', [id]);
  if (!result.success) return result;

  const user = result.data[0];
  if (!user)
    return { success: false, code: 404, message: 'Không tìm thấy user', data: null };

  return { success: true, code: 200, message: 'Lấy user thành công', data: user };
}

async function createUser({ username, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await sqlQuery(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );

  if (!result.success) return result;

  return {
    success: true,
    code: 201,
    message: 'Tạo user thành công',
    data: { id: result.data.insertId, username, email },
  };
}

async function updateUser(id, { username, email, status }) {
  const result = await sqlQuery(
    'UPDATE users SET username=?, email=?, status=? WHERE id=?',
    [username, email, status, id]
  );

  if (!result.success) return result;
  if (result.data.affectedRows === 0)
    return { success: false, code: 404, message: 'User không tồn tại', data: null };

  return { success: true, code: 200, message: 'Cập nhật user thành công', data: null };
}

async function deleteUser(id) {
  const result = await sqlQuery('UPDATE users SET status="inactive" WHERE id=?', [id]);

  if (!result.success) return result;
  if (result.data.affectedRows === 0)
    return { success: false, code: 404, message: 'User không tồn tại', data: null };

  return { success: true, code: 200, message: 'Đã vô hiệu hóa user', data: null };
}

async function changePassword(id, oldPassword, newPassword) {
  const userResult = await sqlQuery('SELECT * FROM users WHERE id = ?', [id]);
  if (!userResult.success) return userResult;

  const user = userResult.data[0];
  if (!user)
    return { success: false, code: 404, message: 'User không tồn tại', data: null };

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch)
    return { success: false, code: 401, message: 'Mật khẩu cũ không đúng', data: null };

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updateResult = await sqlQuery('UPDATE users SET password=? WHERE id=?', [
    hashedPassword,
    id,
  ]);

  if (!updateResult.success) return updateResult;

  return {
    success: true,
    code: 200,
    message: 'Đổi mật khẩu thành công',
    data: null,
  };
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
