const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/reset-password')
  .post(authController.resetPassword);
  
router
  .route('/forgot-password')
  .post(authController.forgotPassword);


router
  .route('/signup')
  .post(authController.signup);

router
  .route('/login')
  .post(authController.login);

router
  .route('/')
  .get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;