const createHttpError = require("http-errors");
const ProductRepository = require("../../repository/ProductRepository");

module.exports = async function(req, res, next) {
  try {
    const product = await ProductRepository.get(req.params.id);
    if (product) {
      req.data = { product };
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
