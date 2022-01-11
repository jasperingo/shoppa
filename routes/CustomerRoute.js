
const express = require('express');
const { checkSchema } = require('express-validator');
const CustomerController = require('../controllers/CustomerController');
const FavoriteController = require('../controllers/FavoriteController');
const AddressController = require('../controllers/AddressController');
const UnauthorizedException = require('../http/exceptions/UnauthorizedException');
const Files = require('../http/Files');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const CustomerPermissionMiddleware = require('../middlewares/permissions/customer/CustomerPermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const FileUploadMiddleware = require('../middlewares/FileUploadMiddleware');
const CustomerLoginValidation = require('../validation/customer/CustomerLoginValidation');
const CustomerRegistrationValidation = require('../validation/customer/CustomerRegistrationValidation');
const CustomerUpdatePasswordValidation = require('../validation/customer/CustomerUpdatePasswordValidation');
const CustomerUpdateValidation = require('../validation/customer/CustomerUpdateValidation');
const FileUploadValidationMiddleware = require('../middlewares/FileUploadValidationMiddleware');
const CustomerFetchMiddleware = require('../middlewares/fetch/CustomerFetchMiddleware');
const PaginationMiddleware = require('../middlewares/PaginationMiddleware');
const AdministratorPermissionMiddleware = require('../middlewares/permissions/AdministratorPermissionMiddleware');
const SavedCartController = require('../controllers/SavedCartController');
const WithdrawalAccountController = require('../controllers/WithdrawalAccountController');
const CustomerAndAdminPermissionMiddleware = require('../middlewares/permissions/customer/CustomerAndAdminPermissionMiddleware');
const WithdrawalAccountUpdateValidation = require('../validation/withdrawal_account/WithdrawalAccountUpdateValidation');
const CustomerLoginPermissionMiddleware = require('../middlewares/permissions/customer/CustomerLoginPermissionMiddleware');

const router = express.Router();

const controller = new CustomerController();

const addressController = new AddressController();

const withdrawalAccountController = new WithdrawalAccountController();

const favoriteController = new FavoriteController();

const savedCartController = new SavedCartController();

router.post(
  '/register', 
  checkSchema(CustomerRegistrationValidation), 
  ValidationMiddleware(), 
  controller.register
);

router.post(
  '/login', 
  checkSchema(CustomerLoginValidation), 
  ValidationMiddleware(UnauthorizedException), 
  CustomerLoginPermissionMiddleware,
  controller.login
);

router.put(
  '/:id(\\d+)/update', 
  CustomerFetchMiddleware,
  AuthMiddleware, 
  CustomerPermissionMiddleware, 
  checkSchema(CustomerUpdateValidation), 
  ValidationMiddleware(), 
  controller.update
);

router.put(
  '/:id(\\d+)/photo/update',
  CustomerFetchMiddleware, 
  AuthMiddleware,
  CustomerPermissionMiddleware, 
  FileUploadMiddleware(Files.USER_PHOTO_PATHS.customer).single('photo'), 
  FileUploadValidationMiddleware('photo'), 
  controller.updatePhoto
);

router.put(
  '/:id(\\d+)/password/update', 
  CustomerFetchMiddleware,
  AuthMiddleware, 
  CustomerPermissionMiddleware, 
  checkSchema(CustomerUpdatePasswordValidation), 
  ValidationMiddleware(), 
  controller.updatePassword
);

router.put(
  '/:id(\\d+)/withdrawal-account/update', 
  CustomerFetchMiddleware,
  AuthMiddleware, 
  CustomerPermissionMiddleware, 
  checkSchema(WithdrawalAccountUpdateValidation),
  ValidationMiddleware(), 
  withdrawalAccountController.updateCustomerWithdrawalAccount
);

router.get(
  '/list', 
  AuthMiddleware, 
  AdministratorPermissionMiddleware,
  PaginationMiddleware,
  controller.getList
);

router.get(
  '/:id(\\d+)/address/list', 
  CustomerFetchMiddleware,
  AuthMiddleware, 
  CustomerAndAdminPermissionMiddleware,
  addressController.getListByCustomer
);

router.get(
  '/:id(\\d+)/favorite/list', 
  CustomerFetchMiddleware,
  AuthMiddleware, 
  CustomerAndAdminPermissionMiddleware,
  PaginationMiddleware,
  favoriteController.getListByCustomer
);

router.get(
  '/:id(\\d+)/saved-cart/list', 
  CustomerFetchMiddleware,
  AuthMiddleware, 
  CustomerAndAdminPermissionMiddleware,
  PaginationMiddleware,
  savedCartController.getListByCustomer
);

router.get(
  '/:id(\\d+)', 
  CustomerFetchMiddleware,
  AuthMiddleware, 
  CustomerAndAdminPermissionMiddleware,
  controller.get
);

module.exports = router;
