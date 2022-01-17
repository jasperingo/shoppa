const ValidationRules = require("../ValidationRules");

module.exports = {

  rating: {
    notEmpty: ValidationRules.notEmpty,
    isIn: ValidationRules.reviewRatingIsIn,
  },

  description: {
    notEmpty: ValidationRules.notEmpty,
  }

};
