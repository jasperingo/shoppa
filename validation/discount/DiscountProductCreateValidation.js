const InternalServerException = require("../../http/exceptions/InternalServerException");
const DiscountProductRepository = require("../../repository/DiscountProductRepository");
const ProductRepository = require("../../repository/ProductRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  product_id: {
    notEmpty: ValidationRules.notEmpty,
    isInt: ValidationRules.isInt,
    custom: {
      options: async (value, { req })=> {
        try {
          if (! (await ProductRepository.idExistsForStore(value, req.auth.store.id)))
            return Promise.reject(req.__('_error._form._id_invalid'));
          
          if (await DiscountProductRepository.idExistsForProduct(value, req.body.discount_id)) 
            return Promise.reject(req.__('_error._form._id_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

};
