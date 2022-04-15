const Order = require("../../models/Order");
const OrderRepository = require("../../repository/OrderRepository");
const WithdrawalAccountRepository = require("../../repository/WithdrawalAccountRepository");
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
            order.status === Order.STATUS_PENDING || 
            order.status === Order.STATUS_PROCESSING || 
            order.status === Order.STATUS_FULFILLED || 
            order.payment_status !== Order.PAYMENT_STATUS_APPROVED || 
            order.refund_status === Order.REFUND_STATUS_PENDING || 
            order.refund_status === Order.REFUND_STATUS_APPROVED
            )
            return Promise.reject(req.__('_error._form._order_cant_get_refund'));
          
          const account = await WithdrawalAccountRepository.getByUser(order.customer.user.id);
          
          if (account === null)
            return Promise.reject(req.__('_error._form._user_withdrawal_account_do_not_exist'));

          req.data = { order };
          
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }
  }

};
