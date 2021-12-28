const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const DeliveryFirmRepository = require("../repository/DeliveryFirmRepository");
const Hash = require("../security/Hash");
const JWT = require("../security/JWT");


module.exports = class DeliveryFirmController {

  generateJWT(delivery) {
    
    const admin = delivery.administrators[0];

    const obj = {
      id : admin.id,
      role: admin.role,
      type: admin.type,
      delivery_firm: {
        id: delivery.id,
        name: delivery.user.name,
        email: delivery.user.email
      }
    };

    return JWT.signDeliveryFirmJWT(obj);
  }

  register = async (req, res, next)=> {
    
    try {
      
      const hashedPassword = await Hash.hashPassword(req.body.administrator_password);
      
      const result = await DeliveryFirmRepository.add(req.body, hashedPassword, req.data.customer);

      const deliveryFirm = await DeliveryFirmRepository.getWithAdministrator(result.deliveryFirm.id, result.administrator.id);

      const token = await this.generateJWT(deliveryFirm);

      const response = new Response(Response.SUCCESS, req.__('_created._store'), {
        deliveryFirm,
        api_token: token
      });

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      console.log(error)
      next(new InternalServerException(error));
    }
  }

  login = async (req, res, next)=> {

    res.send({ j:99 });
  }



}

