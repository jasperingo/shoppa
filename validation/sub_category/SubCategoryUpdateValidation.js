const { notEmpty } = require('../ValidationRules');
const SubCategoryRepository = require('../../repository/SubCategoryRepository');

module.exports = {

  name: {
    notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await SubCategoryRepository.updateNameExists(value, req.params.id))
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
