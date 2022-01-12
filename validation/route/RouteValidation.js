
const ValidationRules = require("../ValidationRules");

module.exports = {

  state: ValidationRules.getStateValid(),

  city: ValidationRules.getCityValid(),

  door_delivery: {
    notEmpty: ValidationRules.notEmpty,
    isBoolean: ValidationRules.isBoolean
  },

  isolated: {
    notEmpty: ValidationRules.notEmpty,
    isBoolean: ValidationRules.isBoolean
  }
  
};

