const createHttpError = require("http-errors");
const CustomerRepository = require("../../../repository/CustomerRepository");
const StoreRepository = require("../../../repository/StoreRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {
  try {
    if (
      (req.auth.authType === JWT.AUTH_STORE_ADMIN && await StoreRepository.statusIsActiveOrActivating(req.auth.userId)) ||
      (req.auth.authType === JWT.AUTH_CUSTOMER && await CustomerRepository.statusIsActive(req.auth.userId))
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
  } catch (error) {
    next(createHttpError.InternalServerError(error));
  }
}
