const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Pagination = require("../http/Pagination");
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

  async updatePhoto(req, res, next) {
    
    try {

      await PromotionRepository.updatePhoto(req.data.promotion, req.file.filename);
      
      const promotion = await PromotionRepository.get(req.data.promotion.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._photo'), promotion);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async delete(req, res, next) {

    try {

      await PromotionRepository.delete(req.data.promotion);

      const response = new Response(Response.SUCCESS, req.__('_deleted._promotion'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._promotion'), req.data.promotion);

    res.status(StatusCodes.OK).send(response);
  }

  async getList(req, res, next) {
    
    try {

      const { pager } = req.data;

      const { count, rows } = await PromotionRepository.getList(pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._promotion'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  async getRandomList(req, res, next) {
    
    try {

      const { pager } = req.data;

      const promotions = await PromotionRepository.getRandomList(pager.page_limit);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._promotion'), promotions);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}
