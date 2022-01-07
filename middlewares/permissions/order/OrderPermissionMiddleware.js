
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const JWT = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if (req.auth.authType === JWT.AUTH_CUSTOMER || req.body.customer_id === req.auth.id) {
    next();
  } else {
    next(new ForbiddenException());
  }
};

