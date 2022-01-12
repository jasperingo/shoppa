const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const DeliveryFirmRepository = require("../../../repository/DeliveryFirmRepository");
const RouteRepository = require("../../../repository/RouteRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {
  
  try {
    if (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
      await DeliveryFirmRepository.statusIsActiveOrActivating(req.auth.userId) &&
      await RouteRepository.idExistsForDeliveryFirm(req.data.routeDuration.delivery_route_id, req.auth.deliveryFirmId)) 
    {
      next();
    } else {
      next(new ForbiddenException());
    }
  } catch (error) {
    next(new InternalServerException(error));
  }
};

