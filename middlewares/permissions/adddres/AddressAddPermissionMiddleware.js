
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const JWT = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if (req.auth.authType === JWT.AUTH_CUSTOMER) {
    next();
  } else {
    next(new ForbiddenException());
  }
};


