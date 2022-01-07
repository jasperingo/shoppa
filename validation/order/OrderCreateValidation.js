const InternalServerException = require("../../http/exceptions/InternalServerException");
const Order = require("../../models/Order");
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

  delivery_method: {
    notEmpty: ValidationRules.notEmpty,
    isIn: {
      options: [Order.getDeliveryMethods()],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  },

  payment_method: {
    notEmpty: ValidationRules.notEmpty,
    isIn: {
      options: [Order.getPaymentMethods()],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
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

            if (item.product_variant_id === undefined || item.product_variant_id === null) {
              err.push({ name: 'product_variant_id', message: requiredMessage, index: i });
            } else if (isNaN(parseInt(item.product_variant_id)) || ! (await ProductVariantRepository.idExists(item.product_variant_id))) {
              err.push({ name: 'product_variant_id', message: invalidIDMessage, index: i });
            } 

            if (item.quantity === undefined || item.quantity === null) {
              err.push({ name: 'quantity', message: requiredMessage, index: i });
            } else if (isNaN(parseFloat(item.quantity)) || item.quantity <= 0) {
              err.push({ name: 'quantity', message: invalidMessage, index: i });
            }

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

