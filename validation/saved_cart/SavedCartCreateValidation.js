const InternalServerException = require("../../http/exceptions/InternalServerException");
const ProductRepository = require("../../repository/ProductRepository");
const ValidationRules = require("../ValidationRules");


module.exports = {

  title: {
    notEmpty: ValidationRules.notEmpty
  },

  saved_cart_items: {
    isArray: ValidationRules.isArray,
    custom: {
      options: async (value, { req })=> {

        const err = [];

        const invalidMessage = req.__('_error._form._field_invalid');
        
        try {
          for (let [i, item] of value.entries()) {

            if (typeof item === 'object' && item !== null) {

              if (item.product_variant_id === undefined || isNaN(parseFloat(item.product_variant_id)) || 
                  ! (await ProductRepository.variantIdExists(item.product_variant_id))) 
                err.push({ name: 'product_variant_id', message: invalidMessage, index: i });

              if (item.quantity === undefined || isNaN(parseFloat(item.quantity)) || item.quantity < 0.00) 
                err.push({ name: 'quantity', message: invalidMessage, index: i });

            } else {
              err.push({ message: invalidMessage, index: i });
            }
          }
        } catch (error) {
          err.push({ name: 'product_variant_id', message: InternalServerException.TAG, index: i });
        }

        if (err.length > 0) throw err;

        const errIndex = [];

        const duplicateMessage = req.__('_error._form._field_duplicated');

        for (let i = 0; i < value.length; i++) {
          for (let j = i; j < value.length-1; j++) {
            let v1 = value[i];
            let v2 = value[j+1];
            if (v1.product_variant_id === v2.product_variant_id) {
              
              if (!errIndex.includes(i)) {
                errIndex.push(i);
                err.push({ message: duplicateMessage, index: i });
              }
      
              if (!errIndex.includes(j+1)) {
                errIndex.push(j+1);
                err.push({ message: duplicateMessage, index: j+1 });
              }
            }
          }
        }
        
        if (err.length > 0) throw err;

        return true;
      }
    }
  }

};
