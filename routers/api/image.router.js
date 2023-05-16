const express = require('express');
const router  = express.Router();
const itemsController = require('../../controllers/image.controller');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/upload',upload.single('image'),itemsController.uploadImage)

module.exports=router;