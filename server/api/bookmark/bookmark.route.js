const express = require('express');
const router = express.Router();

// GET /api/bookmark
router.get('/', (req, res) => {
  res.json({ message: 'Danh sách bookmark (sample)' });
});

// GET /api/bookmark/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Chi tiết bookmark id=${id}` });
});

module.exports = router;