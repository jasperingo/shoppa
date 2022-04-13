
const express = require('express');
const { checkSchema } = require('express-validator');
const FavoriteController = require('../controllers/FavoriteController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const FavoriteFetchMiddleware = require('../middlewares/fetch/FavoriteFetchMiddleware');
const FavoriteAddPermissionMiddleware = require('../middlewares/permissions/favorite/FavoriteAddPermissionMiddleware');
const FavoriteDeletePermissionMiddleware = require('../middlewares/permissions/favorite/FavoriteDeletePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const FavoriteAddValidation = require('../validation/favorite/FavoriteAddValidation');

const router = express.Router();

const controller = new FavoriteController();

router.post(
  '/create',
  AuthMiddleware,
  FavoriteAddPermissionMiddleware,
  checkSchema(FavoriteAddValidation),
  ValidationMiddleware,
  controller.create
);

router.delete(
  '/:id(\\d+)/delete',
  FavoriteFetchMiddleware,
  AuthMiddleware,
  FavoriteDeletePermissionMiddleware,
  controller.delete
);

module.exports = router;
