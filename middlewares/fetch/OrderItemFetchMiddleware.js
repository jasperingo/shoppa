const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const OrderItemRepository = require("../../repository/OrderItemRepository");

module.exports = async (req, res, next)=> {
  try {
    const orderItem = await OrderItemRepository.get(req.params.id);
    if (orderItem) {
      req.data = { orderItem };
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

