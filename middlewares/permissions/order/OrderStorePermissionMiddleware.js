
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const JWT = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if (req.auth.authType === JWT.AUTH_STORE_ADMIN && 
    req.data.order.store_id === req.auth.store.id) {
    next();
  } else {
    next(new ForbiddenException());
  }
};

