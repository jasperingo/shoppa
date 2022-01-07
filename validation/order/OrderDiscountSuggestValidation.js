
const ProductVariantRepository = require("../../repository/ProductVariantRepository");
const ValidationRules = require("../ValidationRules");


module.exports = {

  order_items: {
    isArray: ValidationRules.isArray,
    custom: {
      options: async (value, { req })=> {

        const err = [];

        const requiredMessage =  req.__('_error._form._field_required');

        const invalidMessage =  req.__('_error._form._field_invalid');

        const invalidIDMessage = req.__('_error._form._id_invalid');
        
        for (let [i, item] of value.entries()) {
          if (typeof item === 'object' && item !== null) {
            
            if (item.quantity === undefined || item.quantity === null)
              err.push({ name: 'quantity', message: requiredMessage, index: i });
            else if (isNaN(parseFloat(item.quantity)) || item.quantity <= 0)
              err.push({ name: 'quantity', message: invalidMessage, index: i });

            if (item.amount === undefined || item.amount === null)
              err.push({ name: 'amount', message: requiredMessage, index: i });
            else if (isNaN(parseFloat(item.amount)) || item.amount <= 0)
              err.push({ name: 'amount', message: invalidMessage, index: i });

            if (item.product_variant_id === undefined || item.product_variant_id === null)
              err.push({ name: 'product_variant_id', message: requiredMessage, index: i });
            else if (isNaN(parseInt(item.product_variant_id)) || ! (await ProductVariantRepository.idExists(item.product_variant_id)))
              err.push({ name: 'product_variant_id', message: invalidIDMessage, index: i });

          } else {
            err.push({ message: invalidMessage, index: i });
          }
        }

        if (err.length > 0) throw err;

        ValidationRules.orderItemProductVariantDuplicate(value, err, req.__('_error._form._field_duplicated'));

        if (err.length > 0) throw err;

        return true;
      }
    }
  }

};

