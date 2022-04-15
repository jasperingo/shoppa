const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const ResponseDTO = require("../utils/ResponseDTO");
const RouteLocationRepository = require("../repository/RouteLocationRepository");

module.exports = class RouteLocationController {

  async create(req, res, next) {
    
    try {

      const result = await RouteLocationRepository.create(req.body);

      const routeLocation = await RouteLocationRepository.get(result.id);

      const response = ResponseDTO.success(req.__('_created._route_location'), routeLocation);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async update(req, res, next) {
    
    try {

      await RouteLocationRepository.update(req.data.routeLocation, req.body);

      const routeLocation = await RouteLocationRepository.get(req.data.routeLocation.id);

      const response = ResponseDTO.success(req.__('_updated._route_location'), routeLocation);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async delete(req, res, next) {

    try {

      await RouteLocationRepository.delete(req.data.routeLocation);

      const response = ResponseDTO.success(req.__('_deleted._route_location'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  get(req, res) {

    const response = ResponseDTO.success(req.__('_fetched._route_location'), req.data.routeLocation);

    res.status(StatusCodes.OK).send(response);
  }
};
