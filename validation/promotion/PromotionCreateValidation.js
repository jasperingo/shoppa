const ValidationRules = require("../ValidationRules");

const PromotionCreateValidation = {

  title: {
    notEmpty: ValidationRules.notEmpty,
  },

  link: {
    notEmpty: ValidationRules.notEmpty,
    isURL: {
      bail: true,
      options: { protocols: ['https', 'http'], require_protocol: true },
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  },

  call_to_action: {
    notEmpty: ValidationRules.notEmpty
  },

  amount: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTZero
  },

  duration: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTZero
  }

};

module.exports = PromotionCreateValidation;
