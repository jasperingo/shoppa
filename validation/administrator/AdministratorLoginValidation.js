
const ValidationRules = require('../ValidationRules');

module.exports = {

  email: ValidationRules.getAdministratorEmailValid(),

  password: ValidationRules.getAuthPasswordValid('administrator'),
  
};

