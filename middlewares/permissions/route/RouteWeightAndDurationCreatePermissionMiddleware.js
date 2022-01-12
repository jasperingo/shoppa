const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const DeliveryFirmRepository = require("../../../repository/DeliveryFirmRepository");
const RouteRepository = require("../../../repository/RouteRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {
  try {
    if (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
      await DeliveryFirmRepository.statusIsActiveOrActivating(req.auth.userId) &&
      req.body.delivery_route_id !== undefined && 
      await RouteRepository.idExistsForDeliveryFirm(req.body.delivery_route_id, req.auth.deliveryFirmId)) 
    {
      next();
    } else {
      next(new ForbiddenException());
    }
  } catch (error) {
    next(new InternalServerException(error));
  }
};

