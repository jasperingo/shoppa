
const { StatusCodes } = require("http-status-codes");
const EmailService = require("../emailService");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Pagination = require("../http/Pagination");
const Response = require("../http/Response");
const StringGenerator = require("../http/StringGenerator");
const CustomerRepository = require("../repository/CustomerRepository");
const Hash = require("../security/Hash");
const JWT = require("../security/JWT");

module.exports = class CustomerController {
  
  async register(req, res, next) {
    
    try {

      const emailToken = await StringGenerator.emailVerificationToken();
      
      const hashedPassword = await Hash.hashPassword(req.body.password);

      const result = await CustomerRepository.add(req.body, hashedPassword, emailToken);

      const customer = await CustomerRepository.get(result.id);

      await EmailService.send(
        customer.user.email,
        EmailService.EMAIL_VERIFICATION, 
        { 
          name: customer.user.name,
          verificationLink: `${process.env.CLIENT_DOMAIN_NAME}email-verification?token=${emailToken}`
        }
      );

      customer.hidePassword();

      const response = new Response(Response.SUCCESS, req.__('_created._customer'), customer);

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

      const customer = await CustomerRepository.get(req.data.customer.id);

      customer.hidePassword();

      const response = new Response(Response.SUCCESS, req.__('_updated._customer'), customer);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePassword(req, res, next) {

    try {

      const hashedPassword = await Hash.hashPassword(req.body.new_password);
      
      await CustomerRepository.updatePassword(req.data.customer, hashedPassword);

      const response = new Response(Response.SUCCESS, req.__('_updated._password'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePhoto(req, res, next) {

    try {

      await CustomerRepository.updatePhoto(req.data.customer, req.file.filename);
      
      const customer = await CustomerRepository.get(req.data.customer.id);

      customer.hidePassword();

      const response = new Response(Response.SUCCESS, req.__('_updated._photo'), customer);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }
  
  async updateStatus(req, res, next) {
    
    try {

      await CustomerRepository.updateStatus(req.data.customer, req.body.status);
      
      const customer = await CustomerRepository.get(req.data.customer.id);

      customer.hidePassword();

      const response = new Response(Response.SUCCESS, req.__('_updated._status'), customer);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  get(req, res) {

    req.data.customer.hidePassword();

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

