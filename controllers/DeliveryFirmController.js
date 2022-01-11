const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Pagination = require("../http/Pagination");
const Response = require("../http/Response");
const DeliveryFirmRepository = require("../repository/DeliveryFirmRepository");
const Hash = require("../security/Hash");
const JWT = require("../security/JWT");


module.exports = class DeliveryFirmController {

  async register(req, res, next) {
    
    try {
      
      const hashedPassword = await Hash.hashPassword(req.body.administrator_password);
      
      const result = await DeliveryFirmRepository.add(req.body, hashedPassword, req.data.customer);

      const deliveryFirm = await DeliveryFirmRepository.getWithAdministrator(result.deliveryFirm.id, result.administrator.id);

      const token = await JWT.signDeliveryFirmJWT(deliveryFirm);

      const response = new Response(Response.SUCCESS, req.__('_created._store'), {
        deliveryFirm,
        api_token: token
      });

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      console.log(error)
      next(new InternalServerException(error));
    }
  }

  async login(req, res, next) {

    try {

      const { data } = req;

      const deliveryFirm = await DeliveryFirmRepository.getWithAdministrator(data.deliveryFirm.id, data.administrator.id);

      const token = await JWT.signDeliveryFirmJWT(deliveryFirm);

      const response = new Response(Response.SUCCESS, req.__('_login'), {
        deliveryFirm,
        api_token: token
      });

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async update(req, res, next) {

    try {

      await DeliveryFirmRepository.update(req.data.deliveryFirm, req.body);

      const deliveryFirm = await DeliveryFirmRepository.get(req.params.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._delivery_firm'), deliveryFirm);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePhoto(req, res, next) {
    
    try {

      await DeliveryFirmRepository.updatePhoto(req.data.deliveryFirm, req.file.filename);
      
      const deliveryFirm = await DeliveryFirmRepository.get(req.params.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._delivery_firm'), deliveryFirm);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._delivery_firm'), req.data.deliveryFirm);

    res.status(StatusCodes.OK).send(response);
  }

  async getList(req, res, next) {

    try {

      const { pager } = req.data;

      const { count, rows } = await DeliveryFirmRepository.getList(pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._delivery_firm'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}

