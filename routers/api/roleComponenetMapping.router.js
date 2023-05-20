const express = require('express');
const router = express.Router();

const roleComponentMappingController = require('../../controllers/roleComponentMapping.controller');

router.post('/insert/componentMapping',roleComponentMappingController.insertRoleComponentMapping);

router.post('/update/componentMapping',roleComponentMappingController.updateRoleComponentMapping);

router.post('/delete/componentMapping',roleComponentMappingController.deleteRoleComponentMapping);

router.post('/get/all/componentMapping',roleComponentMappingController.getAllRoleComponentMapping);


module.exports = router;

