
const ForbiddenException = require("../../http/exceptions/ForbiddenException");
const { AUTH_APP_ADMIN } = require("../../security/JWT");

module.exports = function permit(req, res, next) {
  if (req.auth.authType === AUTH_APP_ADMIN || req.data.address.user_id === req.auth.id) {
    next();
  } else {
    next(new ForbiddenException());
  }
};


