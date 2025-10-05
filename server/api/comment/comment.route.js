const express = require('express');
const router = express.Router();

// GET /api/comment
router.get('/', (req, res) => {
  res.json({ message: 'Danh sách comment (sample)' });
});

// GET /api/comment/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Chi tiết comment id=${id}` });
});

module.exports = router;