const express = require('express');
const router = express.Router();
const cartContoller = require('../../controllers/cart.controller');
const validate = require('../../utils/common_utils');

router.post('/add/to/cart',validate.verifyJWT,cartContoller.addToCart);
router.post('/update/cart/items',validate.verifyJWT,cartContoller.modifyCartItem);
router.post('/delete/cart/items',validate.verifyJWT,cartContoller.deleteCartItem);
router.get('/get/cart/items',validate.verifyJWT,cartContoller.getCartItem);
router.get('/get/all/cart/users',validate.verifyJWT,cartContoller.getAllCartUsers)
module.exports=router;