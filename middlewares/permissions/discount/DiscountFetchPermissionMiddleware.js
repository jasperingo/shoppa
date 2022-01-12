const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const User = require("../../../models/User");
const JWT = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if (req.data.discount.store.user.status === User.STATUS_ACTIVE || 
    (req.data.discount.store.user.status !== User.STATUS_ACTIVE && req.auth !== undefined && req.auth.authType === JWT.AUTH_APP_ADMIN) || 
    (req.data.discount.store.user.status === User.STATUS_ACTIVATING && req.auth !== undefined && req.auth.authType === JWT.AUTH_STORE_ADMIN && req.data.discount.store.id === req.auth.storeId)) 
  {
    next();
  } else {
    next(new ForbiddenException());
  }
};

