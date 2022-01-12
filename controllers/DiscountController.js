const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Pagination = require("../http/Pagination");
const Response = require("../http/Response");
const DiscountRepository = require("../repository/DiscountRepository");


module.exports = class DiscountController {

  async create(req, res, next) {
    
    try {

      const _discount = await DiscountRepository.create(req.body, req.auth.storeId);

      const discount = await DiscountRepository.get(_discount.id);

      const response = new Response(Response.SUCCESS, req.__('_created._discount'), discount);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async update(req, res, next) {
    
    try {

      await DiscountRepository.update(req.data.discount, req.body);
      
      const discount = await DiscountRepository.get(req.params.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._discount'), discount);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async delete(req, res, next) {

    try {

      await DiscountRepository.delete(req.data.discount);

      const response = new Response(Response.SUCCESS, req.__('_deleted._discount'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._discount'), req.data.discount);

    res.status(StatusCodes.OK).send(response);
  }

  async getListByStore(req, res, next) {
    
    try {

      const { pager, store } = req.data;

      const { count, rows } = await DiscountRepository.getListByStore(store, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._discount'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}


