const createHttpError = require("http-errors");
const DiscountRepository = require("../../../repository/DiscountRepository");
const StoreRepository = require("../../../repository/StoreRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {
  try {
    if (
      req.auth.authType === JWT.AUTH_STORE_ADMIN && 
      await StoreRepository.statusIsActiveOrActivating(req.auth.userId) && 
      await DiscountRepository.idExistsForStore(req.data.discountProduct.discount_id, req.auth.storeId)
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
  } catch (error) {
    next(createHttpError.InternalServerError(error));
  }
}
