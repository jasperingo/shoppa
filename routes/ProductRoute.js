
const express = require('express');
const { checkSchema } = require('express-validator');
const ProductController = require('../controllers/ProductController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const ProductPermissionMiddleware = require('../middlewares/permissions/ProductPermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const ProductAddValidation = require('../validation/production/ProductAddValidation');

const router = express.Router();

const controller = new ProductController();

router.post(
  '/add', 
  //AuthMiddleware,
  //ProductPermissionMiddleware,
  checkSchema(ProductAddValidation),
  ValidationMiddleware(),
  controller.add
);

module.exports = router;

