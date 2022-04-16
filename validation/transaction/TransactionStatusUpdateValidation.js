const Transaction = require("../../models/Transaction");
const JWT = require("../../security/JWT");
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

        const status = req.data.transaction.status;

        if (req.auth.authType !== JWT.AUTH_APP_ADMIN  && value !== Transaction.STATUS_CANCELLED)
          throw req.__('_error._form._field_invalid');

        if (
          req.auth.authType === JWT.AUTH_APP_ADMIN &&
          (
            status === Transaction.STATUS_PENDING && 
            ![Transaction.STATUS_DECLINED, Transaction.STATUS_PROCESSING].includes(value)
          )
          || 
          (
            status === Transaction.STATUS_PROCESSING && 
            ![Transaction.STATUS_APPROVED, Transaction.STATUS_FAILED].includes(value)
          )
        )
          throw req.__('_error._form._field_invalid');

        return true;
      }
    }
  }

};
