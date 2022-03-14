const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const PromotionRepository = require("../repository/PromotionRepository");

module.exports = class PromotionController {

  async create(req, res, next) {
    
    try {

      const result = await PromotionRepository.create(req.body);

      const promotion = await PromotionRepository.get(result.id);

      const response = new Response(Response.SUCCESS, req.__('_created._promotion'), promotion);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }
}
