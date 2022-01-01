const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const Pagination = require("../http/Pagination");
const ProductRepository = require("../repository/ProductRepository");


module.exports = class ProductController {

  async add(req, res, next) {

    try {

      const _product = await ProductRepository.add(req.body);

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

  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._product'), req.data.product);

    res.status(StatusCodes.OK).send(response);
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

}


