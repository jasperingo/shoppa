
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const StoreRepository = require("../../../repository/StoreRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {

  try {
    if (req.auth.authType === JWT.AUTH_STORE_ADMIN && 
      req.data.order.store_id === req.auth.storeId &&
      await StoreRepository.statusIsActive(req.auth.storeId)) 
    {
      next();
    } else {
      next(new ForbiddenException());
    }
  } catch (error) {
    next(new InternalServerException(error));
  }
};

