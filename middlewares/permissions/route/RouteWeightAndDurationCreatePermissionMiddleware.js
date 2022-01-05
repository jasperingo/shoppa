const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const Administrator = require("../../../models/Administrator");
const RouteRepository = require("../../../repository/RouteRepository");
const { AUTH_DELIVERY_ADMIN } = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {
  if (req.auth.authType === AUTH_DELIVERY_ADMIN && req.auth.role === Administrator.ROLE_SUPER && 
      req.body.route_id && (await RouteRepository.idExistsForDeliveryFirm(req.body.route_id, req.auth.deliveryFirm.id))) {
    next();
  } else {
    next(new ForbiddenException());
  }
};

