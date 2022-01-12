const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const RouteWeightRepository = require("../repository/RouteWeightRepository");


module.exports = class RouteWeightController {

  async create(req, res, next) {
    
    try {

      const _routeWeight = await RouteWeightRepository.create(req.body);

      const routeWeight = await RouteWeightRepository.get(_routeWeight.id);

      const response = new Response(Response.SUCCESS, req.__('_created._route_weight'), routeWeight);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async update(req, res, next) {
    
    try {

      await RouteWeightRepository.update(req.data.routeWeight, req.body);

      const routeWeight = await RouteWeightRepository.get(req.data.routeWeight.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._route_weight'), routeWeight);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async delete(req, res, next) {

    try {

      await RouteWeightRepository.delete(req.data.routeWeight);

      const response = new Response(Response.SUCCESS, req.__('_deleted._route_weight'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }
  
}


