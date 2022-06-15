const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");
const Pagination = require("../utils/Pagination");
const ResponseDTO = require("../utils/ResponseDTO");
const EmailService = require("../emailService");
const StringGenerator = require("../utils/StringGenerator");
const AdministratorRepository = require("../repository/AdministratorRepository");
const ReviewRepository = require("../repository/ReviewRepository");
const StoreRepository = require("../repository/StoreRepository");
const Hash = require("../security/Hash");
const JWT = require("../security/JWT");
const User = require("../models/User");

module.exports = class StoreController {

  async register(req, res, next) {
    
    try {

      const emailToken = await StringGenerator.emailVerificationToken();
      
      const hashedPassword = await Hash.hashPassword(req.body.administrator_password);
      
      const result = await StoreRepository.add(req.body, hashedPassword, req.data.customer.id, emailToken);

      const store = await StoreRepository.get(result.store.id);

      const administrator = await AdministratorRepository.get(result.administrator.id);

      store.review_summary = await ReviewRepository.getSummaryForStore(store);

      administrator.hidePassword();

      store.setDataValue('administrators', [administrator]);

      const response = ResponseDTO.success(req.__('_created._store'), store);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }
  
  async login(req, res, next) {

    try {

      const { store, administrator } = req.data;

      store.review_summary = await ReviewRepository.getSummaryForStore(store);

      administrator.hidePassword();

      store.setDataValue('administrators', [administrator]);

      const token = await JWT.signStoreJWT(store.toJSON());

      const response = ResponseDTO.success(req.__('_login'), {
        store,
        api_token: token
      });

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async update(req, res, next) {

    try {

      await StoreRepository.update(req.data.store, req.body);

      const store = await StoreRepository.get(req.data.store.id);

      store.review_summary = await ReviewRepository.getSummaryForStore(store);

      const response = ResponseDTO.success(req.__('_updated._store'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async updatePhoto(req, res, next) {

    try {

      await StoreRepository.updatePhoto(req.data.store, req.file.filename);
      
      const store = await StoreRepository.get(req.data.store.id);

      store.review_summary = await ReviewRepository.getSummaryForStore(store);

      const response = ResponseDTO.success(req.__('_updated._photo'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }
  
  async updateStatus(req, res, next) {
    
    try {

      await StoreRepository.updateStatus(req.data.store, req.body.status);
      
      const store = await StoreRepository.get(req.data.store.id);

      store.review_summary = await ReviewRepository.getSummaryForStore(store);
      
      if (req.body.status === User.STATUS_ACTIVE && !store.email_verified) 
        await EmailService.send(
          store.user.email,
          EmailService.EMAIL_VERIFICATION, 
          { 
            name: store.user.name,
            token: store.user.email_verification_token
          }
        );

      const response = ResponseDTO.success(req.__('_updated._status'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async updateRecommended(req, res, next) {
    
    try {

      await StoreRepository.updateRecommended(req.data.store, req.body.recommended);
      
      const store = await StoreRepository.get(req.data.store.id);

      store.review_summary = await ReviewRepository.getSummaryForStore(store);

      const response = ResponseDTO.success(req.__('_updated._store'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
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
      
      const response = ResponseDTO.success(req.__('_fetched._store'), store);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getList(req, res, next) {

    try {

      const { pager } = req.data;

      const { count, rows } = await StoreRepository.getList(pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._store'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getRandomList(req, res, next) {

    try {

      const { pager } = req.data;

      const stores = await StoreRepository.getRandomList(pager.page_limit);

      const response = ResponseDTO.success(req.__('_list_fetched._store'), stores);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListByRecommended(req, res, next) {

    try {

      const { pager } = req.data;

      const stores = await StoreRepository.getListByRecommended(pager.page_limit);

      const response = ResponseDTO.success(req.__('_list_fetched._store'), stores);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListBySearch(req, res, next) {

    try {

      const { pager, searchParams } = req.data;

      const { count, rows } = await StoreRepository.getListBySearch(pager.page_offset, pager.page_limit, searchParams);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._store'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}

