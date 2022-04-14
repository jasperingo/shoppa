const { StatusCodes } = require("http-status-codes");
const EmailService = require("../emailService");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
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
          verificationLink: `${process.env.CLIENT_DOMAIN_NAME}email-verification?token=${user.email_verification_token}`
        }
      );
      
      const response = new Response(Response.SUCCESS, req.__('_updated._email_verification_token'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async verify(req, res, next) {

    try {

      await UserRepository.updateEmailVerified(req.data.user, true);

      const response = new Response(Response.SUCCESS, req.__('_updated._email_verified'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

}
