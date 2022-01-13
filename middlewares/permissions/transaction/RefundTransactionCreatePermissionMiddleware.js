
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const CustomerRepository = require("../../../repository/CustomerRepository");
const OrderRepository = require("../../../repository/OrderRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {

  try {
    
    if (req.auth.authType === JWT.AUTH_CUSTOMER && 
      req.body.order_id !== null && 
      req.body.order_id !== undefined && 
      await OrderRepository.idExistsForCustomer(req.body.order_id, req.auth.customerId) && 
      await CustomerRepository.statusIsActive(req.auth.userId)) 
    {
      next();
    } else {
      next(new ForbiddenException());
    }
  } catch (error) {
    next(new InternalServerException(error))
  }
};

