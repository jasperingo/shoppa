const { validationResult } = require("express-validator");
const InternalServerException = require("../../http/exceptions/InternalServerException");
const RouteDurationRepository = require("../../repository/RouteDurationRepository");
const RouteCustomErrors = require("./RouteCustomErrors");


module.exports = async (req, res, next)=> {
  
  if (!validationResult(req).isEmpty()) {
    return next();
  }

  if (!RouteCustomErrors.minimiumIsValid(req)) {
    await RouteCustomErrors.minimiumInvalid(req);
    return next();
  }

  try {
    
    if (await RouteDurationRepository.updateRouteDurationExists(req.body, req.data.routeDuration)) {
      await RouteCustomErrors.durationExists(req);
    }
    
    next();

  } catch (error) {
    next(new InternalServerException(error));
  }
}

