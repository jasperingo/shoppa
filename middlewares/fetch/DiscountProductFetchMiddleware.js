const createHttpError = require("http-errors");
const DiscountProductRepository = require("../../repository/DiscountProductRepository");

module.exports = async function(req, res, next) {
  try {
    const discountProduct = await DiscountProductRepository.get(req.params.id);
    if (discountProduct) {
      req.data = { discountProduct };
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
