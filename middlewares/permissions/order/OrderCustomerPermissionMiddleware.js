
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const Order = require("../../../models/Order");
const JWT = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if (req.auth.authType === JWT.AUTH_CUSTOMER && 
    req.data.order.customer_id === req.auth.id) {
    next();
  } else {
    next(new ForbiddenException());
  }
};

