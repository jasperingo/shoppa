
const InternalServerException = require('../../http/exceptions/InternalServerException');
const { notEmpty, isEmail, isPasswordLength } = require('../ValidationRules');
const CustomerRepository = require('../../repository/CustomerRepository');

module.exports = {
  first_name: {
    notEmpty
  },
  last_name: {
    notEmpty
  },
  email: {
    notEmpty,
    isEmail,
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
    isLength: isPasswordLength
  },
  password_confirmation: {
    isLength: isPasswordLength,
    custom: {
      options: (value, { req })=> value === req.body.password,
      errorMessage: (value, { req })=> req.__('_error._form._password_confirmation_not_match')
    }
  }
};

