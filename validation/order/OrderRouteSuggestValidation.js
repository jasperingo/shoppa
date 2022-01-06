const InternalServerException = require("../../http/exceptions/InternalServerException");
const AddressRepository = require("../../repository/AddressRepository");
const ProductVariantRepository = require("../../repository/ProductVariantRepository");
const StoreRepository = require("../../repository/StoreRepository");
const ValidationRules = require("../ValidationRules");


module.exports = {

  store_id: {
    notEmpty: ValidationRules.notEmpty,
    isInt: ValidationRules.isInt,
    custom: {
      options: async (value, { req })=> {
        try {
          if (! (await StoreRepository.idExists(value)))
            return Promise.reject(req.__('_error._form._id_invalid'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  customer_address_id: {
    notEmpty: ValidationRules.notEmpty,
    isInt: ValidationRules.isInt,
    custom: {
      options: async (value, { req })=> {
        try {
          if (! (await AddressRepository.idExists(value)))
            return Promise.reject(req.__('_error._form._id_invalid'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

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

            if (item.weight === undefined || item.weight === null)
              err.push({ name: 'weight', message: requiredMessage, index: i });
            else if (isNaN(parseFloat(item.weight)) || item.weight <= 0)
              err.push({ name: 'weight', message: invalidMessage, index: i });

            if (item.product_variant_id === undefined || item.product_variant_id === null)
              err.push({ name: 'product_variant_id', message: requiredMessage, index: i });
            else if (isNaN(parseInt(item.product_variant_id)) || ! (await ProductVariantRepository.idExists(item.product_variant_id)))
              err.push({ name: 'product_variant_id', message: invalidIDMessage, index: i });

          } else {
            err.push({ message: invalidMessage, index: i });
          }
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

