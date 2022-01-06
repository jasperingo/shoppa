
const express = require('express');
const { checkSchema } = require('express-validator');
const OrderController = require('../controllers/OrderController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const OrderRouteSuggestPermissionMiddleware = require('../middlewares/permissions/order/OrderRouteSuggestPermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const OrderRouteSuggestValidation = require('../validation/order/OrderRouteSuggestValidation');

const router = express.Router();

const controller = new OrderController();

router.post(
  '/create',
  controller.create
);

router.post(
  '/route/suggest',
  AuthMiddleware,
  OrderRouteSuggestPermissionMiddleware,
  checkSchema(OrderRouteSuggestValidation),
  ValidationMiddleware(),
  controller.getRouteSuggestions
);

router.post(
  '/discount/suggest',
  controller.getDiscountSuggestions
);


module.exports = router;

