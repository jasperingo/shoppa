
const express = require('express');
const { checkSchema } = require('express-validator');
const RouteController = require('../controllers/RouteController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RouteCreatePermissionMiddleware = require('../middlewares/permissions/route/RouteCreatePermissionMiddleware');
const RouteUpdatePermissionMiddleware = require('../middlewares/permissions/route/RouteUpdatePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const RouteCreateValidation = require('../validation/route/RouteCreateValidation');
const RouteUpdateValidation = require('../validation/route/RouteUpdateValidation');
const RouteFetchMiddleware = require('../middlewares/fetch/RouteFetchMiddleware');
const OptionalAuthMiddleware = require('../middlewares/OptionalAuthMiddleware');
const RouteFetchPermissionMiddleware = require('../middlewares/permissions/route/RouteFetchPermissionMiddleware');

const router = express.Router();

const controller = new RouteController();

router.post(
  '/create',
  AuthMiddleware,
  RouteCreatePermissionMiddleware,
  checkSchema(RouteCreateValidation),
  ValidationMiddleware,
  controller.create
);

router.put(
  '/:id(\\d+)/update',
  RouteFetchMiddleware,
  AuthMiddleware,
  RouteUpdatePermissionMiddleware,
  checkSchema(RouteUpdateValidation),
  ValidationMiddleware,
  controller.update
);

router.delete(
  '/:id(\\d+)/delete',
  RouteFetchMiddleware,
  AuthMiddleware,
  RouteUpdatePermissionMiddleware,
  controller.delete
);

router.get(
  '/:id(\\d+)',
  RouteFetchMiddleware,
  OptionalAuthMiddleware,
  RouteFetchPermissionMiddleware,
  controller.get
);

module.exports = router;
