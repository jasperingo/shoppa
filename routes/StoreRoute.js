
const express = require('express');
const { checkSchema } = require('express-validator');
const AddressController = require('../controllers/AddressController');
const StoreController = require('../controllers/StoreController');
const ProductController = require('../controllers/ProductController');
const WithdrawalAccountController = require('../controllers/WithdrawalAccountController');
const WorkingHourController = require('../controllers/WorkingHourController');
const UnauthorizedException = require('../http/exceptions/UnauthorizedException');
const Files = require('../http/Files');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const StoreFetchMiddleware = require('../middlewares/fetch/StoreFetchMiddleware');
const FileUploadMiddleware = require('../middlewares/FileUploadMiddleware');
const FileUploadValidationMiddleware = require('../middlewares/FileUploadValidationMiddleware');
const PaginationMiddleware = require('../middlewares/PaginationMiddleware');
const AdministratorPermissionMiddleware = require('../middlewares/permissions/AdministratorPermissionMiddleware');
const StorePermissionMiddleware = require('../middlewares/permissions/StorePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const AddressUpdateValidation = require('../validation/address/AddressUpdateValidation');
const StoreLoginValidation = require('../validation/store/StoreLoginValidation');
const StoreRegisterValidation = require('../validation/store/StoreRegisterValidation');
const StoreUpdateValidation = require('../validation/store/StoreUpdateValidation');
const WithdrawalAccountUpdateValidation = require('../validation/withdrawal_account/WithdrawalAccountUpdateValidation');
const WorkingHourUpdateValidation = require('../validation/working_hour/WorkingHourUpdateValidation');
const SavedCartController = require('../controllers/SavedCartController');
const DiscountController = require('../controllers/DiscountController');

const router = express.Router();

const controller = new StoreController();

const productController = new ProductController();

const addressController = new AddressController();

const workingHourController = new WorkingHourController();

const withdrawalAccountController = new WithdrawalAccountController();

const savedCartController = new SavedCartController();

const discountController = new DiscountController();

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
  FileUploadMiddleware(Files.USER_PHOTO_PATHS.store).single('photo'), 
  FileUploadValidationMiddleware('photo'), 
  controller.updatePhoto
);

router.put(
  '/:id(\\d+)/address/update',
  StoreFetchMiddleware,
  AuthMiddleware,
  StorePermissionMiddleware,
  checkSchema(AddressUpdateValidation),
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
  '/:id(\\d+)/product/list',
  StoreFetchMiddleware,
  PaginationMiddleware,
  productController.getListByStore
);

router.get(
  '/:id(\\d+)/saved-cart/list', 
  StoreFetchMiddleware,
  AuthMiddleware, 
  StorePermissionMiddleware,
  PaginationMiddleware,
  savedCartController.getListByStore
);

router.get(
  '/:id(\\d+)/discount/list', 
  StoreFetchMiddleware,
  AuthMiddleware, 
  StorePermissionMiddleware,
  PaginationMiddleware,
  discountController.getListByStore
);

router.get(
  '/:id(\\d+)',
  StoreFetchMiddleware,
  controller.get
);

module.exports = router;
