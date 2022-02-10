const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Pagination = require("../http/Pagination");
const Response = require("../http/Response");
const AdministratorRepository = require("../repository/AdministratorRepository");
const DeliveryFirmRepository = require("../repository/DeliveryFirmRepository");
const ReviewRepository = require("../repository/ReviewRepository");
const Hash = require("../security/Hash");
const JWT = require("../security/JWT");


module.exports = class DeliveryFirmController {

  async register(req, res, next) {
    
    try {
      
      const hashedPassword = await Hash.hashPassword(req.body.administrator_password);
      
      const result = await DeliveryFirmRepository.add(req.body, hashedPassword, req.data.customer);

      const deliveryFirm = await DeliveryFirmRepository.get(result.deliveryFirm.id);

      const administrator = await AdministratorRepository.get(result.administrator.id);

      deliveryFirm.review_summary = await ReviewRepository.getSummaryForDeliveryFirm(deliveryFirm);

      administrator.hidePassword();

      deliveryFirm.setDataValue('administrators', [administrator]);

      const token = await JWT.signDeliveryFirmJWT(deliveryFirm.toJSON());

      const response = new Response(Response.SUCCESS, req.__('_created._delivery_firm'), {
        delivery_firm: deliveryFirm,
        api_token: token
      });

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }
  
  async login(req, res, next) {

    try {

      const { deliveryFirm, administrator } = req.data;

      deliveryFirm.review_summary = await ReviewRepository.getSummaryForDeliveryFirm(deliveryFirm);

      administrator.hidePassword();

      deliveryFirm.setDataValue('administrators', [administrator]);

      const token = await JWT.signDeliveryFirmJWT(deliveryFirm.toJSON());

      const response = new Response(Response.SUCCESS, req.__('_login'), {
        delivery_firm: deliveryFirm,
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

      const deliveryFirm = await DeliveryFirmRepository.get(req.data.deliveryFirm.id);

      deliveryFirm.review_summary = await ReviewRepository.getSummaryForDeliveryFirm(deliveryFirm);

      const response = new Response(Response.SUCCESS, req.__('_updated._delivery_firm'), deliveryFirm);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePhoto(req, res, next) {
    
    try {

      await DeliveryFirmRepository.updatePhoto(req.data.deliveryFirm, req.file.filename);
      
      const deliveryFirm = await DeliveryFirmRepository.get(req.data.deliveryFirm.id);

      deliveryFirm.review_summary = await ReviewRepository.getSummaryForDeliveryFirm(deliveryFirm);

      const response = new Response(Response.SUCCESS, req.__('_updated._delivery_firm'), deliveryFirm);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updateStatus(req, res, next) {
    
    try {

      await DeliveryFirmRepository.updateStatus(req.data.deliveryFirm, req.body.status);
      
      const deliveryFirm = await DeliveryFirmRepository.get(req.data.deliveryFirm.id);

      deliveryFirm.review_summary = await ReviewRepository.getSummaryForDeliveryFirm(deliveryFirm);

      const response = new Response(Response.SUCCESS, req.__('_updated._status'), deliveryFirm);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }
  
  async get(req, res, next) {

    try {

      const { deliveryFirm } = req.data;

      deliveryFirm.review_summary = await ReviewRepository.getSummaryForDeliveryFirm(deliveryFirm);

      if (req.auth !== undefined && req.auth.customerId !== undefined) {

        deliveryFirm.review_summary.customer_can_review = await ReviewRepository.canReviewDeliveryFirm(deliveryFirm.id, req.auth.customerId);

        const review = await ReviewRepository.getByDeliveryFirmAndCutomer(deliveryFirm.id, req.auth.customerId);

        deliveryFirm.setDataValue('reviews', review === null ? [] : [review]);
      }

      const response = new Response(Response.SUCCESS, req.__('_fetched._delivery_firm'), deliveryFirm);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
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

