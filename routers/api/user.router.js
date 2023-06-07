const express = require('express');
const router  = express.Router();
const validate = require('../../utils/validations')
const controller = require('../../controllers/user.controller');

router.get('/get/all/users',controller.getAllUsers);

router.post('/insert/user',controller.insertData);

router.post('/update/user',validate.verifyJWT,controller.updateUser);

router.post('/get/user/by/id',validate.verifyJWT,controller.getUserById);

router.post('/delete/user/by/id',validate.verifyJWT,controller.deleteUserById);

router.post('/user/login',controller.userLogin);

router.post('/user/forget/password',controller.forgetPassword);

router.post('/user/change/password',validate.verifyJWT,controller.changePassword);

router.post('/user/forget/password2',controller.forgetPassword2);

router.post('/user/forget/password3',controller.forgetPassword3);

module.exports = router;    