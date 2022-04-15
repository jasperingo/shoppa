const ValidationRules = require('../ValidationRules');
const SubCategoryRepository = require('../../repository/SubCategoryRepository');
const UserRepository = require('../../repository/UserRepository');

module.exports = {

  name: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await UserRepository.nameExists(value))
            return Promise.reject(req.__('_error._form._name_exists'));
        } catch (err) {
          return Promise.reject(err);
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
          return Promise.reject(err);
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
          if (await UserRepository.emailExists(value))
            return Promise.reject(req.__('_error._form._email_exists'));
        } catch (err) {
          return Promise.reject(err);
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
          if (await UserRepository.phoneNumberExists(value))
            return Promise.reject(req.__('_error._form._phone_number_exists'));
        } catch (err) {
          return Promise.reject(err);
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
