
const express = require('express');
const { checkSchema } = require('express-validator');
const CustomerController = require('../controllers/CustomerController');
const UnauthorizedException = require('../http/exceptions/UnauthorizedException');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const CustomerPermissionMiddleware = require('../middlewares/permissions/CustomerPermissionMiddleware');
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
const AddressController = require('../controllers/AddressController');
const Files = require('../http/Files');

const router = express.Router();

const controller = new CustomerController();

const addressController = new AddressController();

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
  CustomerPermissionMiddleware,
  addressController.getListByCustomer
);

router.get(
  '/:id(\\d+)', 
  CustomerFetchMiddleware,
  AuthMiddleware, 
  CustomerPermissionMiddleware,
  controller.get
);

module.exports = router;
