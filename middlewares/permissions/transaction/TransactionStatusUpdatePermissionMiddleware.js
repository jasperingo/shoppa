const createHttpError = require("http-errors");
const Transaction = require("../../../models/Transaction");
const CustomerRepository = require("../../../repository/CustomerRepository");
const DeliveryFirmRepository = require("../../../repository/DeliveryFirmRepository");
const StoreRepository = require("../../../repository/StoreRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {

  const status = req.body.status;
  const userId = req.data.transaction.user_id;

  try {
    
    if (
      [Transaction.TYPE_WITHDRAWAL, Transaction.TYPE_REFUND].includes(req.data.transaction.type) && 
      ![Transaction.STATUS_APPROVED, Transaction.STATUS_CANCELLED, Transaction.STATUS_DECLINED, Transaction.STATUS_FAILED].includes(req.data.transaction.status) && 
      (
        req.auth.authType === JWT.AUTH_APP_ADMIN && 
        (
          status === Transaction.STATUS_DECLINED || 
          status === Transaction.STATUS_PROCESSING ||
          status === Transaction.STATUS_APPROVED ||
          status === Transaction.STATUS_FAILED
        )
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
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
  } catch (error) {
    next(createHttpError.InternalServerError(error))
  }
}
