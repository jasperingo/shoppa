const createHttpError = require("http-errors");
const DeliveryFirmRepository = require("../../../repository/DeliveryFirmRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {

  try {
    if (
      req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
      req.data.orderItem.order.delivery_firm_id === req.auth.deliveryFirmId &&
      await DeliveryFirmRepository.statusIsActive(req.auth.deliveryFirmId)
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
  } catch (error) {
    next(createHttpError.InternalServerError(error));
  }
}
