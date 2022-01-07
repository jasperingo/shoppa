const { validationResult } = require("express-validator");
const InternalServerException = require("../../http/exceptions/InternalServerException");
const RouteWeightRepository = require("../../repository/RouteWeightRepository");
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
    
    if (await RouteWeightRepository.routeWeightExists(req.body)) {
      await RouteCustomErrors.weightExists(req);
    }
    
    next();

  } catch (error) {
    next(new InternalServerException(error));
  }
}

