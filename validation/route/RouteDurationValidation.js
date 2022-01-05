
const RouteDuration = require("../../models/RouteDuration");
const ValidationRules = require("../ValidationRules");

module.exports = {

  fee: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTEZero
  },

  minimium: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTZero
  },

  maximium: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTZero
  },

  unit: {
    notEmpty: ValidationRules.notEmpty,
    isIn: {
      options: [RouteDuration.getUnits()],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  }

};

