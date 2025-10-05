const express = require('express');
const router = express.Router();

// GET /api/rating
router.get('/', (req, res) => {
  res.json({ message: 'Danh sách rating (sample)' });
});

// GET /api/rating/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Chi tiết rating id=${id}` });
});

module.exports = router;