const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Pagination = require("../http/Pagination");
const Response = require("../http/Response");
const AdministratorRepository = require("../repository/AdministratorRepository");
const ReviewRepository = require("../repository/ReviewRepository");
const StoreRepository = require("../repository/StoreRepository");
const Hash = require("../security/Hash");
const JWT = require("../security/JWT");

module.exports = class StoreController {

  async register(req, res, next) {
    
    try {
      
      const hashedPassword = await Hash.hashPassword(req.body.administrator_password);
      
      const result = await StoreRepository.add(req.body, hashedPassword, req.data.customer.id);

      const store = await StoreRepository.get(result.store.id);

      const administrator = await AdministratorRepository.get(result.administrator.id);

      store.review_summary = await ReviewRepository.getSummaryForStore(store);

      administrator.hidePassword();

      store.setDataValue('administrators', [administrator]);

      const token = await JWT.signStoreJWT(store.toJSON());

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

      store.review_summary = await ReviewRepository.getSummaryForStore(store);

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

      store.review_summary = await ReviewRepository.getSummaryForStore(store);

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

      store.review_summary = await ReviewRepository.getSummaryForStore(store);

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

      store.review_summary = await ReviewRepository.getSummaryForStore(store);

      const response = new Response(Response.SUCCESS, req.__('_updated._status'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updateRecommended(req, res, next) {
    
    try {

      await StoreRepository.updateRecommended(req.data.store, req.body.recommended);
      
      const store = await StoreRepository.get(req.data.store.id);

      store.review_summary = await ReviewRepository.getSummaryForStore(store);

      const response = new Response(Response.SUCCESS, req.__('_updated._store'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updateStatus(req, res, next) {
    
    try {

      await StoreRepository.updateStatus(req.data.store, req.body.status);
      
      const store = await StoreRepository.get(req.data.store.id);

      store.review_summary = await ReviewRepository.getSummaryForStore(store);

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

      if (req.auth !== undefined && req.auth.customerId !== undefined) {

        store.review_summary.customer_can_review = await ReviewRepository.canReviewStore(store.id, req.auth.customerId);

        const review = await ReviewRepository.getByStoreAndCutomer(store.id, req.auth.customerId);

        store.setDataValue('reviews', review === null ? [] : [review]);
      }
      
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

  async getRandomList(req, res, next) {

    try {

      const { pager } = req.data;

      const stores = await StoreRepository.getRandomList(pager.page_limit);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._store'), stores);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  async getListByRecommended(req, res, next) {

    try {

      const { pager } = req.data;

      const stores = await StoreRepository.getListByRecommended(pager.page_limit);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._store'), stores);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  async getListBySearch(req, res, next) {

    try {

      const { pager, searchParams } = req.data;

      const { count, rows } = await StoreRepository.getListBySearch(pager.page_offset, pager.page_limit, searchParams);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._store'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}

