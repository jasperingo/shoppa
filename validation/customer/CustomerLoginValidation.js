
const InternalServerException = require('../../http/exceptions/InternalServerException');
const { notEmpty, isEmail, isPasswordLength } = require('../ValidationRules');
const { emailExists, getPasswordByEmail } = require('../../repository/CustomerRepository');
const { comparePassword } = require('../../security/Hash');

module.exports = {
  
  email: {
    notEmpty,
    isEmail,
    custom: {
      options: async (value, { req })=> {
        try {
          if (!(await emailExists(value)))
            return Promise.reject(req.__('_error._form._email_invalid'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  password: {
    isLength: isPasswordLength, 
    custom: {
      options: async (value, { req })=> {
        try {
          const i = await getPasswordByEmail(req.body.email);
          if (!(await comparePassword(value, i)) )
            return Promise.reject(req.__('_error._form._password_invalid'));
        } catch (err) {
          console.error(err)
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  password_confirmation: {
    isLength: isPasswordLength,
    custom: {
      options: (value, { req })=> value === req.body.password,
      errorMessage: (value, { req })=> req.__('_error._form._password_confirmation_not_match')
    }
  }
};

