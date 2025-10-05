const express = require('express');
const router = express.Router();

// GET /api/chapter
router.get('/', (req, res) => {
  res.json({ message: 'Danh sách chapter (sample)' });
});

// GET /api/chapter/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Chi tiết chapter id=${id}` });
});

module.exports = router;