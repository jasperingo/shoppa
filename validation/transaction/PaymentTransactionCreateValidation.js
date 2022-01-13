const InternalServerException = require("../../http/exceptions/InternalServerException");
const Order = require("../../models/Order");
const OrderRepository = require("../../repository/OrderRepository");
const ValidationRules = require("../ValidationRules");


module.exports = {

  order_id: {
    notEmpty: ValidationRules.notEmpty,
    isInt: ValidationRules.isInt,
    custom: {
      options: async (value, { req })=> {
        try {

          const order = await OrderRepository.get(value);

          if (order === null)
            return Promise.reject(req.__('_error._form._id_invalid'));
          
          if (
              order.status === Order.STATUS_CANCELLED || 
              order.status === Order.STATUS_DECLINED ||
              order.payment_status === Order.PAYMENT_STATUS_APPROVED || 
              order.payment_status === Order.PAYMENT_STATUS_PENDING
            )
            return Promise.reject(req.__('_error._form._order_cant_get_payment'));
          
          req.data = { order };
          
        } catch (error) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  }

};

