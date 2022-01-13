const InternalServerException = require("../../http/exceptions/InternalServerException");
const Transaction = require("../../models/Transaction");
const TransactionRepository = require("../../repository/TransactionRepository");
const WithdrawalAccountRepository = require("../../repository/WithdrawalAccountRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  amount: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTZero,
    custom: {
      options: async (value, { req })=> {
        try {

          const account = await WithdrawalAccountRepository.getByUser(req.auth.userId);
          
          if (account === null)
            return Promise.reject(req.__('_error._form._user_withdrawal_account_do_not_exist'));
          

          if (Transaction.WITHDRAWAL_MINIMIUM_LIMIT > value)
            return Promise.reject(req.__('_error._form._withdrawal_minimium_amount', { amount: Transaction.WITHDRAWAL_MINIMIUM_LIMIT }));
          
          const balance = await TransactionRepository.getBalance(req.auth.userId);

          if (balance < value)
            return Promise.reject(req.__('_error._form._withdrawal_amount_gt_balance'));
        } catch (error) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  }

};

