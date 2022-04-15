const createHttpError = require("http-errors");
const StoreRepository = require("../../../repository/StoreRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {

  try {
    if (
      req.auth.authType === JWT.AUTH_STORE_ADMIN && 
      req.data.orderItem.order.store_id === req.auth.storeId &&
      await StoreRepository.statusIsActive(req.auth.storeId)
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
  } catch (error) {
    next(createHttpError.InternalServerError(error));
  }
}
