
const express = require('express');
const { checkSchema } = require('express-validator');
const PasswordResetController = require('../controllers/PasswordResetController');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const PasswordResetResetValidation = require('../validation/password_reset/PasswordResetResetValidation');
const CustomerPasswordResetCreateValidation = require('../validation/password_reset/CustomerPasswordResetCreateValidation');
const StorePasswordResetCreateValidation = require('../validation/password_reset/StorePasswordResetCreateValidation');
const DeliveryFirmPasswordResetCreateValidation = require('../validation/password_reset/DeliveryFirmPasswordResetCreateValidation');
const AdministratorPasswordResetCreateValidation = require('../validation/password_reset/AdministratorPasswordResetCreateValidation');

const router = express.Router();

const controller = new PasswordResetController();

router.post(
  '/customer/create',
  checkSchema(CustomerPasswordResetCreateValidation), 
  ValidationMiddleware, 
  controller.createCustomer
);

router.post(
  '/store/create',
  checkSchema(StorePasswordResetCreateValidation), 
  ValidationMiddleware, 
  controller.createAdministrator
);

router.post(
  '/delivery-firm/create',
  checkSchema(DeliveryFirmPasswordResetCreateValidation), 
  ValidationMiddleware, 
  controller.createAdministrator
);

router.post(
  '/administrator/create',
  checkSchema(AdministratorPasswordResetCreateValidation), 
  ValidationMiddleware, 
  controller.createAdministrator
);

router.put(
  '/reset',
  checkSchema(PasswordResetResetValidation), 
  ValidationMiddleware, 
  controller.reset
);

module.exports = router;
