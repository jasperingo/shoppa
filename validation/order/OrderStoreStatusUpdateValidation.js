const Order = require("../../models/Order");
const ValidationRules = require("../ValidationRules");

module.exports = {

  store_status: {
    notEmpty: ValidationRules.notEmpty,
    isIn: {
      bail: true,
      options: [Order.getStoreStatuses()],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    },
    custom: {
      options: (value, { req })=> {
        if (req.data.order.store_status !== Order.STORE_STATUS_PENDING || req.data.order.status !== Order.STATUS_PENDING) {
          throw req.__('_error._form._order_status_not_pending', { status: value });
        }

        if (req.data.order.payment_method === Order.PAYMENT_METHOD_CASHLESS && 
          req.data.order.payment_status === Order.PAYMENT_STATUS_PENDING && 
          value === Order.STORE_STATUS_ACCEPTED) {
            throw req.__('_error._form._order_payment_pending');
        }

        return true;
      }
    }
  }

};
