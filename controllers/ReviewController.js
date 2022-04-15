const { StatusCodes } = require("http-status-codes");
const Pagination = require("../utils/Pagination");
const ResponseDTO = require("../utils/ResponseDTO");
const ReviewRepository = require("../repository/ReviewRepository");
const createHttpError = require("http-errors");

module.exports = class ReviewController {

  async createForProduct(req, res, next) {

    try {

      const result = await ReviewRepository.createForProduct(req.body, req.auth.customerId);

      const review = await ReviewRepository.get(result.id);

      const response = ResponseDTO.success(req.__('_created._review'), review);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async createForStore(req, res, next) {
    
    try {

      const _review = await ReviewRepository.createForStore(req.body, req.auth.customerId);

      const review = await ReviewRepository.get(_review.id);

      const response = ResponseDTO.success(req.__('_created._review'), review);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }
  
  async createForDeliveryFirm(req, res, next) {
    
    try {

      const _review = await ReviewRepository.createForDeliveryFirm(req.body, req.auth.customerId);

      const review = await ReviewRepository.get(_review.id);

      const response = ResponseDTO.success(req.__('_created._review'), review);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async update(req, res, next) {
    
    try {

      const _review = req.data.review;
      
      await ReviewRepository.update(_review, req.body);

      const review = await ReviewRepository.get(_review.id);

      const response = ResponseDTO.success(req.__('_updated._review'), review);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async delete(req, res, next) {
    
    try {
      
      await ReviewRepository.delete(req.data.review);

      const response = ResponseDTO.success(req.__('_deleted._review'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListByProduct(req, res, next) {
    
    try {

      const { pager, product } = req.data;

      const { count, rows } = await ReviewRepository.getListByProduct(product, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._review'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListByStore(req, res, next) {
    
    try {

      const { pager, store } = req.data;

      const { count, rows } = await ReviewRepository.getListByStore(store, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._review'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }
  
  async getListByDeliveryFirm(req, res, next) {
    
    try {

      const { pager, deliveryFirm } = req.data;

      const { count, rows } = await ReviewRepository.getListByDeliveryFirm(deliveryFirm, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._review'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
