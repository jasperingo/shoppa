
const Address = require('../../models/Address');

module.exports = {

  type: {
    custom: {
      options: (value, { req })=> {
        if (req.data.address.type === Address.TYPE_DEFAULT)
          throw req.__('_error._form._address_type_default_delete');

        return true;
      }
    }
  }

};

