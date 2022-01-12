const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const DiscountRepository = require("../../../repository/DiscountRepository");
const StoreRepository = require("../../../repository/StoreRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {
  try {
    if (req.auth.authType === JWT.AUTH_STORE_ADMIN && 
      await StoreRepository.statusIsActiveOrActivating(req.auth.userId) &&
      req.body.discount_id !== undefined && 
      await DiscountRepository.idExistsForStore(req.body.discount_id, req.auth.storeId)) 
    {
      next();
    } else {
      next(new ForbiddenException());
    }
  } catch (error) {
    next(new InternalServerException(error));
  }
};

