
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
          if (await StoreRepository.updateNameExists(value, req.data.store.user.id))
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
          if (await StoreRepository.updateEmailExists(value, req.data.store.user.id))
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
          if (await StoreRepository.updatePhoneNumberExists(value, req.data.store.user.id))
            return Promise.reject(req.__('_error._form._phone_number_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  }
};
