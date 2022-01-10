
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const OrderRepository = require("../../../repository/OrderRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {
  if (req.auth.authType === JWT.AUTH_CUSTOMER && 
      req.body.order_id !== null && 
      req.body.order_id !== undefined && 
      (await OrderRepository.idExistsForCustomer(req.body.order_id, req.auth.id))) {
    next();
  } else {
    next(new ForbiddenException());
  }
};

