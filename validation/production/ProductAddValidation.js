
const InternalServerException = require('../../http/exceptions/InternalServerException');
const StoreRepository = require('../../repository/StoreRepository');
const SubCategoryRepository = require('../../repository/SubCategoryRepository');
const ValidationRules = require('../ValidationRules');

module.exports = {

  store_id: {
    notEmpty: ValidationRules.notEmpty,
    isInt: ValidationRules.isInt,
    custom: {
      options: async (value, { req })=> {
        try {
          if (! (await StoreRepository.idExists(value)))
            return Promise.reject(req.__('_error._form._id_invalid'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  sub_category_id: {
    notEmpty: ValidationRules.notEmpty,
    isInt: ValidationRules.isInt,
    custom: {
      options: async (value, { req })=> {
        try {
          if (! (await SubCategoryRepository.idForProductExists(value)))
            return Promise.reject(req.__('_error._form._id_invalid'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  code: {
    notEmpty: ValidationRules.notEmpty,
  },

  title: {
    notEmpty: ValidationRules.notEmpty,
  },

  price: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: {
      options: {
        min: 0
      },
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  },

  quantity: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: {
      options: {
        min: 0
      },
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  },

  available: {
    notEmpty: ValidationRules.notEmpty,
    isBoolean: {
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  },

  weight: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: {
      options: {
        min: 0
      },
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  },

  description: {
    notEmpty: ValidationRules.notEmpty,
  }

};

