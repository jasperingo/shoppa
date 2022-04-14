const InternalServerException = require("../../http/exceptions/InternalServerException");
const User = require("../../models/User");
const UserRepository = require("../../repository/UserRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  type: {
    notEmpty: ValidationRules.notEmpty,
    isIn: {
      bail: true,
      options: [User.getTypes()],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  },

  email: {
    notEmpty: ValidationRules.notEmpty,
    isEmail: ValidationRules.isEmail,
    custom: {
      options: async (value, { req })=> {
        try {
          const user = await UserRepository.getByEmailAndType(value, req.body.type ?? '');
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
