const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const ResponseDTO = require("../utils/ResponseDTO");
const RouteWeightRepository = require("../repository/RouteWeightRepository");

module.exports = class RouteWeightController {

  async create(req, res, next) {
    
    try {

      const result = await RouteWeightRepository.create(req.body);

      const routeWeight = await RouteWeightRepository.get(result.id);

      const response = ResponseDTO.success(req.__('_created._route_weight'), routeWeight);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async update(req, res, next) {
    
    try {

      await RouteWeightRepository.update(req.data.routeWeight, req.body);

      const routeWeight = await RouteWeightRepository.get(req.data.routeWeight.id);

      const response = ResponseDTO.success(req.__('_updated._route_weight'), routeWeight);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async delete(req, res, next) {

    try {

      await RouteWeightRepository.delete(req.data.routeWeight);

      const response = ResponseDTO.success(req.__('_deleted._route_weight'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }
  
  get(req, res) {

    const response = ResponseDTO.success(req.__('_fetched._route_weight'), req.data.routeWeight);

    res.status(StatusCodes.OK).send(response);
  }
}
