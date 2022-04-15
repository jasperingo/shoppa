
const express = require('express');
const { checkSchema } = require('express-validator');
const RouteWeightController = require('../controllers/RouteWeightController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RouteWeightFetchMiddleware = require('../middlewares/fetch/RouteWeightFetchMiddleware');
const OptionalAuthMiddleware = require('../middlewares/OptionalAuthMiddleware');
const RouteCreatePermissionMiddleware = require('../middlewares/permissions/route/RouteCreatePermissionMiddleware');
const RouteWeightFetchPermissionMiddleware = require('../middlewares/permissions/route/RouteWeightFetchPermissionMiddleware');
const RouteWeightUpdatePermissionMiddleware = require('../middlewares/permissions/route/RouteWeightUpdatePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const RouteWeightUniqueCreateValidation = require('../validation/route/RouteWeightUniqueCreateValidation');
const RouteWeightUniqueUpdateValidation = require('../validation/route/RouteWeightUniqueUpdateValidation');
const RouteWeightCreateValidation = require('../validation/route/RouteWeightCreateValidation');
const RouteWeightUpdateValidation = require('../validation/route/RouteWeightUpdateValidation');

const router = express.Router();

const controller = new RouteWeightController();

router.post(
  '/create',
  AuthMiddleware,
  RouteCreatePermissionMiddleware,
  checkSchema(RouteWeightCreateValidation),
  RouteWeightUniqueCreateValidation,
  ValidationMiddleware,
  controller.create
);

router.put(
  '/:id(\\d+)/update',
  RouteWeightFetchMiddleware,
  AuthMiddleware,
  RouteWeightUpdatePermissionMiddleware,
  checkSchema(RouteWeightUpdateValidation),
  RouteWeightUniqueUpdateValidation,
  ValidationMiddleware,
  controller.update
);

router.delete(
  '/:id(\\d+)/delete',
  RouteWeightFetchMiddleware,
  AuthMiddleware,
  RouteWeightUpdatePermissionMiddleware,
  controller.delete
);

router.get(
  '/:id(\\d+)',
  RouteWeightFetchMiddleware,
  OptionalAuthMiddleware,
  RouteWeightFetchPermissionMiddleware,
  controller.get
);

module.exports = router;
