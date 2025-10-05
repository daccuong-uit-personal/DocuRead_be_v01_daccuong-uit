function handleError(err, res, customMessage = 'Lỗi hệ thống') {
  console.error(err);

  return res.status(500).json({
    success: false,
    code: 500,
    message: customMessage,
    data: { error: err.message || err },
  });
}

module.exports = { handleError };