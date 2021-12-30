
const NaijaStates = require('naija-state-local-government');
const InternalServerException = require('../http/exceptions/InternalServerException');
const Response = require('../http/Response');

module.exports = class LocationController {


  getList(req, res, next) {

    try {

      const locations = NaijaStates.all();

      locations.map(i=> {
        i.senatorial_districts = undefined;
        return i;
      });

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._location'), locations)

      res.send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}


