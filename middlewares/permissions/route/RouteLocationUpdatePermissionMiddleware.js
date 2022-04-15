const createHttpError = require("http-errors");
const DeliveryFirmRepository = require("../../../repository/DeliveryFirmRepository");
const RouteRepository = require("../../../repository/RouteRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {
  try {
    if (
      req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
      await DeliveryFirmRepository.statusIsActiveOrActivating(req.auth.userId) &&
      await RouteRepository.existsByIdAndDeliveryFirmId(req.data.routeLocation.delivery_route_id, req.auth.deliveryFirmId)
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
  } catch (error) {
    next(createHttpError.InternalServerError(error));
  }
}
