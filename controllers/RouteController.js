const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Pagination = require("../http/Pagination");
const Response = require("../http/Response");
const RouteRepository = require("../repository/RouteRepository");


module.exports = class RouteController {

  async create(req, res, next) {
    
    try {

      const _route = await RouteRepository.add(req.body, req.auth.deliveryFirmId);

      const route = await RouteRepository.get(_route.id);

      const response = new Response(Response.SUCCESS, req.__('_created._route'), route);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async createLink(req, res, next) {
    
    try {

      const _route = await RouteRepository.createLink(req.body, req.auth.deliveryFirmId);

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

      const route = await RouteRepository.get(req.data.route.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._route'), route);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }
  
  async updateLink(req, res, next) {
    
    try {

      await RouteRepository.updateLink(req.data.route, req.body);

      const route = await RouteRepository.get(req.data.route.id);

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

  async getListByDeliveryFirm(req, res, next) {
    
    try {

      const { pager, deliveryFirm } = req.data;

      const { count, rows } = await RouteRepository.getListByDeliveryFirm(deliveryFirm, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._route'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  async getListOfBaseByDeliveryFirm(req, res, next) {

    try {

      const { pager, deliveryFirm } = req.data;

      const { count, rows } = await RouteRepository.getListOfBaseByDeliveryFirm(deliveryFirm, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._route'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}

