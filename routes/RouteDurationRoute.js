
const express = require('express');
const { checkSchema } = require('express-validator');
const RouteDurationController = require('../controllers/RouteDurationController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RouteDurationCreatePermissionMiddleware = require('../middlewares/permissions/route/RouteWeightAndDurationCreatePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const RouteDurationCreateUniqueValidation = require('../validation/route/RouteDurationCreateUniqueValidation');
const RouteDurationValidation = require('../validation/route/RouteDurationValidation');
const RouteDurationFetchMiddleware = require('../middlewares/fetch/RouteDurationFetchMiddleware');
const RouteDurationUpdatePermissionMiddleware = require('../middlewares/permissions/route/RouteDurationUpdatePermissionMiddleware');
const RouteDurationUpdateUniqueValidation = require('../validation/route/RouteDurationUpdateUniqueValidation');
const OptionalAuthMiddleware = require('../middlewares/OptionalAuthMiddleware');
const RouteDurationFetchPermissionMiddleware = require('../middlewares/permissions/route/RouteDurationFetchPermissionMiddleware');

const router = express.Router();

const controller = new RouteDurationController();

router.post(
  '/create',
  AuthMiddleware,
  RouteDurationCreatePermissionMiddleware,
  checkSchema(RouteDurationValidation),
  RouteDurationCreateUniqueValidation,
  ValidationMiddleware,
  controller.create
);

router.put(
  '/:id(\\d+)/update',
  RouteDurationFetchMiddleware,
  AuthMiddleware,
  RouteDurationUpdatePermissionMiddleware,
  checkSchema(RouteDurationValidation),
  RouteDurationUpdateUniqueValidation,
  ValidationMiddleware,
  controller.update
);

router.delete(
  '/:id(\\d+)/delete',
  RouteDurationFetchMiddleware,
  AuthMiddleware,
  RouteDurationUpdateUniqueValidation,
  controller.delete
);

router.get(
  '/:id(\\d+)',
  RouteDurationFetchMiddleware,
  OptionalAuthMiddleware,
  RouteDurationFetchPermissionMiddleware,
  controller.get
);

module.exports = router;
