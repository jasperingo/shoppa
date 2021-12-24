
const InternalServerException = require('../../http/exceptions/InternalServerException');
const Address = require('../../models/Address');
const AddressRepository = require('../../repository/AddressRepository');
const CustomerRepository = require('../../repository/CustomerRepository');
const { notEmpty } = require('../ValidationRules');

module.exports = {

  user_id: {
    isInt: {
      bail: true
    },
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
    notEmpty,
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
    in: [Address.TYPE_DEFAULT, Address.TYPE_SUB, Address.TYPE_PICK_UP]
  }

};

