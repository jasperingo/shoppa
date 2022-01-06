
const express = require('express');
const OrderController = require('../controllers/OrderController');

const router = express.Router();

const controller = new OrderController();

router.post(
  '/create',
  controller.create
);

router.post(
  '/delivery-firm/suggest',
  controller.create
);

router.post(
  '/discount/suggest',
  controller.create
);

router.post(
  '/paymnet-method/suggest',
  controller.create
);

module.exports = router;

