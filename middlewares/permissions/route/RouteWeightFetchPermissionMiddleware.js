const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const User = require("../../../models/User");
const RouteRepository = require("../../../repository/RouteRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {

  const route = await RouteRepository.get(req.data.routeWeight.delivery_route_id);

  try {

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
      next(new ForbiddenException());
    }
    
  } catch (error) {
    next(new InternalServerException(error));
  }
};
