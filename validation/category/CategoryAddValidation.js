
const InternalServerException = require('../../http/exceptions/InternalServerException');
const { notEmpty, categoryTypeIsIn } = require('../ValidationRules');
const CategoryRepository = require('../../repository/CategoryRepository');

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
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  description: {
    optional: true
  }
};

