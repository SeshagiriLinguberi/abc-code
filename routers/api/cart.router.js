const express = require('express');
const router = express.Router();
const cartContoller = require('../../controllers/cart.controller');
const validate = require('../../utils/validations');

router.post('/add/to/cart',cartContoller.addToCart);
router.post('/update/cart/items',cartContoller.modifyCartItem);
router.post('/delete/cart/items',cartContoller.deleteCartItem);
router.get('/get/cart/items',cartContoller.getCartItem);
router.get('/get/all/cart/users',cartContoller.getAllCartUsers)
module.exports=router;