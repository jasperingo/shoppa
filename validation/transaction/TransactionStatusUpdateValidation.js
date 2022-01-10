const Transaction = require("../../models/Transaction");
const ValidationRules = require("../ValidationRules");

module.exports = {

  status: {
    notEmpty: ValidationRules.notEmpty,
    isIn: {
      bail: true,
      options: [Transaction.getStatuses()],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    },
    custom: {
      options: (value, { req })=> {

        if ([Transaction.TYPE_WITHDRAWAL, Transaction.TYPE_REFUND].indexOf(req.data.transaction.type) === -1) {
          throw req.__('_error._form._transaction_cant_update_status');
        }
        
        if (req.data.transaction.status !== Transaction.STATUS_PENDING) {
          throw req.__('_error._form._transaction_status_not_pending', { status: value });
        }
        
        return true;
      }
    }
  }

};

