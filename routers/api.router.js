const express = require('express');
const router = express.Router();
const user = require('./api/user.router');
const categories = require('./api/categories.router');
const subCategories = require('./api/subCategories.router');
const items = require('./api/items.router');
router.use('/user',user);
router.use('/categories',categories);
router.use('/subcategory',subCategories)
router.use('/items',items);


module.exports= router;