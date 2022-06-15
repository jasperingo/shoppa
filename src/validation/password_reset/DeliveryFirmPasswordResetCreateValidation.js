const ValidationRules = require("../ValidationRules");

module.exports = {

  name: ValidationRules.getDeliveryFirmNameValid(),

  administrator_email: ValidationRules.getDeliveryFirmAdministratorEmailValid(),

};
