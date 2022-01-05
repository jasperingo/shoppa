
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

const router = express.Router();

const controller = new RouteController();

router.post(
  '/add',
  AuthMiddleware,
  RouteAddPermissionMiddleware,
  checkSchema(RouteValidation),
  RouteAddUniqueValidation,
  ValidationMiddleware(),
  controller.add
);

router.put(
  '/:id(\\d+)/update',
  RouteFetchMiddleware,
  AuthMiddleware,
  RouteUpdatePermissionMiddleware,
  checkSchema(RouteValidation),
  RouteUpdateUniqueValidation,
  ValidationMiddleware(),
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
  controller.get
);


module.exports = router;

