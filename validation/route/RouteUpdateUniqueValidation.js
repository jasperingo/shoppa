const { validationResult } = require("express-validator");
const InternalServerException = require("../../http/exceptions/InternalServerException");
const RouteRepository = require("../../repository/RouteRepository");
const RouteCustomErrors = require("./RouteCustomErrors");


module.exports = async (req, res, next)=> {

  if (!validationResult(req).isEmpty()) {
    return next();
  }

  if (!RouteCustomErrors.cityIsValid(req)) {
    await RouteCustomErrors.cityInvalid(req);
    return next();
  }

  try {
    
    if (await RouteRepository.updateRouteExists(req.auth.deliveryFirm.id, req.body, req.params.id)) {
      await RouteCustomErrors.cityAndStateExists(req);
    }
    
    next();

  } catch (error) {
    next(new InternalServerException(error));
  }
}

