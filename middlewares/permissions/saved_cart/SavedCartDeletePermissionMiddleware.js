
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const Administrator = require("../../../models/Administrator");
const { AUTH_STORE_ADMIN, AUTH_CUSTOMER } = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if ((req.auth.authType === AUTH_STORE_ADMIN && req.auth.role === Administrator.ROLE_SUPER && req.data.savedCart.user_id === req.auth.store.user_id) ||
      (req.auth.authType === AUTH_CUSTOMER && req.data.savedCart.user_id === req.auth.user_id)) {
    next();
  } else {
    next(new ForbiddenException());
  }
};

