const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");
const ResponseDTO = require("../utils/ResponseDTO");
const Pagination = require("../utils/Pagination");
const ProductRepository = require("../repository/ProductRepository");
const ReviewRepository = require("../repository/ReviewRepository");
const FavoriteRepository = require("../repository/FavoriteRepository");

module.exports = class ProductController {

  async create(req, res, next) {

    try {

      const _product = await ProductRepository.create(req.body, req.auth.storeId);

      const product = await ProductRepository.get(_product.id);

      const response = ResponseDTO.success(req.__('_created._product'), product);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async update(req, res, next) {

    try {

      await ProductRepository.update(req.data.product, req.body);

      const product = await ProductRepository.get(req.data.product.id);

      product.review_summary = await ReviewRepository.getSummaryForProduct(product);

      const response =ResponseDTO.success(req.__('_updated._product'), product);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async updatePhoto(req, res, next) {

    try {

      await ProductRepository.updatePhoto(req.data.product, req.file.filename);
      
      const product = await ProductRepository.get(req.data.product.id);

      product.review_summary = await ReviewRepository.getSummaryForProduct(product);

      const response = ResponseDTO.success(req.__('_updated._photo'), product);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async updateRecommended(req, res, next) {

    try {

      await ProductRepository.updateRecommended(req.data.product, req.body.recommended);

      const product = await ProductRepository.get(req.data.product.id);

      product.review_summary = await ReviewRepository.getSummaryForProduct(product);

      const response = ResponseDTO.success(req.__('_updated._product'), product);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async delete(req, res, next) {

    try {

      await ProductRepository.delete(req.data.product);

      const response = ResponseDTO.success(req.__('_deleted._product'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async get(req, res, next) {

    try {

      const { product } = req.data;

      product.review_summary = await ReviewRepository.getSummaryForProduct(product);
      
      if (req.auth !== undefined && req.auth.customerId !== undefined) {

        product.review_summary.customer_can_review = await ReviewRepository.canReviewProduct(product.id, req.auth.customerId);
        
        const fav = await FavoriteRepository.getIdByProductAndCustomer(product.id, req.auth.customerId);

        product.setDataValue('favorites', fav === null ? [] : [fav]);

        const review = await ReviewRepository.getByProductAndCutomer(product.id, req.auth.customerId);

        product.setDataValue('reviews', review === null ? [] : [review]);
      }
      
      const response = ResponseDTO.success(req.__('_fetched._product'), product);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListByStore(req, res, next) {
    
    try {

      const { pager, store, productFilter } = req.data;

      const { count, rows } = await ProductRepository.getListByStore(
        store, 
        pager.page_offset, 
        pager.page_limit, 
        productFilter
      );

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._product'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListByStoreWithDiscount(req, res, next) {
    
    try {

      const { pager, store } = req.data;

      const { count, rows } = await ProductRepository.getListByStoreWithDiscount(
        store, 
        req.params.discountId, 
        pager.page_offset, 
        pager.page_limit
      );

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._product'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getRandomList(req, res, next) {
    
    try {

      const { pager, productFilter } = req.data;

      const products = await ProductRepository.getRandomList(pager.page_limit, productFilter);

      const response = ResponseDTO.success(req.__('_list_fetched._product'), products);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListByRecommeded(req, res, next) {
    
    try {

      const { pager, productFilter } = req.data;

      const products = await ProductRepository.getListByRecommended(pager.page_limit, productFilter);

      const response = ResponseDTO.success(req.__('_list_fetched._product'), products);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListBySearch(req, res, next) {
    
    try {

      const { pager, searchParams, productFilter } = req.data;

      const { count, rows } = await ProductRepository.getListBySearch(
        pager.page_offset, 
        pager.page_limit, 
        { ...productFilter, ...searchParams }
      );

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._product'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getRelatedList(req, res, next) {
    
    try {

      const { pager, product, productFilter } = req.data;

      const { count, rows } = await ProductRepository.getRelatedList(
        product, 
        pager.page_offset, 
        pager.page_limit,
        productFilter
      );

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._product'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
