
const ValidationRules = require("../ValidationRules");

module.exports = {

  state: ValidationRules.getStateValid(),

  city: ValidationRules.getCityValid(),
  
};
