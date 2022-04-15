const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");
const ResponseDTO = require("../utils/ResponseDTO");
const EmailService = require("../emailService");
const UserRepository = require("../repository/UserRepository");

module.exports = class EmailVerificationController {

  async send(req, res, next) {

    try {

      const { user } = req.data;

      await EmailService.send(
        user.email,
        EmailService.EMAIL_VERIFICATION, 
        { 
          name: user.name,
          token: user.email_verification_token
        }
      );
      
      const response = ResponseDTO.success(req.__('_updated._email_verification_token'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async verify(req, res, next) {

    try {

      await UserRepository.updateEmailVerified(req.data.user, true);

      const response = ResponseDTO.success(req.__('_updated._email_verified'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
