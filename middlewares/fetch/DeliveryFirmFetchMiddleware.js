const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const DeliveryFirmRepository = require("../../repository/DeliveryFirmRepository");

module.exports = async (req, res, next)=> {
  try {
    const deliveryFirm = await DeliveryFirmRepository.get(req.params.id);
    if (deliveryFirm) {
      req.data = { deliveryFirm };
      next();
    } else {
      next(new NotFoundException({
        path: `${req.baseUrl}/${req.params.id}`,
        param: parseInt(req.params.id)
      }));
    }
  } catch(error) {
    next(new InternalServerException(error));
  }
}

