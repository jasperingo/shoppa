const { StatusCodes } = require("http-status-codes");
const Pagination = require("../utils/Pagination");
const FavoriteRepository = require("../repository/FavoriteRepository");
const ResponseDTO = require("../utils/ResponseDTO");
const createHttpError = require("http-errors");

module.exports = class FavoriteController {

  async create(req, res, next) {

    try {

      const result = await FavoriteRepository.create(req.body, req.auth.customerId);

      const favorite = await FavoriteRepository.get(result.id);

      const response = ResponseDTO.success(req.__('_created._favorite'), favorite);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async delete(req, res, next) {

    try {

      await FavoriteRepository.delete(req.data.favorite);

      const response = ResponseDTO.success(req.__('_deleted._favorite'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListByCustomer(req, res, next) {
    
    try {

      const { pager, customer } = req.data;

      const { count, rows } = await FavoriteRepository.getListByCustomer(customer, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._favorite'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
