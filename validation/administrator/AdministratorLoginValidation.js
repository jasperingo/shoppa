
const InternalServerException = require('../../http/exceptions/InternalServerException');
const { notEmpty, isEmail, isPasswordLength } = require('../ValidationRules');
const { comparePassword } = require('../../security/Hash');
const AdministratorRepository = require('../../repository/AdministratorRepository');

module.exports = {

  email: {
    notEmpty,
    isEmail,
    custom: {
      options: async (value, { req })=> {
        try {
          const administrator = await AdministratorRepository.getByEmail(value);
          if (administrator === null)
            return Promise.reject(req.__('_error._form._email_invalid'));
          else 
            req.data = { administrator };
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
          if (! (await comparePassword(value, req.data.administrator.password)) )
            return Promise.reject(req.__('_error._form._password_invalid'));
        } catch (err) {
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

