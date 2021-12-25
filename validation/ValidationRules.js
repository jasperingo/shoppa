
const InternalServerException = require("../http/exceptions/InternalServerException");
const Address = require("../models/Address");
const Category = require("../models/Category");

module.exports = {

  errorFormat: err=> ({
    name: err.param,
    value: err.value,
    message: err.msg,
    errors: err.nestedErrors
  }),
  
  validationHasServerError(errors) {
    const emailError = errors.mapped().email;
    const passwordError = errors.mapped().password;
    return ((emailError && emailError.message === InternalServerException.TAG) || 
      (passwordError && passwordError.message === InternalServerException.TAG))
  },

  isPasswordLength: {
    options: { 
      max : 20,
      min: 6
    },
    bail: true,
    errorMessage: (value, { req })=> req.__('_error._form._password_length', { min: 6, max: 20 })
  },

  isPhoneNumberLength: {
    options: { 
      max : 11,
      min: 11
    },
    bail: true,
    errorMessage: (value, { req })=> req.__('_error._form._phone_number_invalid')
  },

  notEmpty: {
    bail: true,
    errorMessage: (value, { req })=> req.__('_error._form._field_required')
  },

  isEmail: {
    bail: true,
    errorMessage: (value, { req })=> req.__('_error._form._email_invalid')
  },

  addressTypeIsIn: {
    options: [[Address.TYPE_DEFAULT, Address.TYPE_SUB, Address.TYPE_PICK_UP]],
    errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
  },

  categoryTypeIsIn: {
    options: [[Category.TYPE_STORE, Category.TYPE_PRODUCT]],
    errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
  }

};

