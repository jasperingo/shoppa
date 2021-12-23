
const { validationResult } = require("express-validator");

const ValidationCheck = validationResult.withDefaults({
  formatter: err=> ({
    name: err.param,
    value: err.value,
    message: err.msg,
    errors: err.nestedErrors
  })
});

module.exports = ValidationCheck;

