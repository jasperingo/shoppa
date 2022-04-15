const createHttpError = require("http-errors");
const ProductRepository = require("../../../repository/ProductRepository");
const StoreRepository = require("../../../repository/StoreRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {
  try {
    if (
      req.auth.authType === JWT.AUTH_STORE_ADMIN && 
      await StoreRepository.statusIsActiveOrActivating(req.auth.userId) && 
      await ProductRepository.idExistsForStore(req.data.productVariant.product_id, req.auth.storeId)
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
  } catch (error) {
    next(createHttpError.InternalServerError(error));
  }
}
