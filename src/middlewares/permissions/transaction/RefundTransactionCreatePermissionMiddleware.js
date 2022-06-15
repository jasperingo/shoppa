const createHttpError = require("http-errors");
const CustomerRepository = require("../../../repository/CustomerRepository");
const OrderRepository = require("../../../repository/OrderRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {

  try {
    
    if (
      req.auth.authType === JWT.AUTH_CUSTOMER && 
      req.body.order_id !== null && 
      req.body.order_id !== undefined && 
      await OrderRepository.idExistsForCustomer(req.body.order_id, req.auth.customerId) && 
      await CustomerRepository.statusIsActive(req.auth.userId)
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
  } catch (error) {
    next(createHttpError.InternalServerError(error))
  }
}
