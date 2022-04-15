const createHttpError = require("http-errors");
const DeliveryFirmRepository = require("../../../repository/DeliveryFirmRepository");
const StoreRepository = require("../../../repository/StoreRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {
  
  try {
    
    if (
      (req.auth.authType === JWT.AUTH_STORE_ADMIN && await StoreRepository.statusIsActive(req.auth.storeId)) ||
      (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && await DeliveryFirmRepository.statusIsActive(req.auth.deliveryFirmId))
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
  } catch (error) {
    next(createHttpError.InternalServerError(error))
  }
}
