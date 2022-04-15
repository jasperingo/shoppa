const { StatusCodes } = require("http-status-codes");
const Pagination = require("../utils/Pagination");
const ResponseDTO = require("../utils/ResponseDTO");
const PromotionRepository = require("../repository/PromotionRepository");
const createHttpError = require("http-errors");

module.exports = class PromotionController {

  async create(req, res, next) {
    
    try {

      const result = await PromotionRepository.create(req.body);

      const promotion = await PromotionRepository.get(result.id);

      const response = ResponseDTO.success(req.__('_created._promotion'), promotion);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async updatePhoto(req, res, next) {
    
    try {

      await PromotionRepository.updatePhoto(req.data.promotion, req.file.filename);
      
      const promotion = await PromotionRepository.get(req.data.promotion.id);

      const response = ResponseDTO.success(req.__('_updated._photo'), promotion);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async delete(req, res, next) {

    try {

      await PromotionRepository.delete(req.data.promotion);

      const response = ResponseDTO.success(req.__('_deleted._promotion'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  get(req, res) {

    const response = ResponseDTO.success(req.__('_fetched._promotion'), req.data.promotion);

    res.status(StatusCodes.OK).send(response);
  }

  async getList(req, res, next) {
    
    try {

      const { pager } = req.data;

      const { count, rows } = await PromotionRepository.getList(pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._promotion'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getRandomList(req, res, next) {
    
    try {

      const { pager } = req.data;

      const promotions = await PromotionRepository.getRandomList(pager.page_limit);

      const response = ResponseDTO.success(req.__('_list_fetched._promotion'), promotions);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
