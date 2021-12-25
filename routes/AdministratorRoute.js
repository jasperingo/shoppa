
const express = require('express');
const { checkSchema } = require('express-validator');
const AdministratorController = require('../controllers/AdministratorController');
const UnauthorizedException = require('../http/exceptions/UnauthorizedException');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const AdministratorFetchMiddleware = require('../middlewares/fetch/AdministratorFetchMiddleware');
const AdministratorPermissionMiddleware = require('../middlewares/permissions/AdministratorPermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const AdministratorLoginValidation = require('../validation/administrator/AdministratorLoginValidation');
const AdministratorPasswordUpdateValidation = require('../validation/administrator/AdministratorPasswordUpdateValidation');

const router = express.Router();

const controller = new AdministratorController();

router.post(
  '/login', 
  checkSchema(AdministratorLoginValidation),
  ValidationMiddleware(UnauthorizedException),
  controller.login
);

router.put(
  '/:id(\\d+)/password/update',
  AdministratorFetchMiddleware,
  AuthMiddleware,
  AdministratorPermissionMiddleware,
  checkSchema(AdministratorPasswordUpdateValidation),
  ValidationMiddleware(),
  controller.updatePassword
);

module.exports = router;

