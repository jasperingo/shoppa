const createHttpError = require("http-errors");
const User = require("../../../models/User");
const JWT = require("../../../security/JWT");

module.exports = function(req, res, next) {
  if (
    req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
    req.data.route.delivery_firm.id === req.auth.deliveryFirmId && 
    (req.data.route.delivery_firm.user.status === User.STATUS_ACTIVE || req.data.route.delivery_firm.user.status === User.STATUS_ACTIVATING)
  ) {
    next();
  } else {
    next(createHttpError.Forbidden());
  }
};
