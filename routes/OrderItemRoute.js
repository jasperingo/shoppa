
const express = require('express');
const { checkSchema } = require('express-validator');
const OrderItemController = require('../controllers/OrderItemController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const OrderItemFetchMiddleware = require('../middlewares/fetch/OrderItemFetchMiddleware');
const OrderItemCustomerPermissionMiddleware = require('../middlewares/permissions/order/OrderItemCustomerPermissionMiddleware');
const OrderItemDeliveryFirmPermissionMiddleware = require('../middlewares/permissions/order/OrderItemDeliveryFirmPermissionMiddleware');
const OrderItemStorePermissionMiddleware = require('../middlewares/permissions/order/OrderItemStorePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const OrderItemDeliveredAtUpdateValidation = require('../validation/order/OrderItemDeliveredAtUpdateValidation');
const OrderItemProcessedAtUpdateValidation = require('../validation/order/OrderItemProcessedAtUpdateValidation');
const OrderItemTransportedAtUpdateValidation = require('../validation/order/OrderItemTransportedAtUpdateValidation');

const router = express.Router();

const controller = new OrderItemController();

router.put(
  '/:id(\\d+)/processing-date/update',
  OrderItemFetchMiddleware,
  AuthMiddleware,
  OrderItemStorePermissionMiddleware,
  checkSchema(OrderItemProcessedAtUpdateValidation),
  ValidationMiddleware(),
  controller.updateProcessedAt
);

router.put(
  '/:id(\\d+)/transporting-date/update',
  OrderItemFetchMiddleware,
  AuthMiddleware,
  OrderItemDeliveryFirmPermissionMiddleware,
  checkSchema(OrderItemTransportedAtUpdateValidation),
  ValidationMiddleware(),
  controller.updateTransportedAt
);

router.put(
  '/:id(\\d+)/delivery-date/update',
  OrderItemFetchMiddleware,
  AuthMiddleware,
  OrderItemCustomerPermissionMiddleware,
  checkSchema(OrderItemDeliveredAtUpdateValidation),
  ValidationMiddleware(),
  controller.updateDeliveredAt
);

module.exports = router;

