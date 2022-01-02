
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
const DeliveryFirmPermissionMiddleware = require('../middlewares/permissions/DeliveryFirmPermissionMiddleware');
const AddressUpdateValidation = require('../validation/address/AddressUpdateValidation');
const WorkingHourUpdateValidation = require('../validation/working_hour/WorkingHourUpdateValidation');
const WithdrawalAccountUpdateValidation = require('../validation/withdrawal_account/WithdrawalAccountUpdateValidation');
const PaginationMiddleware = require('../middlewares/PaginationMiddleware');
const AdministratorPermissionMiddleware = require('../middlewares/permissions/AdministratorPermissionMiddleware');
const RouteController = require('../controllers/RouteController');

const router = express.Router();

const controller = new DeliveryFirmController();

const addressController = new AddressController();

const workingHourController = new WorkingHourController();

const withdrawalAccountController = new WithdrawalAccountController();

const routeController = new RouteController();

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
  '/:id(\\d+)/route/list', 
  DeliveryFirmFetchMiddleware,
  AuthMiddleware, 
  DeliveryFirmPermissionMiddleware,
  PaginationMiddleware,
  routeController.getListByDeliveryFirm
);

router.get(
  '/:id(\\d+)',
  DeliveryFirmFetchMiddleware,
  controller.get
);

module.exports = router;

