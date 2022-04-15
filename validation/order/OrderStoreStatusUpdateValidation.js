const Order = require("../../models/Order");
const ProductVariantRepository = require("../../repository/ProductVariantRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  store_status: {
    notEmpty: ValidationRules.notEmpty,
    isIn: {
      bail: true,
      options: [Order.getStoreStatuses()],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    },
    custom: {
      options: async (value, { req })=> {
        try {

          if (req.data.order.store_status !== Order.STORE_STATUS_PENDING || req.data.order.status !== Order.STATUS_PENDING) {
            return Promise.reject(req.__('_error._form._order_status_not_pending', { status: value }));
          }
          
          if (req.data.order.payment_method === Order.PAYMENT_METHOD_CASHLESS && 
              req.data.order.payment_status !== Order.PAYMENT_STATUS_APPROVED && 
              value === Order.STORE_STATUS_ACCEPTED) 
          {
            return Promise.reject(req.__('_error._form._order_payment_pending'));
          }

          for (let item of req.data.order.order_items) {

            let productVariant = await ProductVariantRepository.get(item.product_variant_id);
            
            if (productVariant.available === false) {
              return Promise.reject(req.__('_error._form._order_item_product_unavailable'));
            } else if (item.quantity > productVariant.quantity) {
              return Promise.reject(req.__('_error._form._order_item_product_quantity_gt'));
            }
          }

        } catch(error) {
          return Promise.reject(error);
        }
      }
    }
  }

};
