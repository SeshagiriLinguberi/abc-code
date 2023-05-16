const express = require('express');
const router = express.Router();

const componentController = require('../../controllers/component.controller');

router.post('/add/component',componentController.addComponent);

module.exports=router;