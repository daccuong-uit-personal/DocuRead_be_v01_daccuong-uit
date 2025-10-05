const express = require('express');
const router = express.Router();

// GET /api/book
router.get('/', (req, res) => {
  res.json({ message: 'Danh sách book (sample)' });
});

// GET /api/book/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Chi tiết book id=${id}` });
});

module.exports = router;