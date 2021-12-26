
const InternalServerException = require('../../http/exceptions/InternalServerException');
const ValidationRules = require('../ValidationRules');
const AdministratorRepository = require('../../repository/AdministratorRepository');

module.exports = {

  email: {
    notEmpty: ValidationRules.notEmpty,
    isEmail: ValidationRules.isEmail,
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

  password: ValidationRules.getAuthPasswordValid('administrator'),
  
};

