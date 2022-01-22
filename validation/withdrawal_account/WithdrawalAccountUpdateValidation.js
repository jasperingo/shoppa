const InternalServerException = require('../../http/exceptions/InternalServerException');
const WithdrawalAccount = require('../../models/WithdrawalAccount');
const BankRepository = require('../../repository/BankRepository');
const ValidationRules = require('../ValidationRules');

module.exports = {

  bank_code: {
    notEmpty: ValidationRules.notEmpty,
  },

  account_name: {
    notEmpty: ValidationRules.notEmpty,
  },

  account_number: {
    notEmpty: ValidationRules.notEmpty,
    isLength: {
      bail: true,
      options: { max : 10, min: 10 },
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    },
    custom: {
      options: async (value, { req })=> {
        try {
          if (! (await BankRepository.accountNumberExists(value, req.body.bank_code || '')))
            return Promise.reject(req.__('_error._form._field_invalid'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  account_type: {
    notEmpty: ValidationRules.notEmpty,
    isIn: {
      options: [WithdrawalAccount.getTypes()],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    },
  }

};


