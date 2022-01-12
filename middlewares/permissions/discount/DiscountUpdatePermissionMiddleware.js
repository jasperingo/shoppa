const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const User = require("../../../models/User");
const JWT = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if (req.auth.authType === JWT.AUTH_STORE_ADMIN && 
    req.data.discount.store.id === req.auth.storeId && 
    (req.data.discount.store.user.status === User.STATUS_ACTIVE || req.data.discount.store.user.status === User.STATUS_ACTIVATING)) 
  {
    next();
  } else {
    next(new ForbiddenException());
  }
};

