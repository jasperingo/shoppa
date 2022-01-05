const ValidationRules = require("../ValidationRules");

module.exports = {

  price: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTZero
  },

  minimium: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTZero
  },

  maximium: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTZero
  }

};

