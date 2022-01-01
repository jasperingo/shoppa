const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const Administrator = require("../../../models/Administrator");
const { AUTH_DELIVERY_ADMIN } = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  if (req.auth.authType === AUTH_DELIVERY_ADMIN && 
      req.auth.role === Administrator.ROLE_SUPER && 
      req.data.route.delivery_firm_id === req.auth.deliveryFirm.id
    ) {
    next();
  } else {
    next(new ForbiddenException());
  }
};

