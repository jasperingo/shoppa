const { validationResult, body } = require("express-validator");
const createHttpError = require("http-errors");
const ProductVariantRepository = require("../../repository/ProductVariantRepository");

module.exports = async function(req, res, next) {

  if (!validationResult(req).isEmpty()) {
    return next();
  }

  const err = [];

  const invalidMessage =  req.__('_error._form._field_invalid');

  const invalidIDMessage = req.__('_error._form._id_invalid');

  try {
    
    for (let [i, item] of req.body.order_items.entries()) {

      let productVariant = await ProductVariantRepository.getWithProduct(item.product_variant_id);

      if (productVariant.product.store_id !== req.body.store_id || productVariant.available === false) {
        err.push({ name: 'product_variant_id', message: invalidIDMessage, index: i });
      } else if (item.quantity > productVariant.quantity) {
        err.push({ name: 'quantity', message: invalidMessage, index: i });
      }

    }

    if (err.length > 0) {
      await body('order_items').custom(()=> { throw err; }).run(req);
    }

    next();

  } catch (error) {
    next(createHttpError.InternalServerError(error));
  }
}
