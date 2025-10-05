const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/authMiddleware');
const userController = require('./user.controller');

// CRUD
router.get('/getUsers', authMiddleware, userController.getUsers);
router.post('/getUserById', authMiddleware, userController.getUserById);
router.post('/createUser', authMiddleware, userController.createUser);
router.post('/updateUser', authMiddleware, userController.updateUser);
router.post('/deleteUser', authMiddleware, userController.deleteUser);
router.post('/changePassword', authMiddleware, userController.changePassword);

module.exports = router;
