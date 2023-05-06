const express = require('express');
const router  = express.Router();
const itemsController = require('../../controllers/items.controller');

router.get('/get/all/items',itemsController.getAllItems);

 router.post('/get/item/by/id',itemsController.getItemsById);

 router.post('/update/item/by/id',itemsController.updateItmesById);

 router.post('/add/all/items',itemsController.addItems);

router.post('/delete/item/by/id',itemsController.deleteItemsById);

module.exports = router; 
