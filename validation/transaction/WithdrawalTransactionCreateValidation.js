const InternalServerException = require("../../http/exceptions/InternalServerException");
const Transaction = require("../../models/Transaction");
const TransactionRepository = require("../../repository/TransactionRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  amount: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTZero,
    custom: {
      options: async (value, { req })=> {
        try {
          if (Transaction.WITHDRAWAL_MINIMIUM_LIMIT > value)
            return Promise.reject(req.__('_error._form._withdrawal_minimium_amount', { amount: Transaction.WITHDRAWAL_MINIMIUM_LIMIT }));
          
          const balance = await TransactionRepository.getAmountSumByUser(req.body.user_id);
          console.log(balance)

          if (balance < value)
            return Promise.reject(req.__('_error._form._withdrawal_amount_gt_balance'));
        } catch (error) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  }

};

