const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const Pagination = require("../http/Pagination");
const ProductRepository = require("../repository/ProductRepository");
const ReviewRepository = require("../repository/ReviewRepository");
const FavoriteRepository = require("../repository/FavoriteRepository");


module.exports = class ProductController {

  async create(req, res, next) {

    try {

      const _product = await ProductRepository.create(req.body, req.auth.storeId);

      const product = await ProductRepository.get(_product.id);

      const response = new Response(Response.SUCCESS, req.__('_created._product'), product);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async update(req, res, next) {

    try {

      await ProductRepository.update(req.data.product, req.body);

      const product = await ProductRepository.get(req.params.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._product'), product);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePhoto(req, res, next) {

    try {

      await ProductRepository.updatePhoto(req.data.product, req.file.filename);
      
      const product = await ProductRepository.get(req.params.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._photo'), product);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async delete(req, res, next) {

    try {

      await ProductRepository.delete(req.data.product);

      const response = new Response(Response.SUCCESS, req.__('_deleted._product'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async get(req, res, next) {

    try {

      const { product } = req.data;

      product.review_summary = await ReviewRepository.getSummaryForProduct(product);
      
      if (req.auth !== undefined && req.auth.customerId !== undefined) {
        
        const fav = await FavoriteRepository.getIdByProductAndCustomer(product.id, req.auth.customerId);

        product.setDataValue('favorites', fav === null ? [] : [fav]);

        const review = await ReviewRepository.getByProductAndCutomer(product.id, req.auth.customerId);

        product.setDataValue('reviews', review === null ? [] : [review]);
      }
      
      const response = new Response(Response.SUCCESS, req.__('_fetched._product'), product);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  async getListByStore(req, res, next) {
    
    try {

      const { pager, store } = req.data;

      const { count, rows } = await ProductRepository.getListByStore(store, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._product'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  async getListByStoreWithDiscount(req, res, next) {
    
    try {

      const { pager, store } = req.data;

      const { count, rows } = await ProductRepository.getListByStoreWithDiscount(store, req.params.discountId, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._product'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  async getRandomList(req, res, next) {
    
    try {

      const { pager } = req.data;

      const products = await ProductRepository.getRandomList(pager.page_limit);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._product'), products);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  async getListBySearch(req, res, next) {
    
    try {

      const { pager, searchParams } = req.data;

      const { count, rows } = await ProductRepository.getListBySearch(pager.page_offset, pager.page_limit, searchParams);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._product'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  async getRelatedList(req, res, next) {
    
    try {

      const { pager, product } = req.data;

      const { count, rows } = await ProductRepository.getRelatedList(product, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._product'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}


