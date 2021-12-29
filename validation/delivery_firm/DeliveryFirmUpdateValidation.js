
const InternalServerException = require('../../http/exceptions/InternalServerException');
const ValidationRules = require('../ValidationRules');
const DeliveryFirmRepository = require('../../repository/DeliveryFirmRepository');

module.exports = {

  name: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await DeliveryFirmRepository.updateNameExists(value, req.data.deliveryFirm.user.id))
            return Promise.reject(req.__('_error._form._name_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  email: {
    notEmpty: ValidationRules.notEmpty,
    isEmail: ValidationRules.isEmail,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await DeliveryFirmRepository.updateEmailExists(value, req.data.deliveryFirm.user.id))
            return Promise.reject(req.__('_error._form._email_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  phone_number: {
    notEmpty: ValidationRules.notEmpty,
    isLength: ValidationRules.isPhoneNumberLength,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await DeliveryFirmRepository.updatePhoneNumberExists(value, req.data.deliveryFirm.user.id))
            return Promise.reject(req.__('_error._form._phone_number_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

};

