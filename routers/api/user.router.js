const express = require('express');
const router  = express.Router();
const controller = require('../../controllers/user.controller');

router.get('/get/all/users',controller.getAllUsers);

router.post('/insert/user',controller.insertData);

router.post('/update/user',controller.updateUser);

router.post('/get/user/by/id',controller.getUserById);

router.post('/delete/user/by/id',controller.deleteUserById);

router.post('/user/login',controller.userLogin);

//router.post('/user/checkin',controller.userLogin2);

router.post('/user/forget/password',controller.forgetPassword);

router.post('/user/change/password',controller.changePassword);

router.post('/user/forget/password2',controller.forgetPassword2);
//router.post('/user/chk',controller.userValidationCheck);

module.exports = router;    