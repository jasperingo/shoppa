const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Pagination = require("../http/Pagination");
const Response = require("../http/Response");
const DiscountProductRepository = require("../repository/DiscountProductRepository");


module.exports = class DiscountProductController {

  async create(req, res, next) {
    
    try {

      const _discountProduct = await DiscountProductRepository.create(req.body);

      const discountProduct = await DiscountProductRepository.get(_discountProduct.id);

      const response = new Response(Response.SUCCESS, req.__('_created._discount_product'), discountProduct);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async delete(req, res, next) {

    try {

      await DiscountProductRepository.delete(req.data.discountProduct);

      const response = new Response(Response.SUCCESS, req.__('_deleted._discount_product'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._discount_product'), req.data.discountProduct);

    res.status(StatusCodes.OK).send(response);
  }

  async getListByDiscount(req, res, next) {
    
    try {

      const { pager, discount } = req.data;

      const { count, rows } = await DiscountProductRepository.getListByDiscount(discount, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._discount_product'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}

