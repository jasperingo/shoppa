
const { StatusCodes } = require('http-status-codes');
const InternalServerException = require('../http/exceptions/InternalServerException');
const Response = require('../http/Response');
const BankRepository = require('../repository/BankRepository');

module.exports = class LocationController {


  async getList(req, res, next) {

    try {

      const banks = await BankRepository.getList();

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._bank'), banks);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}


