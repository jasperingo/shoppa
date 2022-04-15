const createHttpError = require("http-errors");
const User = require("../../../models/User");
const JWT = require("../../../security/JWT");

module.exports = function(req, res, next) {
  if (
    req.data.discount.store.user.status === User.STATUS_ACTIVE || 
    (req.data.discount.store.user.status !== User.STATUS_ACTIVE && req.auth !== undefined && req.auth.authType === JWT.AUTH_APP_ADMIN) || 
    (req.data.discount.store.user.status === User.STATUS_ACTIVATING && req.auth !== undefined && req.auth.authType === JWT.AUTH_STORE_ADMIN && req.data.discount.store.id === req.auth.storeId)
  ) {
    next();
  } else {
    next(createHttpError.Forbidden());
  }
}
