
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const Transaction = require("../../../models/Transaction");
const CustomerRepository = require("../../../repository/CustomerRepository");
const DeliveryFirmRepository = require("../../../repository/DeliveryFirmRepository");
const StoreRepository = require("../../../repository/StoreRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {
  const status = req.body.status;
  const userId = req.data.transaction.user_id;

  try {
    
    if (
      (
        req.auth.authType === JWT.AUTH_APP_ADMIN && 
        (status === Transaction.STATUS_DECLINED || status === Transaction.STATUS_PROCESSING)
      ) 
      ||
      (
        userId === req.auth.userId && 
        status === Transaction.STATUS_CANCELLED && 
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

