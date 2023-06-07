const express = require('express');
const router  = express.Router();
const itemsController = require('../../controllers/items.controller');
const validate = require('../../utils/validations')

router.get('/get/all/items',itemsController.getAllItems);

 router.post('/get/item/by/id',itemsController.getItemsById);

 router.post('/update/item/by/id',validate.verifyJWT,itemsController.updateItmesById);

 router.post('/add/item',itemsController.addItem);

router.post('/delete/item/by/id',itemsController.deleteItemsById);

module.exports = router; 
