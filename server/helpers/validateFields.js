function validateFields(data, requiredFields = []) {
  // Nếu không có body
  if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
    return {
      success: false,
      code: 400,
      message: 'Body không được để trống',
      data: null,
    };
  }

  // Hàm kiểm tra từng field (hỗ trợ nested)
  const checkField = (obj, path) => {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      if (current == null || typeof current !== 'object' || !(key in current)) return false;
      current = current[key];
    }
    // Nếu null, undefined hoặc chuỗi rỗng
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

module.exports = { validateFields };