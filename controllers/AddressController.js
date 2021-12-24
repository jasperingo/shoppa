const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const NotFoundException = require("../http/exceptions/NotFoundException");
const Response = require("../http/Response");
const AddressRepository = require("../repository/AddressRepository");

module.exports = class AddressController {

  async add(req, res, next) {

    try {

      const address = await AddressRepository.addForCustomer(req.body);

      const response = new Response(Response.SUCCESS, req.__('_created._address'), address);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async update(req, res, next) {

    try {

      await AddressRepository.updateForCustomer(req.params.id, req.body);

      const address = await AddressRepository.get(parseInt(req.params.id));

      const response = new Response(Response.SUCCESS, req.__('_updated._address'), address);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async get(req, res, next) {

    try {

      const address = await AddressRepository.get(parseInt(req.params.id));

      if (address === null) {
        next(new NotFoundException());
      } else {
        
        const response = new Response(Response.SUCCESS, req.__('_fetched._address'), address);

        res.status(StatusCodes.OK).send(response);
      }

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

}

