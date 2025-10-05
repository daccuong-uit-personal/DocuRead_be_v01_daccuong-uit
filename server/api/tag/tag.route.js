const express = require('express');
const router = express.Router();

// GET /api/tag
router.get('/', (req, res) => {
  res.json({ message: 'Danh sách tag (sample)' });
});

// GET /api/tag/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Chi tiết tag id=${id}` });
});

module.exports = router;