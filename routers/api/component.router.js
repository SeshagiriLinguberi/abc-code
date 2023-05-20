const express = require('express');
const router = express.Router();

const componentController = require('../../controllers/component.controller');

router.post('/add/component',componentController.addComponent);

router.post('/update/component',componentController.updateComponent);

router.post('/delete/component',componentController.deleteComponent);

router.get('/get/all/component',componentController.getAllComponents);

module.exports=router;