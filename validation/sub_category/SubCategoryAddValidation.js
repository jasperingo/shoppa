const { notEmpty, isInt } = require('../ValidationRules');
const CategoryRepository = require('../../repository/CategoryRepository');
const SubCategoryRepository = require('../../repository/SubCategoryRepository');

module.exports = {

  category_id: {
    isInt,
    custom: {
      options: async (value, { req })=> {
        try {
          if (! (await CategoryRepository.idExists(value)))
            return Promise.reject(req.__('_error._form._id_invalid'));
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
  },

  name: {
    notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await SubCategoryRepository.nameExists(value))
            return Promise.reject(req.__('_error._form._name_exists'));
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
  },

  description: {
    optional: true
  }
};
