
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const CustomerRepository = require("../../../repository/CustomerRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {
  
  try {
    if (req.auth.authType === JWT.AUTH_CUSTOMER && 
      req.data.orderItem.order.customer_id === req.auth.userId &&
      await CustomerRepository.statusIsActive(req.auth.userId)) 
    {
      next();
    } else {
      next(new ForbiddenException());
    }
  } catch (error) {
    next(new InternalServerException(error));
  }
};

