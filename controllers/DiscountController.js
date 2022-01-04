const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const DiscountRepository = require("../repository/DiscountRepository");


module.exports = class DiscountController {

  async create(req, res, next) {
    
    try {

      const _discount = await DiscountRepository.create(req.body);

      const discount = await DiscountRepository.get(_discount.id);

      const response = new Response(Response.SUCCESS, req.__('_created._discount'), discount);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      console.error(error)
      next(new InternalServerException(error));
    }
  }

}


