const ReviewRepository = require("../../repository/ReviewRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  store_id: {
    notEmpty: ValidationRules.notEmpty,
    isInt: ValidationRules.isInt,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await ReviewRepository.existsForStore(value, req.auth.customerId))
            return Promise.reject(req.__('_error._form._review_exists'));
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
  },

  rating: {
    notEmpty: ValidationRules.notEmpty,
    isIn: ValidationRules.reviewRatingIsIn,
  },

  description: {
    notEmpty: ValidationRules.notEmpty,
  }

};

