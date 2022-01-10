const Order = require("../../models/Order");
const ValidationRules = require("../ValidationRules");

module.exports = {

  delivery_firm_status: {
    notEmpty: ValidationRules.notEmpty,
    isIn: {
      bail: true,
      options: [Order.getDeliveryFirmStatuses()],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    },
    custom: {
      options: (value, { req })=> {
        if (req.data.order.delivery_firm_status !== Order.DELIVERY_FIRM_STATUS_PENDING || 
          req.data.order.status !== Order.STATUS_PENDING) {
          throw req.__('_error._form._order_status_not_pending', { status: value });
        }

        if (req.data.order.payment_method === Order.PAYMENT_METHOD_CASHLESS && 
          req.data.order.payment_status === Order.PAYMENT_STATUS_PENDING && 
          value === Order.DELIVERY_FIRM_STATUS_ACCEPTED) {
            throw req.__('_error._form._order_payment_pending');
        }

        return true;
      }
    }
  }

};
