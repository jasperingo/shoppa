const { validationResult } = require("express-validator");
const createHttpError = require("http-errors");
const RouteWeightRepository = require("../../repository/RouteWeightRepository");
const RouteCustomErrors = require("./RouteCustomErrors");

module.exports = async function(req, res, next) {
  
  if (!validationResult(req).isEmpty()) {
    return next();
  }

  if (!RouteCustomErrors.minimiumIsValid(req)) {
    await RouteCustomErrors.minimiumInvalid(req);
    return next();
  }

  try {
    
    if (await RouteWeightRepository.existsByMinimiumAndMaxiMiumAndDeliveryRouteIdNotId(req.body, req.data.routeWeight)) {
      await RouteCustomErrors.weightExists(req);
    }
    
    next();

  } catch (error) {
    next(createHttpError.InternalServerError(error));
  }
}
