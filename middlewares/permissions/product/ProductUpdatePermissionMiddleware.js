const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const Administrator = require("../../../models/Administrator");
const { AUTH_STORE_ADMIN } = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if (req.auth.authType === AUTH_STORE_ADMIN 
    && req.auth.role === Administrator.ROLE_SUPER 
    && req.data.product.store.id === req.auth.store.id) {
    next();
  } else {
    next(new ForbiddenException());
  }
};

