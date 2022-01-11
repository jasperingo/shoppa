const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const User = require("../../../models/User");
const JWT = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
    req.data.deliveryFirm.id === req.auth.deliveryFirmId && 
    (req.data.deliveryFirm.user.status === User.STATUS_ACTIVE || req.data.deliveryFirm.user.status === User.STATUS_ACTIVATING)) 
  {
    next();
  } else {
    next(new ForbiddenException());
  }
};

