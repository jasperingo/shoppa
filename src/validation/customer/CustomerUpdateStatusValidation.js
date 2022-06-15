const ValidationRules = require('../ValidationRules');

module.exports = {

  status: {
    notEmpty: ValidationRules.notEmpty,
    isIn: ValidationRules.userStatusIsIn
  }

};

