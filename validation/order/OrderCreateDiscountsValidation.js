const { validationResult, body } = require("express-validator");
const InternalServerException = require("../../http/exceptions/InternalServerException");
const DiscountProductRepository = require("../../repository/DiscountProductRepository");
const ProductVariantRepository = require("../../repository/ProductVariantRepository");

module.exports = async function(req, res, next) {

  if (!validationResult(req).isEmpty()) {
    return next();
  }

  const err = [];

  const data = req.body;

  const invalidIDMessage = req.__('_error._form._id_invalid');

  const differenceMessage = req.__('_error._form._field_not_duplicated');

  try {

    const products = [];

    for (let [i, item] of data.order_items.entries()) {

      let productVariant = await ProductVariantRepository.get(item.product_variant_id);

      let index = products.findIndex(product=> product.id === productVariant.product_id);

      let theItem = {
        ...item,
        index: i,
        amount: (item.quantity * productVariant.price)
      }

      if (index === -1) {
        products.push({ id: productVariant.product_id, product_variants: [theItem] })
      } else {
        products[index].product_variants.push(theItem);
      }
    }

    const errIndex = [];

    for (let product of products) {

      for (let i = 0; i <  product.product_variants.length; i++) {
        for (let j = i; j <  product.product_variants.length-1; j++) {
          let v1 = product.product_variants[i];
          let v2 = product.product_variants[j+1];
          if (v1.discount_product_id !== v2.discount_product_id) {
            
            if (!errIndex.includes(i)) {
              errIndex.push(i);
              err.push({ name: 'discount_product_id', message: differenceMessage, index: v1.index });
            }
    
            if (!errIndex.includes(j+1)) {
              errIndex.push(j+1);
              err.push({ name: 'discount_product_id', message: differenceMessage, index: v2.index });
            }
          }
        }
      }
    }

    
    if (err.length === 0) {

      for (let product of products) {

        if (product.product_variants[0].discount_product_id === undefined || product.product_variants[0].discount_product_id === null) {
          continue;
        }

        let quantity = product.product_variants.reduce((prev, variant)=> prev + variant.quantity, 0);
  
        let amount = product.product_variants.reduce((prev, variant)=> prev + variant.amount, 0);
  
        let discountProduct = await DiscountProductRepository.getWithDiscount(product.product_variants[0].discount_product_id);
        
        if (
          (discountProduct.discount.minimium_required_amount !== null && discountProduct.discount.minimium_required_amount > amount) ||
          (discountProduct.discount.minimium_required_quantity !== null && discountProduct.discount.minimium_required_quantity > quantity) || 
          ((new Date(discountProduct.discount.end_date)).getTime() <= Date.now())
        ) {
          
          for (let item of product.product_variants) {
            err.push({ name: 'discount_product_id', message: invalidIDMessage, index: item.index });
          }

        }
  
      }

    }
    
    if (err.length > 0) {
      await body('order_items').custom(()=> { throw err; }).run(req);
    }

    next();

  } catch (error) {
    next(new InternalServerException(error));
  }
}
