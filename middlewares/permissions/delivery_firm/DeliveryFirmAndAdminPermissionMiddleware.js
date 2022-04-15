const createHttpError = require("http-errors");
const User = require("../../../models/User");
const JWT = require("../../../security/JWT");

module.exports = function(req, res, next) {
  if (
    req.auth.authType === JWT.AUTH_APP_ADMIN || 
    (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
    req.data.deliveryFirm.id === req.auth.deliveryFirmId && 
    (req.data.deliveryFirm.user.status === User.STATUS_ACTIVE || req.data.deliveryFirm.user.status === User.STATUS_ACTIVATING))
  ) {
    next();
  } else {
    next(createHttpError.Forbidden());
  }
}
