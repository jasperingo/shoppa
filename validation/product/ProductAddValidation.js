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
          return Promise.reject(err);
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
          return Promise.reject(err);
        }
      }
    }
  },

  description: {
    notEmpty: ValidationRules.notEmpty,
  },

};
