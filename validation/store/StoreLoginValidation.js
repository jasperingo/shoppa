const InternalServerException = require("../../http/exceptions/InternalServerException");
const StoreRepository = require("../../repository/StoreRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  name: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          const store = StoreRepository.getByName(value);
          if (store === null)
            return Promise.reject(req.__('_error._form._name_invalid'));
          else 
            req.data = { store };
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  //TODO
  administrator_email: ValidationRules.getCustomerEmailValid(),

  administrator_password: ValidationRules.getAuthPasswordValid('administrator_password'),

  administrator_password_confirmation: ValidationRules.getPasswordConfirmation()

};

