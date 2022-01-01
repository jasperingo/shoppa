
const InternalServerException = require('../http/exceptions/InternalServerException');
const Response = require('../http/Response');
const LocationRepository = require('../repository/LocationRepository');

module.exports = class LocationController {


  getList(req, res, next) {

    try {

      const locations = LocationRepository.getList();

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._location'), locations);

      res.send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}


