const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Pagination = require("../http/Pagination");
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
      
      const result = await StoreRepository.add(req.body, hashedPassword, req.data.customer.id);

      const store = await StoreRepository.getWithAdministrator(result.store.id, result.administrator.id);

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

    try {

      const store = await StoreRepository.getWithAdministrator(req.data.store.id, req.data.administrator.id);

      const token = await this.generateJWT(store);

      const response = new Response(Response.SUCCESS, req.__('_login'), {
        store,
        api_token: token
      });

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async update(req, res, next) {

    try {

      await StoreRepository.update(req.data.store, req.body);

      const store = await StoreRepository.get(req.params.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._store'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePhoto(req, res, next) {

    try {

      await StoreRepository.updatePhoto(req.data.store, req.file.filename);
      
      const store = await StoreRepository.get(req.params.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._photo'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }
  
  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._store'), req.data.store);

    res.status(StatusCodes.OK).send(response);
  }

  async getList(req, res, next) {

    try {

      const { pager } = req.data;

      const { count, rows } = await StoreRepository.getList(pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._store'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }


}

