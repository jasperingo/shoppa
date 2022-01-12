const { validationResult } = require("express-validator");
const InternalServerException = require("../../http/exceptions/InternalServerException");
const RouteRepository = require("../../repository/RouteRepository");
const RouteCustomErrors = require("./RouteCustomErrors");


module.exports = async (req, res, next)=> {

  if (!validationResult(req).isEmpty()) {
    return next();
  }

  try {
    
    if (req.data.route.state !== null) {
      await RouteCustomErrors.linkInvalid(req, '_route_cant_be_a_link');
    } else if (await RouteRepository.updateLinkRouteExists(req.data.route, req.body)) {
      await RouteCustomErrors.linkInvalid(req);
    }
    
    next();

  } catch (error) {
    next(new InternalServerException(error));
  }
}

