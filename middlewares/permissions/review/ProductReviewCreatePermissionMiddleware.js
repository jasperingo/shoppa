
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const CustomerRepository = require("../../../repository/CustomerRepository");
const ReviewRepository = require("../../../repository/ReviewRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {
  try {
    if (req.auth.authType === JWT.AUTH_CUSTOMER && 
      await CustomerRepository.statusIsActive(req.auth.userId) && 
      req.body.product_id !== null && 
      req.body.product_id !== undefined && 
      await ReviewRepository.canReviewProduct(req.body.product_id, req.auth.customerId)) 
    {
      next();
    } else {
      next(new ForbiddenException());
    }
  } catch (error) {
    next(new InternalServerException(error));
  }
};



