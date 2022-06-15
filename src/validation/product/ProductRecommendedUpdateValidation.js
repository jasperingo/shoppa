const ValidationRules = require("../ValidationRules");

module.exports = {

  recommended: {
    notEmpty: ValidationRules.notEmpty,
    isBoolean: ValidationRules.isBoolean
  }

};
