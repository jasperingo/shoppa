const createHttpError = require("http-errors");
const OrderRepository = require("../../repository/OrderRepository");

module.exports = async function(req, res, next) {
  try {
    const order = await OrderRepository.get(req.params.id);
    if (order) {
      req.data = { order };
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
