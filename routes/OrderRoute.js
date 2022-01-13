
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
const OrderStatusUpdateValidation = require('../validation/order/OrderStatusUpdateValidation');
const OrderStoreStatusUpdateValidation = require('../validation/order/OrderStoreStatusUpdateValidation');
const OrderFetchMiddleware = require('../middlewares/fetch/OrderFetchMiddleware');
const OrderCustomerPermissionMiddleware = require('../middlewares/permissions/order/OrderCustomerPermissionMiddleware');
const OrderStorePermissionMiddleware = require('../middlewares/permissions/order/OrderStorePermissionMiddleware');
const OrderDeliveryFirmPermissionMiddleware = require('../middlewares/permissions/order/OrderDeliveryFirmPermissionMiddleware');
const OrderDeliveryFirmStatusUpdateValidation = require('../validation/order/OrderDeliveryFirmStatusUpdateValidation');
const OrderFetchPermissionMiddleware = require('../middlewares/permissions/order/OrderFetchPermissionMiddleware');
const AdministratorPermissionMiddleware = require('../middlewares/permissions/AdministratorPermissionMiddleware');
const PaginationMiddleware = require('../middlewares/PaginationMiddleware');

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

router.put(
  '/:id(\\d+)/status/update',
  OrderFetchMiddleware,
  AuthMiddleware,
  OrderCustomerPermissionMiddleware,
  checkSchema(OrderStatusUpdateValidation),
  ValidationMiddleware(),
  controller.updateStatus
);

router.put(
  '/:id(\\d+)/store-status/update',
  OrderFetchMiddleware,
  AuthMiddleware,
  OrderStorePermissionMiddleware,
  checkSchema(OrderStoreStatusUpdateValidation),
  ValidationMiddleware(),
  controller.storeStatusUpdate
);

router.put(
  '/:id(\\d+)/delivery-firm-status/update',
  OrderFetchMiddleware,
  AuthMiddleware,
  OrderDeliveryFirmPermissionMiddleware,
  checkSchema(OrderDeliveryFirmStatusUpdateValidation),
  ValidationMiddleware(),
  controller.deliveryFirmStatusUpdate
);

router.get(
  '/list',
  AuthMiddleware,
  AdministratorPermissionMiddleware,
  PaginationMiddleware,
  controller.getList
);

router.get(
  '/:id(\\d+)',
  OrderFetchMiddleware,
  AuthMiddleware,
  OrderFetchPermissionMiddleware,
  controller.get
);


module.exports = router;

