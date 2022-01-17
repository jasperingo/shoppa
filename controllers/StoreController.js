const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Pagination = require("../http/Pagination");
const Response = require("../http/Response");
const ReviewRepository = require("../repository/ReviewRepository");
const StoreRepository = require("../repository/StoreRepository");
const Hash = require("../security/Hash");
const JWT = require("../security/JWT");

module.exports = class StoreController {

  async register(req, res, next) {
    
    try {
      
      const hashedPassword = await Hash.hashPassword(req.body.administrator_password);
      
      const result = await StoreRepository.add(req.body, hashedPassword, req.data.customer.id);

      const store = await StoreRepository.getWithAdministrator(result.store.id, result.administrator.id);

      const token = await JWT.signStoreJWT(store);

      const response = new Response(Response.SUCCESS, req.__('_created._store'), {
        store,
        api_token: token
      });

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }
  
  async login(req, res, next) {

    try {

      const { store, administrator } = req.data;

      administrator.hidePassword();

      store.setDataValue('administrators', [administrator]);

      const token = await JWT.signStoreJWT(store.toJSON());

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

      const store = await StoreRepository.get(req.data.store.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._store'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePhoto(req, res, next) {

    try {

      await StoreRepository.updatePhoto(req.data.store, req.file.filename);
      
      const store = await StoreRepository.get(req.data.store.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._photo'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }
  
  async updateStatus(req, res, next) {
    
    try {

      await StoreRepository.updateStatus(req.data.store, req.body.status);
      
      const store = await StoreRepository.get(req.data.store.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._status'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }
  
  async get(req, res, next) {

    try {

      const { store } = req.data;

      store.review_summary = await ReviewRepository.getSummaryForStore(store);

      const response = new Response(Response.SUCCESS, req.__('_fetched._store'), store);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
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

