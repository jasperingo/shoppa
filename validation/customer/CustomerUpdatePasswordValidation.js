
const InternalServerException = require('../../http/exceptions/InternalServerException');
const { isPasswordLength } = require('../ValidationRules');
const { getPasswordById } = require('../../repository/CustomerRepository');
const { comparePassword } = require('../../security/Hash');

module.exports = {

  password: {
    isLength: isPasswordLength, 
    custom: {
      options: async (value, { req })=> {
        try {
          const i = await getPasswordById(req.params.id);
          if (!(await comparePassword(value, i)) )
            return Promise.reject(req.__('_error._form._password_invalid'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  new_password: {
    isLength: isPasswordLength,
  },

  new_password_confirmation: {
    isLength: isPasswordLength,
    custom: {
      options: (value, { req })=> value === req.body.new_password,
      errorMessage: (value, { req })=> req.__('_error._form._password_confirmation_not_match')
    }
  }
};

