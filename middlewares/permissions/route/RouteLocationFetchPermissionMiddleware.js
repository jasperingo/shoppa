const createHttpError = require("http-errors");
const User = require("../../../models/User");
const RouteRepository = require("../../../repository/RouteRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {

  try {

    const route = await RouteRepository.get(req.data.routeLocation.delivery_route_id);
    
    if (
      (route.delivery_firm.user.status === User.STATUS_ACTIVE)
       || 
      (
        route.delivery_firm.user.status !== User.STATUS_ACTIVE && 
        req.auth !== undefined && 
        req.auth.authType === JWT.AUTH_APP_ADMIN
      )
       || 
      (
        route.delivery_firm.user.status === User.STATUS_ACTIVATING && 
        req.auth !== undefined && 
        req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
        route.delivery_firm.id === req.auth.deliveryFirmId
      )
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
    
  } catch (error) {
    next(createHttpError.InternalServerError(error));
  }
};
