
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const Administrator = require("../../../models/Administrator");
const Transaction = require("../../../models/Transaction");
const JWT = require("../../../security/JWT");

module.exports = function permit(req, res, next) {
  const status = req.body.status;
  const userId = req.data.transaction.user_id;
  if ((req.auth.authType === JWT.AUTH_APP_ADMIN && (status === Transaction.STATUS_DECLINED || status === Transaction.STATUS_PROCESSING)) ||
    (req.auth.authType === JWT.AUTH_CUSTOMER && userId === req.auth.user_id && status === Transaction.STATUS_CANCELLED) ||
    (req.auth.authType === JWT.AUTH_STORE_ADMIN && userId === req.auth.store.user_id && status === Transaction.STATUS_CANCELLED) ||
    (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && userId === req.auth.deliveryFirm.user_id && status === Transaction.STATUS_CANCELLED)) {
    next();
  } else {
    next(new ForbiddenException());
  }
};

