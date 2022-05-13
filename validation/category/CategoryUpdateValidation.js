const ValidationRules = require('../ValidationRules');
const CategoryRepository = require('../../repository/CategoryRepository');

module.exports = {

  name: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await CategoryRepository.updateNameExists(value, req.params.id))
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
