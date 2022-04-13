
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
const PaymentTransactionCreatePermissionMiddleware = require('../middlewares/permissions/transaction/PaymentTransactionCreatePermissionMiddleware');
const PaymentTransactionCreateValidation = require('../validation/transaction/PaymentTransactionCreateValidation');
const TransactionFetchPermissionMiddleware = require('../middlewares/permissions/transaction/TransactionFetchPermissionMiddleware');
const AdministratorPermissionMiddleware = require('../middlewares/permissions/AdministratorPermissionMiddleware');
const PaginationMiddleware = require('../middlewares/PaginationMiddleware');
const TransactionListFilterMiddleware = require('../middlewares/TransactionListFilterMiddleware');

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
  ValidationMiddleware,
  controller.createWithdrawal
);

router.post(
  '/refund/create',
  AuthMiddleware,
  RefundTransactionCreatePermissionMiddleware,
  checkSchema(RefundTransactionCreateValidation),
  ValidationMiddleware,
  controller.createRefund
);

router.post(
  '/payment/create',
  AuthMiddleware,
  PaymentTransactionCreatePermissionMiddleware,
  checkSchema(PaymentTransactionCreateValidation),
  ValidationMiddleware,
  controller.createPayment
);

router.put(
  '/:id(\\d+)/status/update',
  TransactionFetchMiddleware,
  AuthMiddleware,
  TransactionStatusUpdatePermissionMiddleware,
  checkSchema(TransactionStatusUpdateValidation),
  ValidationMiddleware,
  controller.updateStatus
);

router.get(
  '/list',
  AuthMiddleware,
  AdministratorPermissionMiddleware,
  PaginationMiddleware,
  TransactionListFilterMiddleware,
  controller.getList
);

router.get(
  '/:id(\\d+)',
  TransactionFetchMiddleware,
  AuthMiddleware,
  TransactionFetchPermissionMiddleware,
  controller.get
);

module.exports = router;
