
const express = require('express');
const { checkSchema } = require('express-validator');
const EmailVerificationController = require('../controllers/EmailVerificationController');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const EmailVerificationCreateValidation = require('../validation/email_verification/EmailVerificationCreateValidation');
const EmailVerificationVerifyValidation = require('../validation/email_verification/EmailVerificationVerifyValidation');

const EmailVerificationRoute = express.Router();

const controller = new EmailVerificationController();

EmailVerificationRoute.post(
  '/send',
  checkSchema(EmailVerificationCreateValidation),
  ValidationMiddleware,
  controller.send
);

EmailVerificationRoute.get(
  '/verify',
  checkSchema(EmailVerificationVerifyValidation),
  ValidationMiddleware,
  controller.verify
);

module.exports = EmailVerificationRoute;
