const createHttpError = require("http-errors");
const User = require("../../../models/User");
const JWT = require("../../../security/JWT");

module.exports = function(req, res, next) {
  if (
    req.auth.authType === JWT.AUTH_STORE_ADMIN && 
    req.data.store.id === req.auth.storeId && 
    (req.data.store.user.status === User.STATUS_ACTIVE || req.data.store.user.status === User.STATUS_ACTIVATING)
  ) {
    next();
  } else {
    next(createHttpError.Forbidden());
  }
};
