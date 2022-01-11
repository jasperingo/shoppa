const InternalServerException = require("../../http/exceptions/InternalServerException");
const AdministratorRepository = require("../../repository/AdministratorRepository");
const DeliveryFirmRepository = require("../../repository/DeliveryFirmRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  name: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          const deliveryFirm = await DeliveryFirmRepository.getByName(value);
          if (deliveryFirm === null)
            return Promise.reject(req.__('_error._form._name_invalid'));
          else 
            req.data = { deliveryFirm };
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
          if (!req.data || !req.data.deliveryFirm)
            return Promise.reject(req.__('_error._form._email_invalid'));
          
          const administrator = await AdministratorRepository.getByEmailAndDeliveryFirm(value, req.data.deliveryFirm.id);
          if (administrator === null)
            return Promise.reject(req.__('_error._form._email_invalid'));
          else 
            req.data.administrator = administrator;
        } catch (err) {
          console.error(err)
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  administrator_password: ValidationRules.getAuthPasswordValid('administrator')

};

