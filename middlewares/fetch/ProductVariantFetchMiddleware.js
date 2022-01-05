const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const ProductVariantRepository = require("../../repository/ProductVariantRepository");

module.exports = async (req, res, next)=> {
  try {
    const productVariant = await ProductVariantRepository.get(req.params.id);
    if (productVariant) {
      req.data = { productVariant };
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

