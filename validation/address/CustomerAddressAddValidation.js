
const InternalServerException = require('../../http/exceptions/InternalServerException');
const AddressRepository = require('../../repository/AddressRepository');
const CustomerRepository = require('../../repository/CustomerRepository');
const ValidationRules = require('../ValidationRules');

module.exports = {

  user_id: {
    isInt: ValidationRules.isInt,
    custom: {
      options: async (value, { req })=> {
        try {
          if (! (await CustomerRepository.idExists(value)))
            return Promise.reject(req.__('_error._form._id_invalid'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  title: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await AddressRepository.titleExistsForUser(value, req.body.user_id))
            return Promise.reject(req.__('_error._form._title_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
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
    isIn: ValidationRules.addressTypeIsIn
  }

};

