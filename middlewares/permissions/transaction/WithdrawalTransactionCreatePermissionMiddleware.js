
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const DeliveryFirmRepository = require("../../../repository/DeliveryFirmRepository");
const StoreRepository = require("../../../repository/StoreRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {
  
  try {
    
    if (
      (req.auth.authType === JWT.AUTH_STORE_ADMIN && await StoreRepository.statusIsActive(req.auth.storeId)) ||
      (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && await DeliveryFirmRepository.statusIsActive(req.auth.deliveryFirmId))
    )
    {
      next();
    } else {
      next(new ForbiddenException());
    }
  } catch (error) {
    next(new InternalServerException(error))
  }
};

