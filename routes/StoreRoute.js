
const express = require('express');
const { checkSchema } = require('express-validator');
const StoreController = require('../controllers/StoreController');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const StoreLoginValidation = require('../validation/store/StoreLoginValidation');
const StoreRegisterValidation = require('../validation/store/StoreRegisterValidation');

const router = express.Router();

const controller = new StoreController();

router.post(
  '/register', 
  checkSchema(StoreRegisterValidation),
  ValidationMiddleware(),
  controller.register
);

router.post(
  '/login',
  checkSchema(StoreLoginValidation),
  ValidationMiddleware(),
  controller.login
);



module.exports = router;
