const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const User = require("../../../models/User");

module.exports = function(req, res, next) {
  if (req.data.customer.user.status === User.STATUS_ACTIVE) {
    next();
  } else if (req.data.customer.user.status === User.STATUS_EMAIL_PENDING) {
    next(new ForbiddenException('_error._forbidden_email_pending'));
  } else {
    next(new ForbiddenException('_error._forbidden_inactive'));
  }
}
