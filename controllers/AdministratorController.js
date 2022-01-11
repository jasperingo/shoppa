
const { StatusCodes } = require("http-status-codes");
const Response = require("../http/Response");
const AdministratorRepository = require("../repository/AdministratorRepository");
const InternalServerException = require("../http/exceptions/InternalServerException");
const JWT = require("../security/JWT");
const Hash = require("../security/Hash");

module.exports = class AdministratorController {

  async login(req, res, next) {

    try {
      
      const { administrator } = req.data;

      const token = await JWT.signAdminJWT(administrator);

      administrator.hidePassword();

      const response = new Response(Response.SUCCESS, req.__('_login'), {
        administrator,
        api_token: token
      });

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePassword(req, res, next) {

    try {

      const hashedPassword = await Hash.hashPassword(req.body.password);
      
      await AdministratorRepository.updatePassword(req.params.id, hashedPassword);

      const response = new Response(Response.SUCCESS, req.__('_updated._password'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

}

