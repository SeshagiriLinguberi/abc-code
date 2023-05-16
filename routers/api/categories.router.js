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

router.get('/get/all/categories/sub_categories/items/by/group',controller.getAllCategoriesSubcategoriesItemsByGroup);
router.post('/upload/image',controller.uploadImage);
router.get('/download/image',controller.downloadImage);
module.exports = router;   