
const express = require('express');
const { checkSchema } = require('express-validator');
const OrderController = require('../controllers/OrderController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const OrderPermissionMiddleware = require('../middlewares/permissions/order/OrderPermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const OrderDiscountSuggestValidation = require('../validation/order/OrderDiscountSuggestValidation');
const OrderRouteSuggestValidation = require('../validation/order/OrderRouteSuggestValidation');
const OrderCreateValidation = require('../validation/order/OrderCreateValidation');
const OrderCreateStoreProductsValidation = require('../validation/order/OrderCreateStoreProductsValidation');
const OrderCreateDeliveryFirmRoutesValidation = require('../validation/order/OrderCreateDeliveryFirmRoutesValidation');
const OrderCreateDiscountsValidation = require('../validation/order/OrderCreateDiscountsValidation');

const router = express.Router();

const controller = new OrderController();

router.post(
  '/create',
  AuthMiddleware,
  OrderPermissionMiddleware,
  checkSchema(OrderCreateValidation),
  OrderCreateStoreProductsValidation,
  OrderCreateDeliveryFirmRoutesValidation,
  OrderCreateDiscountsValidation,
  ValidationMiddleware(),
  controller.create
);

router.post(
  '/route/suggest',
  AuthMiddleware,
  OrderPermissionMiddleware,
  checkSchema(OrderRouteSuggestValidation),
  ValidationMiddleware(),
  controller.getRouteSuggestions
);

router.post(
  '/discount/suggest',
  AuthMiddleware,
  OrderPermissionMiddleware,
  checkSchema(OrderDiscountSuggestValidation),
  ValidationMiddleware(),
  controller.getDiscountSuggestions
);


module.exports = router;

