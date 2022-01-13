
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const CustomerRepository = require("../../../repository/CustomerRepository");
const DeliveryFirmRepository = require("../../../repository/DeliveryFirmRepository");
const OrderRepository = require("../../../repository/OrderRepository");
const StoreRepository = require("../../../repository/StoreRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {
  try {
    
    if (
      (req.body.order_id !== null && req.body.order_id !== undefined) 
      && 
      (
        (req.auth.authType === JWT.AUTH_CUSTOMER && 
        await OrderRepository.idExistsForCustomer(req.body.order_id, req.auth.customerId) &&
        await CustomerRepository.statusIsActive(req.auth.userId))
        ||
        (req.auth.authType === JWT.AUTH_STORE_ADMIN && 
        await OrderRepository.idExistsForStore(req.body.order_id, req.auth.storeId) && 
        await StoreRepository.statusIsActive(req.auth.storeId))
        ||
        (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
        await OrderRepository.idExistsForDeliveryFirm(req.body.order_id, req.auth.deliveryFirmId) &&
        await DeliveryFirmRepository.statusIsActive(req.auth.deliveryFirmId))
      )
    ) 
    {
      next();
    } else {
      next(new ForbiddenException());
    }
  } catch (error) {
    next(new InternalServerException(error))
  }
};

