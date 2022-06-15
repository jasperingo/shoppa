const PasswordResetRepository = require("../../repository/PasswordResetRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  token: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          const passwordReset = await PasswordResetRepository.getByToken(value);
          
          if (passwordReset === null || (new Date(passwordReset.expires_at)).getTime() <= Date.now())
            return Promise.reject(req.__('_error._form._field_invalid'));
          else 
            req.data = { passwordReset };
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
  },

  password: {
    isLength: ValidationRules.isPasswordLength
  },
  
  password_confirmation: ValidationRules.getPasswordConfirmation()

};

