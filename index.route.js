const express = require('express');
const router = express.Router();

const userRoutes = require('./server/api/user/user.route');
router.use('/users', userRoutes);

const bookRoutes = require('./server/api/book/book.route');
router.use('/books', bookRoutes);

const chapterRoutes = require('./server/api/chapter/chapter.route');
router.use('/chapters', chapterRoutes);

const bookmarkRoutes = require('./server/api/bookmark/bookmark.route');
router.use('/bookmarks', bookmarkRoutes);

const tagRoutes = require('./server/api/tag/tag.route');
router.use('/tags', tagRoutes);

const ratingRoutes = require('./server/api/rating/rating.route');
router.use('/ratings', ratingRoutes);

const commentRoutes = require('./server/api/comment/comment.route');
router.use('/comments', commentRoutes);

const authRoutes = require('./server/api/auth/auth.route');
router.use('/auth', authRoutes);

module.exports = router;
