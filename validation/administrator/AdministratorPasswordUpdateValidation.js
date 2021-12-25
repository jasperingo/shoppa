
const InternalServerException = require('../../http/exceptions/InternalServerException');
const { isPasswordLength } = require('../ValidationRules');
const { comparePassword } = require('../../security/Hash');

module.exports = {

  password: {
    isLength: isPasswordLength, 
    custom: {
      options: async (value, { req })=> {
        try {
          if (!(await comparePassword(value, req.data.administrator.password)) )
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

