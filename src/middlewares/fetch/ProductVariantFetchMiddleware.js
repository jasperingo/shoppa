const createHttpError = require("http-errors");
const ProductVariantRepository = require("../../repository/ProductVariantRepository");

module.exports = async function(req, res, next) {
  try {
    const productVariant = await ProductVariantRepository.get(req.params.id);
    if (productVariant) {
      req.data = { productVariant };
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
