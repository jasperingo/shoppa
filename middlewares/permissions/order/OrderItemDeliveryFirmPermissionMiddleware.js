
const ForbiddenException = require("../../../http/exceptions/ForbiddenException");
const InternalServerException = require("../../../http/exceptions/InternalServerException");
const DeliveryFirmRepository = require("../../../repository/DeliveryFirmRepository");
const JWT = require("../../../security/JWT");

module.exports = async function permit(req, res, next) {

  try {
    if (req.auth.authType === JWT.AUTH_DELIVERY_ADMIN && 
      req.data.orderItem.order.delivery_firm_id === req.auth.deliveryFirmId &&
      await DeliveryFirmRepository.statusIsActive(req.auth.deliveryFirmId)) 
    {
      next();
    } else {
      next(new ForbiddenException());
    }
  } catch (error) {
    next(new InternalServerException(error));
  }
};

