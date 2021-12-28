
const InternalServerException = require('../../http/exceptions/InternalServerException');
const ProductRepository = require('../../repository/ProductRepository');
const SubCategoryRepository = require('../../repository/SubCategoryRepository');
const ValidationRules = require('../ValidationRules');

module.exports = {

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
    custom: {
      options: async (value, { req })=> {
        try {
          if (await ProductRepository.updateCodeExists(value, req.params.id))
            return Promise.reject(req.__('_error._form._code_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  title: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await ProductRepository.updateTitleExists(value, req.params.id))
            return Promise.reject(req.__('_error._form._title_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  description: {
    notEmpty: ValidationRules.notEmpty,
  },
  
  product_variants: ValidationRules.isValidArray,

  'product_variants.*.name': {
    notEmpty: ValidationRules.notEmpty,
  },

  'product_variants.*.price': {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatWithZeroMin
  },

  'product_variants.*.quantity': {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatWithZeroMin
  },

  'product_variants.*.available': {
    notEmpty: ValidationRules.notEmpty,
    isBoolean: {
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  },

  'product_variants.*.weight': {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatWithZeroMin
  },

};

