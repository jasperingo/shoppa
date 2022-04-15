
const express = require('express');
const { checkSchema } = require('express-validator');
const RouteLocationController = require('../controllers/RouteLocationController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const RouteLocationFetchMiddleware = require('../middlewares/fetch/RouteLocationFetchMiddleware');
const OptionalAuthMiddleware = require('../middlewares/OptionalAuthMiddleware');
const RouteLocationFetchPermissionMiddleware = require('../middlewares/permissions/route/RouteLocationFetchPermissionMiddleware');
const RouteCreatePermissionMiddleware = require('../middlewares/permissions/route/RouteCreatePermissionMiddleware');
const RouteLocationCreateValidation = require('../validation/route/RouteLocationCreateValidation');
const RouteLocationUniqueCreateValidation = require('../validation/route/RouteLocationUniqueCreateValidation');
const RouteLocationUpdatePermissionMiddleware = require('../middlewares/permissions/route/RouteLocationUpdatePermissionMiddleware');
const RouteLocationUpdateValidation = require('../validation/route/RouteLocationUpdateValidation');
const RouteLocationUniqueUpdateValidation = require('../validation/route/RouteLocationUniqueUpdateValidation');

const RouteLocationRoute = express.Router();

const controller = new RouteLocationController();

RouteLocationRoute.post(
  '/create',
  AuthMiddleware,
  RouteCreatePermissionMiddleware,
  checkSchema(RouteLocationCreateValidation),
  RouteLocationUniqueCreateValidation,
  ValidationMiddleware,
  controller.create
);

RouteLocationRoute.put(
  '/:id(\\d+)/update',
  RouteLocationFetchMiddleware,
  AuthMiddleware,
  RouteLocationUpdatePermissionMiddleware,
  checkSchema(RouteLocationUpdateValidation),
  RouteLocationUniqueUpdateValidation,
  ValidationMiddleware,
  controller.update
);

RouteLocationRoute.delete(
  '/:id(\\d+)/delete',
  RouteLocationFetchMiddleware,
  AuthMiddleware,
  RouteLocationUpdatePermissionMiddleware,
  controller.delete
);

RouteLocationRoute.get(
  '/:id(\\d+)',
  RouteLocationFetchMiddleware,
  OptionalAuthMiddleware,
  RouteLocationFetchPermissionMiddleware,
  controller.get
);

module.exports = RouteLocationRoute;
