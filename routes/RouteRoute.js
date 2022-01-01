
const express = require('express');
const { checkSchema } = require('express-validator');
const RouteController = require('../controllers/RouteController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RouteAddPermissionMiddleware = require('../middlewares/permissions/route/RouteAddPermissionMiddleware');
const RouteUpdatePermissionMiddleware = require('../middlewares/permissions/route/RouteUpdatePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const RouteAddValidation = require('../validation/route/RouteAddValidation');
const RouteUpdateValidation = require('../validation/route/RouteUpdateValidation');
const RouteAddValidationMiddleware = require('../validation/route/RouteAddValidationMiddleware');
const RouteFetchMiddleware = require('../middlewares/fetch/RouteFetchMiddleware');
const RouteUpdateValidationMiddleware = require('../validation/route/RouteUpdateValidationMiddleware');

const router = express.Router();

const controller = new RouteController();

router.post(
  '/add',
  AuthMiddleware,
  RouteAddPermissionMiddleware,
  checkSchema(RouteAddValidation),
  RouteAddValidationMiddleware,
  ValidationMiddleware(),
  controller.add
);

router.put(
  '/:id(\\d+)/update',
  RouteFetchMiddleware,
  AuthMiddleware,
  RouteUpdatePermissionMiddleware,
  checkSchema(RouteUpdateValidation),
  RouteUpdateValidationMiddleware,
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

