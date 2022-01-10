
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const JWT = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
    req.data.orderItem.order.delivery_firm_id === req.auth.deliveryFirm.id) {
    next();
  } else {
    next(new ForbiddenException());
  }
};

