const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const User = require("../../../models/User");
const JWT = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if (
    req.data.customer.user.status === User.STATUS_ACTIVE || 
    (req.data.customer.user.status !== User.STATUS_ACTIVE && req.auth.authType === JWT.AUTH_APP_ADMIN)
  ) {
    next();
  } else {
    next(new ForbiddenException());
  }
};
