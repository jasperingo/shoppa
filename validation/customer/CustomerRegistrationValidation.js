const ValidationRules = require('../ValidationRules');
const UserRepository = require('../../repository/UserRepository');

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
          if (await UserRepository.emailExists(value))
            return Promise.reject(req.__('_error._form._email_exists'));
        } catch (err) {
          return Promise.reject(err);
        }
      }
    },
    normalizeEmail: true
  },

  phone_number: {
    notEmpty: ValidationRules.notEmpty,
    isLength: ValidationRules.isPhoneNumberLength,
    isMobilePhone: ValidationRules.isMobilePhone,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await UserRepository.phoneNumberExists(value))
            return Promise.reject(req.__('_error._form._phone_number_exists'));
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
  },

  password: {
    isLength: ValidationRules.isPasswordLength
  },
  
  password_confirmation: ValidationRules.getPasswordConfirmation()
};
