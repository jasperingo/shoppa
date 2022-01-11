
const express = require('express');
const { checkSchema } = require('express-validator');
const TransactionController = require('../controllers/TransactionController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const TransactionFetchMiddleware = require('../middlewares/fetch/TransactionFetchMiddleware');
const PaystackWebhookAuthMiddleware = require('../middlewares/PaystackWebhookAuthMiddleware');
const RefundTransactionCreatePermissionMiddleware = require('../middlewares/permissions/transaction/RefundTransactionCreatePermissionMiddleware');
const TransactionStatusUpdatePermissionMiddleware = require('../middlewares/permissions/transaction/TransactionStatusUpdatePermissionMiddleware');
const WithdrawalTransactionCreatePermissionMiddleware = require('../middlewares/permissions/transaction/WithdrawalTransactionCreatePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const TransactionStatusUpdateValidation = require('../validation/transaction/TransactionStatusUpdateValidation');
const WithdrawalTransactionCreateValidation = require('../validation/transaction/WithdrawalTransactionCreateValidation');
const RefundTransactionCreateValidation = require('../validation/transaction/RefundTransactionCreateValidation');

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

router.post(
  '/refund/create',
  AuthMiddleware,
  RefundTransactionCreatePermissionMiddleware,
  checkSchema(RefundTransactionCreateValidation),
  ValidationMiddleware(),
  controller.createRefund
);

router.post(
  '/payment/create',
  // AuthMiddleware,
  // RefundTransactionCreatePermissionMiddleware,
  // checkSchema(RefundTransactionCreateValidation),
  // ValidationMiddleware(),
  controller.createPayment
);

router.put(
  '/:id(\\d+)/status/update',
  TransactionFetchMiddleware,
  AuthMiddleware,
  TransactionStatusUpdatePermissionMiddleware,
  checkSchema(TransactionStatusUpdateValidation),
  ValidationMiddleware(),
  controller.updateStatus
);



module.exports = router;

