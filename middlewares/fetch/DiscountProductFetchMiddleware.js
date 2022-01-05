const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const DiscountProductRepository = require("../../repository/DiscountProductRepository");

module.exports = async (req, res, next)=> {
  try {
    const discountProduct = await DiscountProductRepository.get(req.params.id);
    if (discountProduct) {
      req.data = { discountProduct };
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

