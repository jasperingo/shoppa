const createHttpError = require("http-errors");
const CustomerRepository = require("../../../repository/CustomerRepository");
const ReviewRepository = require("../../../repository/ReviewRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {
  try {
    if (
      req.auth.authType === JWT.AUTH_CUSTOMER && 
      await CustomerRepository.statusIsActive(req.auth.userId) && 
      req.body.store_id !== null && 
      req.body.store_id !== undefined && 
      await ReviewRepository.canReviewStore(req.body.store_id, req.auth.customerId)
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
  } catch (error) {
    next(createHttpError.InternalServerError(error));
  }
}
