const createHttpError = require("http-errors");
const User = require("../../../models/User");

module.exports = function(req, res, next) {
  if (req.data.deliveryFirm.user.status === User.STATUS_ACTIVE || req.data.deliveryFirm.user.status === User.STATUS_ACTIVATING) {
    next();
  } else if (req.data.deliveryFirm.user.status === User.STATUS_PENDING) {
    next(createHttpError.Forbidden({ message: '_error._forbidden_pending' }));
  } else if (req.data.deliveryFirm.user.status === User.STATUS_EMAIL_PENDING) {
    next(createHttpError.Forbidden({ message: '_error._forbidden_email_pending' }));
  } else {
    next(createHttpError.Forbidden());
  }
}
