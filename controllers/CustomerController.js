
const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const CustomerRepository = require("../repository/CustomerRepository");
const { hashPassword } = require("../security/Hash");
const { signCustomerJWT } = require("../security/JWT");

module.exports = class CustomerController {

  generateJWT = (customer)=> {
    
    customer.password = undefined;

    const userObj = {
      id : customer.id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email
    };

    return signCustomerJWT(userObj);
  }

  register = async (req, res, next)=> {
    
    try {
      
      const hashedPassword = await hashPassword(req.body.password);

      const customer = await CustomerRepository.add(req.body, hashedPassword);

      const token = await this.generateJWT(customer);

      const response = new Response(Response.SUCCESS, req.__('_created._customer'), {
        customer,
        api_token: token
      });

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  login = async (req, res, next)=> {

    try {
      
      const customer = await CustomerRepository.getByEmail(req.body.email);

      const token = await this.generateJWT(customer);

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
      
      await CustomerRepository.update(req.params.id, req.body);

      const customer = await CustomerRepository.get(req.params.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._customer'), customer);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePassword(req, res, next) {

    try {

      const hashedPassword = await hashPassword(req.body.password);
      
      await CustomerRepository.updatePassword(req.params.id, hashedPassword);

      const response = new Response(Response.SUCCESS, req.__('_updated._password'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePhoto(req, res, next) {

    try {

      await CustomerRepository.updatePhoto(req.params.id, req.file.filename);

      const customer = await CustomerRepository.get(req.params.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._password'), customer);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

}

