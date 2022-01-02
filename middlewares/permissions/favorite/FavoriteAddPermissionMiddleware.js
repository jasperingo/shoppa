
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const { AUTH_CUSTOMER } = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if (req.auth.authType === AUTH_CUSTOMER && req.body.customer_id && req.body.customer_id === req.auth.id) {
    next();
  } else {
    next(new ForbiddenException());
  }
};



