
const InternalServerException = require('../../http/exceptions/InternalServerException');
const ValidationRules = require('../ValidationRules');
const StoreRepository = require('../../repository/StoreRepository');
const SubCategoryRepository = require('../../repository/SubCategoryRepository');

module.exports = {

  name: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await StoreRepository.nameExists(value))
            return Promise.reject(req.__('_error._form._name_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  sub_category_id: {
    isInt: ValidationRules.isInt,
    custom: {
      options: async (value, { req })=> {
        try {
          if (! (await SubCategoryRepository.idForStoreExists(value)) )
            return Promise.reject(req.__('_error._form._id_invalid'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  email: {
    notEmpty: ValidationRules.notEmpty,
    isEmail: ValidationRules.isEmail,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await StoreRepository.emailExists(value))
            return Promise.reject(req.__('_error._form._email_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
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
          if (await StoreRepository.phoneNumberExists(value))
            return Promise.reject(req.__('_error._form._phone_number_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  administrator_email: ValidationRules.getCustomerEmailValid(),

  administrator_password: {
    isLength: ValidationRules.isPasswordLength
  },
  
  administrator_password_confirmation: ValidationRules.getPasswordConfirmation('administrator_password')
};

