
const express = require('express');
const { checkSchema } = require('express-validator');
const ProductVariantController = require('../controllers/ProductVariantController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const ProductVariantFetchMiddleware = require('../middlewares/fetch/ProductVariantFetchMiddleware');
const ProductVariantCreatePermissionMiddleware = require('../middlewares/permissions/product/ProductVariantCreatePermissionMiddleware');
const ProductVariantUpdatePermissionMiddleware = require('../middlewares/permissions/product/ProductVariantUpdatePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const ProductVariantCreateValidation = require('../validation/product/ProductVariantCreateValidation');
const ProductVariantUpdateValidation = require('../validation/product/ProductVariantUpdateValidation');

const router = express.Router();

const controller = new ProductVariantController();

router.post(
  '/create',
  AuthMiddleware,
  ProductVariantCreatePermissionMiddleware,
  checkSchema(ProductVariantCreateValidation),
  ValidationMiddleware(),
  controller.create
);

router.put(
  '/:id(\\d+)/update',
  ProductVariantFetchMiddleware,
  AuthMiddleware,
  ProductVariantUpdatePermissionMiddleware,
  checkSchema(ProductVariantUpdateValidation),
  ValidationMiddleware(),
  controller.update
);

router.delete(
  '/:id(\\d+)/delete',
  ProductVariantFetchMiddleware,
  AuthMiddleware,
  ProductVariantUpdatePermissionMiddleware,
  controller.delete
);

router.get(
  '/:id(\\d+)',
  ProductVariantFetchMiddleware,
  controller.get
);

module.exports = router;

