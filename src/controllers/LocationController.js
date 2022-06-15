
const { StatusCodes } = require('http-status-codes');
const ResponseDTO = require('../utils/ResponseDTO');
const LocationRepository = require('../repository/LocationRepository');
const createHttpError = require('http-errors');

module.exports = class LocationController {


  getList(req, res, next) {

    try {

      const locations = LocationRepository.getList();

      const response = ResponseDTO.success(req.__('_list_fetched._location'), locations);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
