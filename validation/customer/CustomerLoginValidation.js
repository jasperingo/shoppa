
const ValidationRules = require('../ValidationRules');

module.exports = {
  
  email: ValidationRules.getCustomerEmailValid(),

  password: ValidationRules.getAuthPasswordValid('customer'),

  password_confirmation: ValidationRules.getPasswordConfirmation()
};

