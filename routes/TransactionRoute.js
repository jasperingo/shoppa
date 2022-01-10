
const express = require('express');
const { checkSchema } = require('express-validator');
const TransactionController = require('../controllers/TransactionController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const PaystackWebhookAuthMiddleware = require('../middlewares/PaystackWebhookAuthMiddleware');
const WithdrawalTransactionCreatePermissionMiddleware = require('../middlewares/permissions/transaction/WithdrawalTransactionCreatePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const WithdrawalTransactionCreateValidation = require('../validation/transaction/WithdrawalTransactionCreateValidation');

const router = express.Router();

const controller = new TransactionController();

router.post(
  '/verify/webhook',
  PaystackWebhookAuthMiddleware,
  controller.verifyByWebhook
);

router.post(
  '/withdrawal/create',
  AuthMiddleware,
  WithdrawalTransactionCreatePermissionMiddleware,
  checkSchema(WithdrawalTransactionCreateValidation),
  ValidationMiddleware(),
  controller.createWithdrawal
);

module.exports = router;

