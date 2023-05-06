const express = require('express');
const router  = express.Router();
const controller = require('../../controllers/category.controller');

router.get('/get/allCategories',controller.getAllCategories);

router.post('/insert/categories',controller.insertData);

router.post('/update/category/by/id',controller.updateCategoryById);

router.post('/get/category/by/id',controller.getCategoryById);

router.post('/delete/category/by/id',controller.deleteCategoryById);

router.get('/get/all/sub_categories',controller.getAllSubCategories);

router.get('/get/all/sub_categories/by/group',controller.getAllSubCategoriesBYGroup);
module.exports = router;   