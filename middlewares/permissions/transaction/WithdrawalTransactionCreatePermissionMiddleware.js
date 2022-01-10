
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const Administrator = require("../../../models/Administrator");
const JWT = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if ((req.body.user_id !== undefined && req.body.user_id !== null && req.auth.role === Administrator.ROLE_SUPER) &&
      (req.auth.authType === JWT.AUTH_STORE_ADMIN && req.body.user_id === req.auth.store.user_id) ||
      (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && req.body.user_id === req.auth.deliveryFirm.user_id)) {
    next();
  } else {
    next(new ForbiddenException());
  }
};

