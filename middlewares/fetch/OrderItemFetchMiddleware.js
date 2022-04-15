const createHttpError = require("http-errors");
const OrderItemRepository = require("../../repository/OrderItemRepository");

module.exports = async function(req, res, next) {
  try {
    const orderItem = await OrderItemRepository.get(req.params.id);
    if (orderItem) {
      req.data = { orderItem };
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
