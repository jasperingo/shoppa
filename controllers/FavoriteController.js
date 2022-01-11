const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Pagination = require("../http/Pagination");
const Response = require("../http/Response");
const FavoriteRepository = require("../repository/FavoriteRepository");


module.exports = class FavoriteController {

  async create(req, res, next) {

    try {

      const _favorite = await FavoriteRepository.create(req.body, req.auth.customerId);

      const favorite = await FavoriteRepository.get(_favorite.id);

      const response = new Response(Response.SUCCESS, req.__('_created._favorite'), favorite);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async delete(req, res, next) {

    try {

      await FavoriteRepository.delete(req.data.favorite);

      const response = new Response(Response.SUCCESS, req.__('_deleted._favorite'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async getListByCustomer(req, res, next) {
    
    try {

      const { pager, customer } = req.data;

      const { count, rows } = await FavoriteRepository.getListByCustomer(customer, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._favorite'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}

