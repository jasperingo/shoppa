
const express = require('express');
const { checkSchema } = require('express-validator');
const DiscountProductController = require('../controllers/DiscountProductController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const DiscountProductFetchMiddleware = require('../middlewares/fetch/DiscountProductFetchMiddleware');
const DiscountProductCreatePermissionMiddleware = require('../middlewares/permissions/discount/DiscountProductCreatePermissionMiddleware');
const DiscountProductUpdatePermissionMiddleware = require('../middlewares/permissions/discount/DiscountProductUpdatePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const DiscountProductCreateValidation = require('../validation/discount/DiscountProductCreateValidation');

const router = express.Router();

const controller = new DiscountProductController();

router.post(
  '/create',
  AuthMiddleware,
  DiscountProductCreatePermissionMiddleware,
  checkSchema(DiscountProductCreateValidation),
  ValidationMiddleware,
  controller.create
);

router.delete(
  '/:id(\\d+)/delete',
  DiscountProductFetchMiddleware,
  AuthMiddleware,
  DiscountProductUpdatePermissionMiddleware,
  controller.delete
);

module.exports = router;

