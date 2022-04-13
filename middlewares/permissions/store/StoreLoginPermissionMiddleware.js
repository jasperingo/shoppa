const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const User = require("../../../models/User");

module.exports = function(req, res, next) {
  if (req.data.store.user.status === User.STATUS_ACTIVE || req.data.store.user.status === User.STATUS_ACTIVATING) {
    next();
  } else if (req.data.store.user.status === User.STATUS_PENDING) {
    next(new ForbiddenException('_error._forbidden_pending'));
  } else if (req.data.store.user.status === User.STATUS_EMAIL_PENDING) {
    next(new ForbiddenException('_error._forbidden_email_pending'));
  } else {
    next(new ForbiddenException('_error._forbidden_inactive'));
  }
}
