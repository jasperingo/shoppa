const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const StoreRepository = require("../repository/StoreRepository");
const Hash = require("../security/Hash");
const JWT = require("../security/JWT");

module.exports = class StoreController {

  generateJWT = (store)=> {
    
    const admin = store.administrators[0];

    const obj = {
      id : admin.id,
      role: admin.role,
      type: admin.type,
      store: {
        id: store.id,
        name: store.user.name,
        email: store.user.email
      }
    };

    return JWT.signStoreJWT(obj);
  }

  register = async (req, res, next)=> {
    
    try {
      
      const hashedPassword = await Hash.hashPassword(req.body.administrator_password);
      
      const _store = await StoreRepository.add(req.body, hashedPassword, req.data.customer.id);

      const store = await StoreRepository.get(_store.id);

      const token = await this.generateJWT(store);

      const response = new Response(Response.SUCCESS, req.__('_created._store'), {
        store,
        api_token: token
      });

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  login = async (req, res, next)=> {

    res.send({ k: 99 });
  }

}

