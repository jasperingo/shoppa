const { notEmpty, categoryTypeIsIn } = require('../ValidationRules');
const CategoryRepository = require('../../repository/CategoryRepository');
const ValidationRules = require('../ValidationRules');

module.exports = {

  type: {
    isIn: categoryTypeIsIn
  },

  name: {
    notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await CategoryRepository.nameExists(value))
            return Promise.reject(req.__('_error._form._name_exists'));
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
  },

  description: {
    optional: true
  },

  hide_products: {
    notEmpty: ValidationRules.notEmpty,
    isBoolean: {
      bail: true,
      options: { loose: false },
    }
  }
};
