
const InternalServerException = require('../../http/exceptions/InternalServerException');
const ValidationRules = require('../ValidationRules');
const CustomerRepository = require('../../repository/CustomerRepository');

module.exports = {

  first_name: {
    notEmpty: ValidationRules.notEmpty
  },

  last_name: {
    notEmpty: ValidationRules.notEmpty
  },

  email: {
    notEmpty: ValidationRules.notEmpty,
    isEmail: ValidationRules.isEmail,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await CustomerRepository.emailExists(value))
            return Promise.reject(req.__('_error._form._email_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  password: {
    isLength: ValidationRules.isPasswordLength
  },
  
  password_confirmation: ValidationRules.getPasswordConfirmation()
};

