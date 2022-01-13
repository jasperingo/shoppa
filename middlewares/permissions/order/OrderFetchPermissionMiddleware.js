
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const CustomerRepository = require("../../../repository/CustomerRepository");
const StoreRepository = require("../../../repository/StoreRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {
  try {
    if (
      (req.auth.authType === JWT.AUTH_APP_ADMIN) 
      || 
      (req.auth.authType === JWT.AUTH_CUSTOMER && 
      req.data.order.customer_id === req.auth.userId &&
      await CustomerRepository.statusIsActive(req.auth.userId)) 
      ||
      (req.auth.authType === JWT.AUTH_STORE_ADMIN && 
      req.data.order.store_id === req.auth.storeId &&
      await StoreRepository.statusIsActive(req.auth.storeId))
      ||
      (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
      req.data.order.delivery_firm_id === req.auth.deliveryFirmId &&
      await DeliveryFirmRepository.statusIsActive(req.auth.deliveryFirmId)) 
    ) 
    {
      next();
    } else {
      next(new ForbiddenException());
    }
  } catch (error) {
    next(new InternalServerException(error));
  }
};

