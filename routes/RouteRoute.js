
const express = require('express');
const { checkSchema } = require('express-validator');
const RouteController = require('../controllers/RouteController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RouteAddPermissionMiddleware = require('../middlewares/permissions/route/RouteAddPermissionMiddleware');
const RouteUpdatePermissionMiddleware = require('../middlewares/permissions/route/RouteUpdatePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const RouteValidation = require('../validation/route/RouteValidation');
const RouteAddUniqueValidation = require('../validation/route/RouteAddUniqueValidation');
const RouteFetchMiddleware = require('../middlewares/fetch/RouteFetchMiddleware');
const RouteUpdateUniqueValidation = require('../validation/route/RouteUpdateUniqueValidation');
const OptionalAuthMiddleware = require('../middlewares/OptionalAuthMiddleware');
const RouteFetchPermissionMiddleware = require('../middlewares/permissions/route/RouteFetchPermissionMiddleware');
const LinkRouteValidation = require('../validation/route/LinkRouteValidation');
const LinkRouteCreateUniqueValidation = require('../validation/route/LinkRouteCreateUniqueValidation');
const LinkRouteUpdateUniqueValidation = require('../validation/route/LinkRouteUpdateUniqueValidation');

const router = express.Router();

const controller = new RouteController();

router.post(
  '/create',
  AuthMiddleware,
  RouteAddPermissionMiddleware,
  checkSchema(RouteValidation),
  RouteAddUniqueValidation,
  ValidationMiddleware,
  controller.create
);

router.post(
  '/link/create',
  AuthMiddleware,
  RouteAddPermissionMiddleware,
  checkSchema(LinkRouteValidation),
  LinkRouteCreateUniqueValidation,
  ValidationMiddleware,
  controller.createLink
);

router.put(
  '/:id(\\d+)/update',
  RouteFetchMiddleware,
  AuthMiddleware,
  RouteUpdatePermissionMiddleware,
  checkSchema(RouteValidation),
  RouteUpdateUniqueValidation,
  ValidationMiddleware,
  controller.update
);

router.put(
  '/:id(\\d+)/link/update',
  RouteFetchMiddleware,
  AuthMiddleware,
  RouteUpdatePermissionMiddleware,
  checkSchema(LinkRouteValidation),
  LinkRouteUpdateUniqueValidation,
  ValidationMiddleware,
  controller.updateLink
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
