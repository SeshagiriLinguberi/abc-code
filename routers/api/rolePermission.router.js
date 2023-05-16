const express = require('express');
const   router = express.Router();

const rolePermissionController = require('../../controllers/rolePermission.controller');

router.post('/add/rolePermission',rolePermissionController.addRolePermission);

router.post('/update/rolePermission',rolePermissionController.updateRolePermission);

router.post('/delete/rolePermission',rolePermissionController.deleteRolePermission);

router.get('/get/rolePermission',rolePermissionController.getRolePermission);

router.post('/login/rolePermission',rolePermissionController.loginRolePermission);

module.exports = router;