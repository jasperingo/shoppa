
const express = require('express');
const { checkSchema } = require('express-validator');
const DiscountController = require('../controllers/DiscountController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const DiscountCreatePermissionMiddleware = require('../middlewares/permissions/discount/DiscountCreatePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const DiscountCreateValidation = require('../validation/discount/DiscountCreateValidation');

const router = express.Router();

const controller = new DiscountController();

router.post(
  '/create',
  AuthMiddleware,
  DiscountCreatePermissionMiddleware,
  checkSchema(DiscountCreateValidation),
  ValidationMiddleware(),
  controller.create
);

module.exports = router;

