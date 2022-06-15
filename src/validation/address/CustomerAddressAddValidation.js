const Address = require('../../models/Address');
const AddressRepository = require('../../repository/AddressRepository');
const ValidationRules = require('../ValidationRules');

module.exports = {

  title: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await AddressRepository.titleExistsForUser(value, req.auth.userId))
            return Promise.reject(req.__('_error._form._title_exists'));
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
  },

  state: ValidationRules.getStateValid(),

  city: ValidationRules.getCityValid(),

  street: {
    notEmpty: ValidationRules.notEmpty
  },

  type: {
    notEmpty: ValidationRules.notEmpty,
    isIn: ValidationRules.addressTypeIsIn,
    custom: {
      options: async (value, { req })=> {
        try {
          if (value !== Address.TYPE_DEFAULT && ! (await AddressRepository.typeDefaultExistsForUser(req.auth.userId)))
            return Promise.reject(req.__('_error._form._address_type_not_default'));
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
  }

};
