const UserRepository = require("../../repository/UserRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {
  token: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          const user = await UserRepository.getByEmailVerificationToken(value);
          if (user === null)
            return Promise.reject(req.__('_error._form._field_invalid'));
          else 
            req.data = { user };
        } catch (err) {
          return Promise.reject(err);
        }
      }
    },
    normalizeEmail: true
  }
};
