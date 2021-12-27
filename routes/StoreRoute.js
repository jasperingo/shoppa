
const express = require('express');
const { checkSchema } = require('express-validator');
const AddressController = require('../controllers/AddressController');
const StoreController = require('../controllers/StoreController');
const WithdrawalAccountController = require('../controllers/WithdrawalAccountController');
const WorkingHourController = require('../controllers/WorkingHourController');
const UnauthorizedException = require('../http/exceptions/UnauthorizedException');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const StoreFetchMiddleware = require('../middlewares/fetch/StoreFetchMiddleware');
const FileUploadMiddleware = require('../middlewares/FileUploadMiddleware');
const FileUploadValidationMiddleware = require('../middlewares/FileUploadValidationMiddleware');
const PaginationMiddleware = require('../middlewares/PaginationMiddleware');
const AdministratorPermissionMiddleware = require('../middlewares/permissions/AdministratorPermissionMiddleware');
const StorePermissionMiddleware = require('../middlewares/permissions/StorePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const StoreAddressUpdateValidation = require('../validation/address/StoreAddressUpdateValidation');
const StoreLoginValidation = require('../validation/store/StoreLoginValidation');
const StoreRegisterValidation = require('../validation/store/StoreRegisterValidation');
const StoreUpdateValidation = require('../validation/store/StoreUpdateValidation');
const WithdrawalAccountUpdateValidation = require('../validation/withdrawal_account/WithdrawalAccountUpdateValidation');
const WorkingHourUpdateValidation = require('../validation/working_hour/WorkingHourUpdateValidation');

const router = express.Router();

const controller = new StoreController();

const addressController = new AddressController();

const workingHourController = new WorkingHourController();

const withdrawalAccountController = new WithdrawalAccountController();

router.post(
  '/register', 
  checkSchema(StoreRegisterValidation),
  ValidationMiddleware(),
  controller.register
);

router.post(
  '/login',
  checkSchema(StoreLoginValidation),
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
  StoreFetchMiddleware,
  AuthMiddleware,
  StorePermissionMiddleware,
  checkSchema(StoreUpdateValidation),
  ValidationMiddleware(),
  controller.update
);

router.put(
  '/:id(\\d+)/photo/update',
  StoreFetchMiddleware, 
  AuthMiddleware,
  StorePermissionMiddleware, 
  FileUploadMiddleware('user').single('photo'), 
  FileUploadValidationMiddleware('photo'), 
  controller.updatePhoto
);

router.put(
  '/:id(\\d+)/address/update',
  StoreFetchMiddleware,
  AuthMiddleware,
  StorePermissionMiddleware,
  checkSchema(StoreAddressUpdateValidation),
  ValidationMiddleware(),
  addressController.updateStoreAddress
);

router.put(
  '/:id(\\d+)/working-hours/update',
  StoreFetchMiddleware,
  AuthMiddleware,
  StorePermissionMiddleware,
  checkSchema(WorkingHourUpdateValidation),
  ValidationMiddleware(),
  workingHourController.updateStoreWorkingHours
);

router.put(
  '/:id(\\d+)/withdrawal-account/update',
  StoreFetchMiddleware,
  AuthMiddleware,
  StorePermissionMiddleware,
  checkSchema(WithdrawalAccountUpdateValidation),
  ValidationMiddleware(),
  withdrawalAccountController.updateStoreWithdrawalAccount
);

router.get(
  '/:id(\\d+)',
  StoreFetchMiddleware,
  controller.get
);

module.exports = router;
