const createHttpError = require("http-errors");
const CustomerRepository = require("../../../repository/CustomerRepository");
const DeliveryFirmRepository = require("../../../repository/DeliveryFirmRepository");
const StoreRepository = require("../../../repository/StoreRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {

  const userId = req.data.transaction.user_id;

  try {
    
    if (
      req.auth.authType === JWT.AUTH_APP_ADMIN
      ||
      (
        userId === req.auth.userId && 
        (
          (
            req.auth.authType === JWT.AUTH_CUSTOMER && 
            await CustomerRepository.statusIsActive(req.auth.userId)
          ) 
          ||
          (
            req.auth.authType === JWT.AUTH_STORE_ADMIN && 
            await StoreRepository.statusIsActive(req.auth.storeId)
          ) 
          ||
          (
            req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
            await DeliveryFirmRepository.statusIsActive(req.auth.deliveryFirmId)
          )
        )
      )
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
  } catch (error) {
    next(createHttpError.InternalServerError(error))
  }
}
