
const InternalServerException = require('../../http/exceptions/InternalServerException');
const AddressRepository = require('../../repository/AddressRepository');
const { notEmpty, addressTypeIsIn } = require('../ValidationRules');

module.exports = {

  title: {
    notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await AddressRepository.updateTitleExistsForUser(value, req.body.user_id, req.params.id))
            return Promise.reject(req.__('_error._form._title_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  street: {
    notEmpty
  },

  city: {
    notEmpty
  },

  state: {
    notEmpty
  },

  type: {
    notEmpty,
    isIn: addressTypeIsIn
  }

};

