
const express = require('express');
const { checkSchema } = require('express-validator');
const DiscountController = require('../controllers/DiscountController');
const ProductController = require('../controllers/ProductController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const DiscountFetchMiddleware = require('../middlewares/fetch/DiscountFetchMiddleware');
const PaginationMiddleware = require('../middlewares/PaginationMiddleware');
const DiscountCreatePermissionMiddleware = require('../middlewares/permissions/discount/DiscountCreatePermissionMiddleware');
const DiscountUpdatePermissionMiddleware = require('../middlewares/permissions/discount/DiscountUpdatePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const DiscountCreateValidation = require('../validation/discount/DiscountCreateValidation');
const DiscountUpdateValidation = require('../validation/discount/DiscountUpdateValidation');

const router = express.Router();

const controller = new DiscountController();

const productController = new ProductController();

router.post(
  '/create',
  AuthMiddleware,
  DiscountCreatePermissionMiddleware,
  checkSchema(DiscountCreateValidation),
  ValidationMiddleware(),
  controller.create
);

router.put(
  '/:id(\\d+)/update',
  DiscountFetchMiddleware,
  AuthMiddleware,
  DiscountUpdatePermissionMiddleware,
  checkSchema(DiscountUpdateValidation),
  ValidationMiddleware(),
  controller.update
);

router.delete(
  '/:id(\\d+)/delete',
  DiscountFetchMiddleware,
  AuthMiddleware,
  DiscountUpdatePermissionMiddleware,
  controller.delete
);

router.get(
  '/:id(\\d+)/product/list',
  DiscountFetchMiddleware,
  PaginationMiddleware,
  controller.getDiscountProductList
);

router.get(
  '/:id(\\d+)',
  DiscountFetchMiddleware,
  controller.get
);

module.exports = router;

