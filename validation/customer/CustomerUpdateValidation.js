const InternalServerException = require("../../http/exceptions/InternalServerException");
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
          if (await CustomerRepository.updateEmailExists(value, req.data.customer.user.id))
            return Promise.reject(req.__('_error._form._email_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  phone_number: {
    notEmpty: ValidationRules.notEmpty,
    isLength: ValidationRules.isPhoneNumberLength,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await CustomerRepository.updatePhoneNumberExists(value, req.data.customer.user.id))
            return Promise.reject(req.__('_error._form._phone_number_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  }
};


