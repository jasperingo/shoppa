const InternalServerException = require("../../http/exceptions/InternalServerException");
const UserRepository = require("../../repository/UserRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  email: {
    notEmpty: ValidationRules.notEmpty,
    isEmail: ValidationRules.isEmail,
    custom: {
      options: async (value, { req })=> {
        try {
          const user = await UserRepository.getByEmail(value);
          if (user === null)
            return Promise.reject(req.__('_error._form._email_invalid'));
          else 
            req.data = { user };
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    },
    normalizeEmail: true
  },
}
