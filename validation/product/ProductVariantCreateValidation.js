const ProductVariantRepository = require("../../repository/ProductVariantRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  name: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await ProductVariantRepository.nameExists(value, req.body.product_id))
            return Promise.reject(req.__('_error._form._name_exists'));
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
  },

  price: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTZero
  },

  quantity: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTEZero
  },

  weight: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTZero
  },

  available: {
    notEmpty: ValidationRules.notEmpty,
    isBoolean: ValidationRules.isBoolean
  }

};

