
const express = require('express');
const { checkSchema } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const InternalServerException = require('../http/exceptions/InternalServerException');
const Response = require('../http/Response');
const StringGenerator = require('../http/StringGenerator');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const UserRepository = require('../repository/UserRepository');
const EmailVerificationCreateValidation = require('../validation/email_verification/EmailVerificationCreateValidation');
const EmailVerificationVerifyValidation = require('../validation/email_verification/EmailVerificationVerifyValidation');

const EmailVerificationRoute = express.Router();

EmailVerificationRoute.post(
  '/send',
  checkSchema(EmailVerificationCreateValidation),
  ValidationMiddleware,
  async function(req, res, next) {

    try {

      const emailToken = await StringGenerator.emailVerificationToken();

      await UserRepository.updateEmailVerificationToken(req.data.user, emailToken);

      //TODO: send email...

      const response = new Response(Response.SUCCESS, req.__('_updated._email_verification_token'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }
);

EmailVerificationRoute.get(
  '/verify',
  checkSchema(EmailVerificationVerifyValidation),
  ValidationMiddleware,
  async function(req, res, next) {

    try {

      await UserRepository.updateEmailVerified(req.data.user, true);

      const response = new Response(Response.SUCCESS, req.__('_updated._email_verified'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }
);

module.exports = EmailVerificationRoute;
