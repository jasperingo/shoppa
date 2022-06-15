const createHttpError = require("http-errors");
const CustomerRepository = require("../../../repository/CustomerRepository");
const DeliveryFirmRepository = require("../../../repository/DeliveryFirmRepository");
const StoreRepository = require("../../../repository/StoreRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {
  try {
    if (
      (req.auth.authType === JWT.AUTH_APP_ADMIN) 
      || 
      (req.auth.authType === JWT.AUTH_CUSTOMER && 
      req.data.order.customer_id === req.auth.customerId &&
      await CustomerRepository.statusIsActive(req.auth.userId)) 
      ||
      (req.auth.authType === JWT.AUTH_STORE_ADMIN && 
      req.data.order.store_id === req.auth.storeId &&
      await StoreRepository.statusIsActive(req.auth.storeId))
      ||
      (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
      req.data.order.delivery_firm_id === req.auth.deliveryFirmId &&
      await DeliveryFirmRepository.statusIsActive(req.auth.deliveryFirmId)) 
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
  } catch (error) {
    next(createHttpError.InternalServerError(error));
  }
}
