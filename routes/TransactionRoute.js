
const express = require('express');
const TransactionController = require('../controllers/TransactionController');

const router = express.Router();

const controller = new TransactionController();

router.post(
  '/verify/webhook',
  controller.verifyByWebhook
);

module.exports = router;

