const ValidationRules = require('../ValidationRules');

module.exports = {

  bank_name: {
    notEmpty: ValidationRules.notEmpty,
  },

  account_name: {
    notEmpty: ValidationRules.notEmpty,
  },

  account_number: {
    notEmpty: ValidationRules.notEmpty,
    isLength: {
      options: { 
        max : 10,
        min: 10
      },
      bail: true,
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  },

  account_type: {
    notEmpty: ValidationRules.notEmpty,
  }

};


