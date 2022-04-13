const Transaction = require("../../models/Transaction");
const ValidationRules = require("../ValidationRules");

module.exports = {

  status: {
    notEmpty: ValidationRules.notEmpty,
    isIn: {
      bail: true,
      options: [Transaction.getStatuses()],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  }

};
