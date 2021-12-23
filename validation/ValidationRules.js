const InternalServerException = require("../http/exceptions/InternalServerException");

module.exports = {

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
  }

};

