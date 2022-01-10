const Order = require("../../models/Order");
const ValidationRules = require("../ValidationRules");

module.exports = {

  status: {
    notEmpty: ValidationRules.notEmpty,
    isIn: {
      bail: true,
      options: [Order.getStatuses()],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    },
    custom: {
      options: (value, { req })=> {
        if (req.data.order.status !== Order.STATUS_PENDING) {
          throw req.__('_error._form._order_status_not_pending', { status: value });
        }
        
        return true;
      }
    }
  }

};

