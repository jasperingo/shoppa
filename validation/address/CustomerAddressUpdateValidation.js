
const InternalServerException = require('../../http/exceptions/InternalServerException');
const AddressRepository = require('../../repository/AddressRepository');
const ValidationRules = require('../ValidationRules');

module.exports = {

  title: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await AddressRepository.updateTitleExistsForUser(value, req.data.address.user_id, req.params.id))
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

