const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const Administrator = require("../../../models/Administrator");
const ProductRepository = require("../../../repository/ProductRepository");
const { AUTH_STORE_ADMIN } = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {
  if (req.auth.authType === AUTH_STORE_ADMIN && req.auth.role === Administrator.ROLE_SUPER && 
      req.body.product_id && (await ProductRepository.idExistsForStore(req.body.product_id, req.auth.store.id))) {
    next();
  } else {
    next(new ForbiddenException());
  }
};

