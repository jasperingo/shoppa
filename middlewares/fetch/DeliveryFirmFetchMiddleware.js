const createHttpError = require("http-errors");
const DeliveryFirmRepository = require("../../repository/DeliveryFirmRepository");

module.exports = async function(req, res, next) {
  try {
    const deliveryFirm = await DeliveryFirmRepository.get(req.params.id);
    if (deliveryFirm) {
      req.data = { deliveryFirm };
      next();
    } else {
      next(createHttpError.NotFound({
        data: {
          path: `${req.baseUrl}/${req.params.id}`,
          param: parseInt(req.params.id)
        }
      }));
    }
  } catch(error) {
    next(createHttpError.InternalServerError(error));
  }
}
