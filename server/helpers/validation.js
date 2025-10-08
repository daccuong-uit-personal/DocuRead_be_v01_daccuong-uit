function validateFields(data, requiredFields = []) {
  if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
    return {
      success: false,
      code: 400,
      message: 'Body không được để trống',
      data: null,
    };
  }

  const checkField = (obj, path) => {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      if (current == null || typeof current !== 'object' || !(key in current)) return false;
      current = current[key];
    }
    return !(current == null || (typeof current === 'string' && current.trim() === ''));
  };

  const missing = [];

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      requiredFields.forEach((field) => {
        if (!checkField(item, field)) missing.push(`[${index}].${field}`);
      });
    });
  } else {
    requiredFields.forEach((field) => {
      if (!checkField(data, field)) missing.push(field);
    });
  }

  if (missing.length > 0) {
    return {
      success: false,
      code: 400,
      message: `Thiếu các trường bắt buộc: ${missing.join(', ')}`,
      data: { missing },
    };
  }

  return {
    success: true,
    code: 200,
    message: 'Dữ liệu hợp lệ',
    data: null,
  };
}

function validateGetUsersQuery(query) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'created_at',
    order = 'DESC',
    email_verified,
  } = query;

  const errors = {};

  // validate pagination
  const paginationErrors = validatePagination({ page, limit });
  if (Object.keys(paginationErrors).length > 0) {
    Object.assign(errors, paginationErrors);
  }

  // sortBy
  if (!isAllowedField(sortBy, ['created_at', 'username', 'email'])) {
    errors.sortBy = 'sortBy không hợp lệ';
  }

  // order
  if (!isSortOrder(order)) {
    errors.order = 'order chỉ có thể là ASC hoặc DESC';
  }

  // email_verified
  if (email_verified !== undefined && !isBooleanString(email_verified)) {
    errors.email_verified = 'email_verified chỉ có thể là true hoặc false';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = {
  validateFields,
  validateGetUsersQuery,
};