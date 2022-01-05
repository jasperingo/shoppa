
const ValidationRules = require("../ValidationRules");

module.exports = {

  location_1_state: ValidationRules.getStateValid(),

  location_2_state: ValidationRules.getStateValid(),

  location_1_city: ValidationRules.getOptionalCityValid('location_1_state'),

  location_2_city: ValidationRules.getOptionalCityValid('location_2_state'),
  
};

