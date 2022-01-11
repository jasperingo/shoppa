const { validationResult } = require("express-validator");
const InternalServerException = require("../../http/exceptions/InternalServerException");
const RouteRepository = require("../../repository/RouteRepository");
const RouteCustomErrors = require("./RouteCustomErrors");


module.exports = async (req, res, next)=> {

  if (!validationResult(req).isEmpty()) {
    return next();
  }

  try {
    
    if (await RouteRepository.routeExists(req.auth.deliveryFirmId, req.body)) {
      await RouteCustomErrors.cityAndStateExists(req);
    }
    
    next();

  } catch (error) {
    next(new InternalServerException(error));
  }
}

