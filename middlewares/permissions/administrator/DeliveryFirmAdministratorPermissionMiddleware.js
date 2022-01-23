const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const User = require("../../../models/User");
const JWT = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
    req.data.administrator.delivery_firm.id === req.auth.deliveryFirmId && 
    (req.data.administrator.delivery_firm.user.status === User.STATUS_ACTIVE || 
      req.data.administrator.delivery_firm.user.status === User.STATUS_ACTIVATING)
  ) {
    next();
  } else {
    next(new ForbiddenException());
  }
};

