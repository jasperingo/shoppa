
const ValidationRules = require('../ValidationRules');

module.exports = {
  
  email: ValidationRules.getCustomerEmailValid(),

  password: ValidationRules.getAuthPasswordValid('customer')
  
};

