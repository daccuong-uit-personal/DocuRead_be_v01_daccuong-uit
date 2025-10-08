const bcrypt = require('bcrypt');
const { sqlQuery, withTransaction } = require('../../helpers/sqlQuery');

async function getAllUsers({ page, limit, sortBy, order, search, status, email_verified }) {
  let whereClauses = [`status != 'inactive'`];
  let values = [];

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
  const offset = (page - 1) * limit;

  const countQuery = `SELECT COUNT(*) AS total FROM users ${where}`;
  const countResult = await sqlQuery(countQuery, values);
  if (!countResult.success) return countResult;

  const total = countResult.data[0].total;
  const totalPages = Math.ceil(total / limit);

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
  const ids = Array.isArray(id) ? id : [id];

  if (ids.length === 0) {
    return {
      success: false,
      code: 400,
      message: 'Danh sách ID không hợp lệ',
      data: null,
    };
  }

  const placeholders = ids.map(() => '?').join(', ');

  const query = `
    SELECT 
      u.id,
      u.username,
      u.email,
      u.status,
      u.is_email_verified,
      u.created_at,
      u.updated_at,
      p.display_name,
      p.avatar_url,
      p.bio,
      p.language,
      p.preferences
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE u.id IN (${placeholders})
  `;
  
  const result = await sqlQuery(query, ids);
  if (!result.success) return result;

  if (result.data.length === 0) {
    return { success: false, code: 404, message: 'Không tìm thấy user', data: [] };
  }

  return {
    success: true,
    code: 200,
    message: 'Lấy user thành công',
    data: Array.isArray(id) ? result.data : result.data[0],
  };
}

async function createUser(username, email, password) {
  return await withTransaction(async (connection) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await sqlQuery(
      'INSERT INTO users (username, email, password, status, is_email_verified) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, 'active', false],
      connection
    );
    if (!userResult.success) return userResult;

    const userId = userResult.data.insertId;

    const defaultProfile = {
      display_name: username,
      avatar_url: null,
      bio: '',
      language: 'vi',
      preferences: JSON.stringify({
        theme: 'light',
        fontSize: 'medium',
      }),
    };

    const profileResult = await sqlQuery(
      `
      INSERT INTO user_profiles 
        (user_id, display_name, avatar_url, bio, language, preferences)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        defaultProfile.display_name,
        defaultProfile.avatar_url,
        defaultProfile.bio,
        defaultProfile.language,
        defaultProfile.preferences,
      ],
      connection
    );

    if (!profileResult.success) return profileResult;

    return {
      success: true,
      code: 201,
      message: 'Tạo user thành công',
      data: { id: userResult.data.insertId, username, email },
    };
  });
}

async function updateUser(id, data) {
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
