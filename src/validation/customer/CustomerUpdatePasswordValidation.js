
const ValidationRules = require('../ValidationRules');

module.exports = {

  password: ValidationRules.getAuthPasswordValid('customer'),

  new_password: {
    isLength: ValidationRules.isPasswordLength,
  },

  new_password_confirmation: ValidationRules.getPasswordConfirmation('new_password')
};

