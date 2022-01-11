
const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Pagination = require("../http/Pagination");
const Response = require("../http/Response");
const CustomerRepository = require("../repository/CustomerRepository");
const Hash = require("../security/Hash");
const JWT = require("../security/JWT");

module.exports = class CustomerController {
  
  async register(req, res, next) {
    
    try {
      
      const hashedPassword = await Hash.hashPassword(req.body.password);

      const _customer = await CustomerRepository.add(req.body, hashedPassword);

      const customer = await CustomerRepository.get(_customer.id);

      customer.hidePassword();

      const token = await JWT.signCustomerJWT(customer);

      const response = new Response(Response.SUCCESS, req.__('_created._customer'), {
        customer,
        api_token: token
      });

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async login(req, res, next) {

    try {
      
      const { customer } = req.data;

      const token = await JWT.signCustomerJWT(customer);

      customer.hidePassword();

      const response = new Response(Response.SUCCESS, req.__('_login'), {
        customer,
        api_token: token
      });

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async update(req, res, next) {

    try {
      
      await CustomerRepository.update(req.data.customer, req.body);

      const customer = await CustomerRepository.get(req.params.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._customer'), customer);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePassword(req, res, next) {

    try {

      const hashedPassword = await Hash.hashPassword(req.body.password);
      
      await CustomerRepository.updatePassword(req.params.id, hashedPassword);

      const response = new Response(Response.SUCCESS, req.__('_updated._password'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePhoto(req, res, next) {

    try {

      await CustomerRepository.updatePhoto(req.data.customer, req.file.filename);
      
      const customer = await CustomerRepository.get(req.params.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._photo'), customer);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._customer'), req.data.customer);

    res.status(StatusCodes.OK).send(response);
  }

  async getList(req, res, next) {

    try {

      const { pager } = req.data;

      const { count, rows } = await CustomerRepository.getList(pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._customer'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}

