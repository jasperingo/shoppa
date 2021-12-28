const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const ProductRepository = require("../../repository/ProductRepository");

module.exports = async (req, res, next)=> {
  try {
    const product = await ProductRepository.get(req.params.id);
    if (product) {
      req.data = { product };
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

