const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const DeliveryFirmRepository = require("../../../repository/DeliveryFirmRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {
  try {
    if (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
      await DeliveryFirmRepository.statusIsActiveOrActivating(req.auth.userId)) 
    {
      next();
    } else {
      next(new ForbiddenException());
    }
  } catch (error) {
    next(new InternalServerException(error));
  }
};

