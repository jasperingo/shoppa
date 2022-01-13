const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const StringGenerator = require("../http/StringGenerator");
const PasswordResetRepository = require("../repository/PasswordResetRepository");
const Hash = require("../security/Hash");

module.exports = class PasswordResetController {

  async reset(req, res, next) {
    
    try {

      const hashedPassword = await Hash.hashPassword(req.body.password);

      await PasswordResetRepository.resetPassword(req.data.passwordReset, hashedPassword);

      const response = new Response(Response.SUCCESS, req.__('_updated._password'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async createCustomer(req, res, next) {
    
    try {

      const token = await StringGenerator.passwordResetToken();

      await PasswordResetRepository.createCustomer(token, req.data.customer);

      const response = new Response(Response.SUCCESS, req.__('_created._password_reset'));

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async createAdministrator(req, res, next) {
    
    try {

      const token = await StringGenerator.passwordResetToken();

      await PasswordResetRepository.createAdministrator(token, req.data.administrator);

      const response = new Response(Response.SUCCESS, req.__('_created._password_reset'));

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }


}

