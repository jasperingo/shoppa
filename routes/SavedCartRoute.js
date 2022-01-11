
const express = require('express');
const { checkSchema } = require('express-validator');
const SavedCartController = require('../controllers/SavedCartController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const SavedCartFetchMiddleware = require('../middlewares/fetch/SavedCartFetchMiddleware');
const SavedCartFetchByCodeMiddleware = require('../middlewares/fetch/SavedCartFetchByCodeMiddleware');
const SavedCartCreatePermissionMiddleware = require('../middlewares/permissions/saved_cart/SavedCartCreatePermissionMiddleware');
const SavedCartDeletePermissionMiddleware = require('../middlewares/permissions/saved_cart/SavedCartDeletePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const SavedCartCreateValidation = require('../validation/saved_cart/SavedCartCreateValidation');

const router = express.Router();

const controller = new SavedCartController();

router.post(
  '/create',
  AuthMiddleware,
  SavedCartCreatePermissionMiddleware,
  checkSchema(SavedCartCreateValidation),
  ValidationMiddleware(),
  controller.create
);

router.delete(
  '/:id(\\d+)/delete',
  SavedCartFetchMiddleware,
  AuthMiddleware,
  SavedCartDeletePermissionMiddleware,
  controller.delete
);

router.get(
  '/:id(\\d+)',
  SavedCartFetchMiddleware,
  controller.get
);

router.get(
  '/:id(\\w+)',
  SavedCartFetchByCodeMiddleware,
  controller.get
);

module.exports = router;

