const { validationResult } = require("express-validator");
const InternalServerException = require("../../http/exceptions/InternalServerException");
const RouteRepository = require("../../repository/RouteRepository");
const RouteCustomErrors = require("./RouteCustomErrors");


module.exports = async (req, res, next)=> {

  if (!validationResult(req).isEmpty()) {
    return next();
  }

  try {

    if (req.data.route.origin_route_id !== null) {
      await RouteCustomErrors.cityAndStateInvalid(req, '_route_cant_have_state_and_city');
    } else if (await RouteRepository.updateRouteExists(req.data.route, req.body)) {
      await RouteCustomErrors.cityAndStateInvalid(req);
    }
    
    next();

  } catch (error) {
    next(new InternalServerException(error));
  }
}

