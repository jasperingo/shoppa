
const express = require('express');
const { checkSchema } = require('express-validator');
const DeliveryFirmController = require('../controllers/DeliveryFirmController');
const AddressController = require('../controllers/AddressController');
const WorkingHourController = require('../controllers/WorkingHourController');
const WithdrawalAccountController = require('../controllers/WithdrawalAccountController');
const UnauthorizedException = require('../http/exceptions/UnauthorizedException');
const Files = require('../http/Files');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const FileUploadMiddleware = require('../middlewares/FileUploadMiddleware');
const FileUploadValidationMiddleware = require('../middlewares/FileUploadValidationMiddleware');
const DeliveryFirmRegisterValidation = require('../validation/delivery_firm/DeliveryFirmRegisterValidation');
const DeliveryFirmLoginValidation = require('../validation/delivery_firm/DeliveryFirmLoginValidation');
const DeliveryFirmUpdateValidation = require('../validation/delivery_firm/DeliveryFirmUpdateValidation');
const DeliveryFirmFetchMiddleware = require('../middlewares/fetch/DeliveryFirmFetchMiddleware');
const DeliveryFirmPermissionMiddleware = require('../middlewares/permissions/delivery_firm/DeliveryFirmPermissionMiddleware');
const AddressUpdateValidation = require('../validation/address/AddressUpdateValidation');
const WorkingHourUpdateValidation = require('../validation/working_hour/WorkingHourUpdateValidation');
const WithdrawalAccountUpdateValidation = require('../validation/withdrawal_account/WithdrawalAccountUpdateValidation');
const PaginationMiddleware = require('../middlewares/PaginationMiddleware');
const AdministratorPermissionMiddleware = require('../middlewares/permissions/AdministratorPermissionMiddleware');
const RouteController = require('../controllers/RouteController');
const DeliveryFirmLoginPermissionMiddleware = require('../middlewares/permissions/delivery_firm/DeliveryFirmLoginPermissionMiddleware');
const DeliveryFirmFetchPermissionMiddleware = require('../middlewares/permissions/delivery_firm/DeliveryFirmFetchPermissionMiddleware');
const OptionalAuthMiddleware = require('../middlewares/OptionalAuthMiddleware');
const CustomerUpdateStatusValidation = require('../validation/customer/CustomerUpdateStatusValidation');
const OrderController = require('../controllers/OrderController');
const DeliveryFirmAndAdminPermissionMiddleware = require('../middlewares/permissions/delivery_firm/DeliveryFirmAndAdminPermissionMiddleware');
const TransactionController = require('../controllers/TransactionController');
const ReviewController = require('../controllers/ReviewController');
const OrderListFilterMiddleware = require('../middlewares/OrderListFilterMiddleware');

const router = express.Router();

const controller = new DeliveryFirmController();

const addressController = new AddressController();

const workingHourController = new WorkingHourController();

const withdrawalAccountController = new WithdrawalAccountController();

const routeController = new RouteController();

const orderController = new OrderController();

const transactionController = new TransactionController();

const reviewController = new ReviewController();

router.post(
  '/register', 
  checkSchema(DeliveryFirmRegisterValidation),
  ValidationMiddleware(),
  controller.register
);

router.post(
  '/login', 
  checkSchema(DeliveryFirmLoginValidation),
  ValidationMiddleware(UnauthorizedException),
  DeliveryFirmLoginPermissionMiddleware,
  controller.login
);

router.get(
  '/list', 
  AuthMiddleware, 
  AdministratorPermissionMiddleware,
  PaginationMiddleware,
  controller.getList
);

router.put(
  '/:id(\\d+)/update', 
  DeliveryFirmFetchMiddleware,
  AuthMiddleware,
  DeliveryFirmPermissionMiddleware,
  checkSchema(DeliveryFirmUpdateValidation),
  ValidationMiddleware(),
  controller.update
);

router.put(
  '/:id(\\d+)/photo/update',
  DeliveryFirmFetchMiddleware,
  AuthMiddleware,
  DeliveryFirmPermissionMiddleware,
  FileUploadMiddleware(Files.USER_PHOTO_PATHS.delivery_firm).single('photo'), 
  FileUploadValidationMiddleware('photo'), 
  controller.updatePhoto
);

router.put(
  '/:id(\\d+)/status/update', 
  DeliveryFirmFetchMiddleware, 
  AuthMiddleware,
  AdministratorPermissionMiddleware, 
  checkSchema(CustomerUpdateStatusValidation),
  ValidationMiddleware(), 
  controller.updateStatus
);

router.put(
  '/:id(\\d+)/address/update',
  DeliveryFirmFetchMiddleware,
  AuthMiddleware,
  DeliveryFirmPermissionMiddleware,
  checkSchema(AddressUpdateValidation),
  ValidationMiddleware(),
  addressController.updateDeliveryFirmAddress
);

router.put(
  '/:id(\\d+)/working-hours/update',
  DeliveryFirmFetchMiddleware,
  AuthMiddleware,
  DeliveryFirmPermissionMiddleware,
  checkSchema(WorkingHourUpdateValidation),
  ValidationMiddleware(),
  workingHourController.updateDeliveryFirmWorkingHours
);

router.put(
  '/:id(\\d+)/withdrawal-account/update',
  DeliveryFirmFetchMiddleware,
  AuthMiddleware,
  DeliveryFirmPermissionMiddleware,
  checkSchema(WithdrawalAccountUpdateValidation),
  ValidationMiddleware(),
  withdrawalAccountController.updateDeliveryFirmWithdrawalAccount
);

router.get(
  '/:id(\\d+)/delivery-route/list', 
  DeliveryFirmFetchMiddleware,
  OptionalAuthMiddleware,
  DeliveryFirmFetchPermissionMiddleware,
  PaginationMiddleware,
  routeController.getListByDeliveryFirm
);

router.get(
  '/:id(\\d+)/delivery-route/base/list', 
  DeliveryFirmFetchMiddleware,
  AuthMiddleware,
  DeliveryFirmPermissionMiddleware,
  PaginationMiddleware,
  routeController.getListOfBaseByDeliveryFirm
);

router.get(
  '/:id(\\d+)/order/list', 
  DeliveryFirmFetchMiddleware,
  AuthMiddleware,
  DeliveryFirmAndAdminPermissionMiddleware,
  PaginationMiddleware,
  OrderListFilterMiddleware,
  orderController.getListByDeliveryFirm
);

router.get(
  '/:id(\\d+)/transaction/list', 
  DeliveryFirmFetchMiddleware,
  AuthMiddleware,
  DeliveryFirmAndAdminPermissionMiddleware,
  PaginationMiddleware,
  transactionController.getListByDeliveryFirm
);

router.get(
  '/:id(\\d+)/transaction/balance', 
  DeliveryFirmFetchMiddleware,
  AuthMiddleware, 
  DeliveryFirmAndAdminPermissionMiddleware,
  transactionController.getBalanceByDeliveryFirm
);

router.get(
  '/:id(\\d+)/review/list', 
  DeliveryFirmFetchMiddleware,
  OptionalAuthMiddleware,
  DeliveryFirmFetchPermissionMiddleware,
  PaginationMiddleware,
  reviewController.getListByDeliveryFirm
);

router.get(
  '/:id(\\d+)',
  DeliveryFirmFetchMiddleware,
  OptionalAuthMiddleware,
  DeliveryFirmFetchPermissionMiddleware,
  controller.get
);

module.exports = router;

