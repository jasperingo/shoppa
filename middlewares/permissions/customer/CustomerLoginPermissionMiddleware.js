const createHttpError = require("http-errors");
const User = require("../../../models/User");

module.exports = function(req, res, next) {
  if (req.data.customer.user.status === User.STATUS_ACTIVE) {
    next();
  } else if (req.data.customer.user.status === User.STATUS_EMAIL_PENDING) {
    next(createHttpError.Forbidden({ message: '_error._forbidden_email_pending' }));
  } else {
    next(createHttpError.Forbidden({ message: '_error._forbidden_inactive' }));
  }
}
