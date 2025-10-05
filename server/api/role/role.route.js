const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middleware/authMiddleware');
const roleController = require('./role.controller');

// CRUD Role
router.post('/getRoles', authMiddleware, roleController.getRoles);
router.post('/getRoleById', authMiddleware, roleController.getRoleById);
router.post('/createRole', authMiddleware, roleController.createRole);
router.post('/updateRole', authMiddleware, roleController.updateRole);
router.post('/deleteRole', authMiddleware, roleController.deleteRole);

module.exports = router;
