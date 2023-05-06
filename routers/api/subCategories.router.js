const express = require('express');
const router  = express.Router();
const subController = require('../../controllers/subCategories.controller');


router.get('/get/allsub_categories',subController.getAllSubAllCategories);

router.post('/add/subCategories',subController.addSubCategories);

router.post('/update/sub_category/by/id',subController.updatesubCategoryById);

router.post('/get/sub_category/by/id',subController.getSubCategoryById);

router.post('/delete/sub_category/by/id',subController.deleteSubCategoryById);

router.get('/get/all/items',subController.getAllItems);





module.exports = router;   