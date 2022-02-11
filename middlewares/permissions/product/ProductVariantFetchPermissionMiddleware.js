const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const User = require("../../../models/User");
const ProductRepository = require("../../../repository/ProductRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {
  try {
    const product = await ProductRepository.get(req.data.productVariant.product_id);

    if (
      (product.store.user.status === User.STATUS_ACTIVE)
       || 
      (
        product.store.user.status !== User.STATUS_ACTIVE && 
        req.auth !== undefined && 
        req.auth.authType === JWT.AUTH_APP_ADMIN
      ) 
        || 
      (
        product.store.user.status === User.STATUS_ACTIVATING && 
        req.auth !== undefined && 
        req.auth.authType === JWT.AUTH_STORE_ADMIN && 
        product.store.id === req.auth.storeId
      )
    ) {
      next();
    } else {
      next(new ForbiddenException());
    }
  } catch (error) {
    next(new InternalServerException(error));
  }
};

