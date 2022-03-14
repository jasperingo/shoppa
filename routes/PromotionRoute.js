
const express = require('express');
const { checkSchema } = require('express-validator');
const PromotionController = require('../controllers/PromotionController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const AdministratorPermissionMiddleware = require('../middlewares/permissions/AdministratorPermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const PromotionCreateValidation = require('../validation/promotion/PromotionCreateValidation');

const PromotionRoute = express.Router();

const controller = new PromotionController();

PromotionRoute.post(
  '/create',
  AuthMiddleware,
  AdministratorPermissionMiddleware,
  checkSchema(PromotionCreateValidation), 
  ValidationMiddleware(),
  controller.create
);

module.exports = PromotionRoute;
