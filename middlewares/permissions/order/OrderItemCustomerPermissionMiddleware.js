
const createHttpError = require("http-errors");
const CustomerRepository = require("../../../repository/CustomerRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {
  
  try {
    if (
      req.auth.authType === JWT.AUTH_CUSTOMER && 
      req.data.orderItem.order.customer_id === req.auth.userId &&
      await CustomerRepository.statusIsActive(req.auth.userId)
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
  } catch (error) {
    next(createHttpError.InternalServerError(error));
  }
}
