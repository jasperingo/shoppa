const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const RouteRepository = require("../repository/RouteRepository");


module.exports = class RouteController {

  async add(req, res, next) {
    
    try {

      const _route = await RouteRepository.add(req.body);

      const route = await RouteRepository.get(_route.id);

      const response = new Response(Response.SUCCESS, req.__('_created._route'), route);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async update(req, res, next) {

    try {

      await RouteRepository.update(req.data.route, req.body);

      const route = await RouteRepository.get(req.params.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._route'), route);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }
  
  async delete(req, res, next) {

    try {

      await RouteRepository.delete(req.data.route);

      const response = new Response(Response.SUCCESS, req.__('_deleted._route'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._route'), req.data.route);

    res.status(StatusCodes.OK).send(response);
  }

}

