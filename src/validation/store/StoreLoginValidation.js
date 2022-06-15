const ValidationRules = require("../ValidationRules");

module.exports = {

  name: ValidationRules.getStoreNameValid(),

  administrator_email: ValidationRules.getStoreAdministratorEmailValid(),

  administrator_password: ValidationRules.getAuthPasswordValid('administrator')

};

