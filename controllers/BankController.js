
const { StatusCodes } = require('http-status-codes');
const ResponseDTO = require('../utils/ResponseDTO');
const BankRepository = require('../repository/BankRepository');
const createHttpError = require('http-errors');

module.exports = class LocationController {


  async getList(req, res, next) {

    try {

      const banks = await BankRepository.getList();

      const response = ResponseDTO.success(req.__('_list_fetched._bank'), banks);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
