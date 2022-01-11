const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const User = require("../../../models/User");

module.exports = function(req, res, next) {
  if (req.data.customer.user.status === User.STATUS_ACTIVE) {
    next();
  } else {
    next(new ForbiddenException());
  }
}
