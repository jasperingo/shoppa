const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const RouteDurationRepository = require("../repository/RouteDurationRepository");

module.exports = class RouteDurationController {

  async create(req, res, next) {
    
    try {

      const _routeDuration = await RouteDurationRepository.create(req.body);

      const routeDuration = await RouteDurationRepository.get(_routeDuration.id);

      const response = new Response(Response.SUCCESS, req.__('_created._route_duration'), routeDuration);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async update(req, res, next) {
    
    try {

      await RouteDurationRepository.update(req.data.routeDuration, req.body);

      const routeDuration = await RouteDurationRepository.get(req.data.routeDuration.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._route_duration'), routeDuration);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async delete(req, res, next) {

    try {

      await RouteDurationRepository.delete(req.data.routeDuration);

      const response = new Response(Response.SUCCESS, req.__('_deleted._route_duration'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._route_duration'), req.data.routeDuration);

    res.status(StatusCodes.OK).send(response);
  }
};

