const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const OrderRepository = require("../../repository/OrderRepository");

module.exports = async (req, res, next)=> {
  try {
    const order = await OrderRepository.get(req.params.id);
    if (order) {
      req.data = { order };
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

