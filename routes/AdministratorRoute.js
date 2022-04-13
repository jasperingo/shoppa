
const express = require('express');
const { checkSchema } = require('express-validator');
const AdministratorController = require('../controllers/AdministratorController');
const TransactionController = require('../controllers/TransactionController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const AdministratorFetchMiddleware = require('../middlewares/fetch/AdministratorFetchMiddleware');
const PaginationMiddleware = require('../middlewares/PaginationMiddleware');
const DeliveryFirmAdministratorPermissionMiddleware = require('../middlewares/permissions/administrator/DeliveryFirmAdministratorPermissionMiddleware');
const StoreAdministratorPermissionMiddleware = require('../middlewares/permissions/administrator/StoreAdministratorPermissionMiddleware');
const AdministratorPermissionMiddleware = require('../middlewares/permissions/AdministratorPermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const AdministratorLoginValidation = require('../validation/administrator/AdministratorLoginValidation');
const AdministratorUpdateValidation = require('../validation/administrator/AdministratorUpdateValidation');
const AdministratorPasswordUpdateValidation = require('../validation/administrator/AdministratorPasswordUpdateValidation');
const FileUploadMiddleware = require('../middlewares/FileUploadMiddleware');
const FileUploadValidationMiddleware = require('../middlewares/FileUploadValidationMiddleware');
const Files = require('../http/Files');
const AuthValidationMiddleware = require('../middlewares/AuthValidationMiddleware');

const router = express.Router();

const controller = new AdministratorController();

const transactionController = new TransactionController();

router.post(
  '/login', 
  checkSchema(AdministratorLoginValidation),
  AuthValidationMiddleware,
  controller.login
);

router.put(
  '/:id(\\d+)/update', 
  AdministratorFetchMiddleware,
  AuthMiddleware, 
  AdministratorPermissionMiddleware, 
  checkSchema(AdministratorUpdateValidation), 
  ValidationMiddleware, 
  controller.update
);

router.put(
  '/:id(\\d+)/photo/update',
  AdministratorFetchMiddleware, 
  AuthMiddleware,
  AdministratorPermissionMiddleware, 
  FileUploadMiddleware(Files.USER_PHOTO_PATHS.customer).single('photo'), 
  FileUploadValidationMiddleware('photo'), 
  controller.updatePhoto
);

router.put(
  '/:id(\\d+)/password/update',
  AdministratorFetchMiddleware,
  AuthMiddleware,
  AdministratorPermissionMiddleware,
  checkSchema(AdministratorPasswordUpdateValidation),
  ValidationMiddleware,
  controller.updatePassword
);

router.put(
  '/:id(\\d+)/store/password/update',
  AdministratorFetchMiddleware,
  AuthMiddleware,
  StoreAdministratorPermissionMiddleware,
  checkSchema(AdministratorPasswordUpdateValidation),
  ValidationMiddleware,
  controller.updatePassword
);

router.put(
  '/:id(\\d+)/delivery-firm/password/update',
  AdministratorFetchMiddleware,
  AuthMiddleware,
  DeliveryFirmAdministratorPermissionMiddleware,
  checkSchema(AdministratorPasswordUpdateValidation),
  ValidationMiddleware,
  controller.updatePassword
);

router.get(
  '/transaction/list',
  AuthMiddleware, 
  AdministratorPermissionMiddleware,
  PaginationMiddleware,
  transactionController.getListByAdministrator
);

router.get(
  '/transaction/balance',
  AuthMiddleware, 
  AdministratorPermissionMiddleware,
  transactionController.getBalanceByAdministrator
);

router.get(
  '/statistics', 
  AuthMiddleware,
  AdministratorPermissionMiddleware,
  controller.getStatistics
);

router.get(
  '/:id(\\d+)', 
  AdministratorFetchMiddleware,
  AuthMiddleware,
  AdministratorPermissionMiddleware,
  controller.get
);

module.exports = router;
