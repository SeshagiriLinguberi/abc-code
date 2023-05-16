const express = require('express');
const router = express.Router();
const roleControls = require('../../controllers/role.controller');

router.post('/add/roles',roleControls.addRole);

router.get('/get/roles',roleControls.getRoles);

router.post('/update/roles',roleControls.updateRoles);

router.post('/delete/roles',roleControls.deleteRoles)
module.exports=router;