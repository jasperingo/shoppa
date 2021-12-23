const InternalServerException = require("../../http/exceptions/InternalServerException");
const { notEmpty, isEmail, isPhoneNumberLength } = require('../ValidationRules');
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
          if (await CustomerRepository.updateEmailExists(value, req.params.id))
            return Promise.reject(req.__('_error._form._email_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },
  phone_number: {
    optional: true,
    isLength: isPhoneNumberLength
  }
};


