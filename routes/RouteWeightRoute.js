
const express = require('express');
const { checkSchema } = require('express-validator');
const RouteWeightController = require('../controllers/RouteWeightController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RouteWeightFetchMiddleware = require('../middlewares/fetch/RouteWeightFetchMiddleware');
const OptionalAuthMiddleware = require('../middlewares/OptionalAuthMiddleware');
const RouteWeightCreatePermissionMiddleware = require('../middlewares/permissions/route/RouteWeightAndDurationCreatePermissionMiddleware');
const RouteWeightFetchPermissionMiddleware = require('../middlewares/permissions/route/RouteWeightFetchPermissionMiddleware');
const RouteWeightUpdatePermissionMiddleware = require('../middlewares/permissions/route/RouteWeightUpdatePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const RouteWeightCreateUniqueValidation = require('../validation/route/RouteWeightCreateUniqueValidation');
const RouteWeightUpdateUniqueValidation = require('../validation/route/RouteWeightUpdateUniqueValidation');
const RouteWeightValidation = require('../validation/route/RouteWeightValidation');

const router = express.Router();

const controller = new RouteWeightController();

router.post(
  '/create',
  AuthMiddleware,
  RouteWeightCreatePermissionMiddleware,
  checkSchema(RouteWeightValidation),
  RouteWeightCreateUniqueValidation,
  ValidationMiddleware,
  controller.create
);

router.put(
  '/:id(\\d+)/update',
  RouteWeightFetchMiddleware,
  AuthMiddleware,
  RouteWeightUpdatePermissionMiddleware,
  checkSchema(RouteWeightValidation),
  RouteWeightUpdateUniqueValidation,
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
