const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();

router
  .route('/signup')
  .post(userController.signup);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
