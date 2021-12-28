
const express = require('express');
const { checkSchema } = require('express-validator');
const DeliveryFirmController = require('../controllers/DeliveryFirmController');
const UnauthorizedException = require('../http/exceptions/UnauthorizedException');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const DeliveryFirmRegisterValidation = require('../validation/delivery_firm/DeliveryFirmRegisterValidation');
const DeliveryFirmLoginValidation = require('../validation/delivery_firm/DeliveryFirmLoginValidation');

const router = express.Router();

const controller = new DeliveryFirmController();

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

module.exports = router;

