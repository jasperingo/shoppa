
const { StatusCodes } = require("http-status-codes");
const Response = require("../http/Response");
const AdministratorRepository = require("../repository/AdministratorRepository");
const InternalServerException = require("../http/exceptions/InternalServerException");
const { signAdminJWT } = require("../security/JWT");
const { hashPassword } = require("../security/Hash");

module.exports = class AdministratorController {

  generateJWT(admin) {

    admin.hidePassword();

    const obj = {
      id : admin.id,
      type: admin.type,
      role: admin.role,
      customer: {
        id: admin.customer.id,
        first_name: admin.customer.first_name,
        last_name: admin.customer.last_name,
        email: admin.customer.user.email
      }
    };

    return signAdminJWT(obj);
  }

  login = async (req, res, next)=> {

    try {
      
      const { administrator } = req.data;

      const token = await this.generateJWT(administrator);

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

      const hashedPassword = await hashPassword(req.body.password);
      
      await AdministratorRepository.updatePassword(req.params.id, hashedPassword);

      const response = new Response(Response.SUCCESS, req.__('_updated._password'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

}

