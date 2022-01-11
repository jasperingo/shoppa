const InternalServerException = require("../../http/exceptions/InternalServerException");
const AdministratorRepository = require("../../repository/AdministratorRepository");
const StoreRepository = require("../../repository/StoreRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  name: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          const store = await StoreRepository.getByName(value);
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

  administrator_email: {
    notEmpty: ValidationRules.notEmpty,
    isEmail: ValidationRules.isEmail,
    custom: {
      options: async (value, { req })=> {
        try {
          if (!req.data || !req.data.store)
            return Promise.reject(req.__('_error._form._email_invalid'));
          
          const administrator = await AdministratorRepository.getByEmailAndStore(value, req.data.store.id);
          if (administrator === null)
            return Promise.reject(req.__('_error._form._email_invalid'));
          else 
            req.data.administrator = administrator;
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  administrator_password: ValidationRules.getAuthPasswordValid('administrator')

};

