const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");
const EmailService = require("../emailService");
const StringGenerator = require("../utils/StringGenerator");
const Administrator = require("../models/Administrator");
const PasswordReset = require("../models/PasswordReset");
const PasswordResetRepository = require("../repository/PasswordResetRepository");
const Hash = require("../security/Hash");
const ResponseDTO = require("../utils/ResponseDTO");

module.exports = class PasswordResetController {

  async reset(req, res, next) {
    
    try {

      const hashedPassword = await Hash.hashPassword(req.body.password);

      await PasswordResetRepository.resetPassword(req.data.passwordReset, hashedPassword);

      const response = ResponseDTO.success(req.__('_updated._password'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async createCustomer(req, res, next) {
    
    try {

      const { customer } = req.data;

      const token = await StringGenerator.passwordResetToken();

      await PasswordResetRepository.createCustomer(token, customer);

      await EmailService.send(customer.user.email, EmailService.PASSWORD_RESET, { token, expires: PasswordReset.EXPIRE_DURATION / (1000 * 60) });
      
      const response = ResponseDTO.success(req.__('_created._password_reset'));

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async createAdministrator(req, res, next) {
    
    try {

      const { administrator } = req.data;

      const token = await StringGenerator.passwordResetToken();

      await PasswordResetRepository.createAdministrator(token, administrator);

      let type, name;

      if (administrator.type === Administrator.TYPE_STORE) {
        type = Administrator.TYPE_STORE;
        name = req.data.store.user.name;
      } else if (administrator.type === Administrator.TYPE_DELIVERY_FIRM) {
        type = Administrator.TYPE_DELIVERY_FIRM;
        name = req.data.deliveryFirm.user.name;
      } else if (administrator.type === Administrator.TYPE_APPLICATION) {
        type = 'administrator';
        name = 'account';
      }
      
      await EmailService.send(administrator.customer.user.email, EmailService.PASSWORD_RESET, { type, name, token, expires: PasswordReset.EXPIRE_DURATION / (1000 * 60) });

      const response = ResponseDTO.success(req.__('_created._password_reset'));

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }
}
