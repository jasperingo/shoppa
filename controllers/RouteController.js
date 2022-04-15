const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const Pagination = require("../utils/Pagination");
const ResponseDTO = require("../utils/ResponseDTO");
const RouteRepository = require("../repository/RouteRepository");

module.exports = class RouteController {

  async create(req, res, next) {
    
    try {

      const result = await RouteRepository.add(req.body, req.auth.deliveryFirmId);
      
      const route = await RouteRepository.get(result.id);

      const response = ResponseDTO.success(req.__('_created._route'), route);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async update(req, res, next) {

    try {

      await RouteRepository.update(req.data.route, req.body);

      const route = await RouteRepository.get(req.data.route.id);

      const response = ResponseDTO.success(req.__('_updated._route'), route);
      
      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }
  
  async updateLink(req, res, next) {
    
    try {

      await RouteRepository.updateLink(req.data.route, req.body);

      const route = await RouteRepository.get(req.data.route.id);

      const response = ResponseDTO.success(req.__('_updated._route'), route);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }
  

  async delete(req, res, next) {

    try {

      await RouteRepository.delete(req.data.route);

      const response = ResponseDTO.success(req.__('_deleted._route'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  get(req, res) {

    const response = ResponseDTO.success(req.__('_fetched._route'), req.data.route);

    res.status(StatusCodes.OK).send(response);
  }

  async getListByDeliveryFirm(req, res, next) {
    
    try {

      const { pager, deliveryFirm } = req.data;

      const { count, rows } = await RouteRepository.getListByDeliveryFirm(deliveryFirm, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._route'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
