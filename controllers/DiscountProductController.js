const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");
const Pagination = require("../utils/Pagination");
const ResponseDTO = require("../utils/ResponseDTO");
const DiscountProductRepository = require("../repository/DiscountProductRepository");

module.exports = class DiscountProductController {

  async create(req, res, next) {
    
    try {

      const _discountProduct = await DiscountProductRepository.create(req.body);

      const discountProduct = await DiscountProductRepository.get(_discountProduct.id);

      const response = ResponseDTO.success(req.__('_created._discount_product'), discountProduct);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async delete(req, res, next) {

    try {

      await DiscountProductRepository.delete(req.data.discountProduct);

      const response = ResponseDTO.success(req.__('_deleted._discount_product'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListByDiscount(req, res, next) {
    
    try {

      const { pager, discount } = req.data;

      const { count, rows } = await DiscountProductRepository.getListByDiscount(discount, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._discount_product'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
