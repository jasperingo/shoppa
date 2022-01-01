
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
          if (await ProductRepository.codeExists(value))
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
          if (await ProductRepository.titleExists(value))
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
  
  product_variants: {
    isArray: ValidationRules.isArray,
    custom: {
      options: (value, { req })=> {

        const err = [];
        
        ValidationRules.productVarientCheck(
          value,
          err,
          req.__('_error._form._field_invalid')
        )

        if (err.length > 0) throw err;

        ValidationRules.productVariantIsUnique(
          value,
          err,
          req.__('_error._form._field_duplicated')
        );

        if (err.length > 0) throw err;

        return true;
      }
    }
  },


};

