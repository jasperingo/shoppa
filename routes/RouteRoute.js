
const express = require('express');
const { checkSchema } = require('express-validator');
const RouteController = require('../controllers/RouteController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const RouteAddPermissionMiddleware = require('../middlewares/permissions/route/RouteAddPermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const RouteAddValidation = require('../validation/route/RouteAddValidation');

const router = express.Router();

const controller = new RouteController();

router.post(
  '/add',
  AuthMiddleware,
  RouteAddPermissionMiddleware,
  checkSchema(RouteAddValidation),
  ValidationMiddleware(),
  controller.add
);

module.exports = router;

