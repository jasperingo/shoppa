const createHttpError = require("http-errors");
const DiscountRepository = require("../../repository/DiscountRepository");

module.exports = async function(req, res, next) {
  try {
    const discount = await DiscountRepository.get(req.params.id);
    if (discount) {
      req.data = { discount };
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
