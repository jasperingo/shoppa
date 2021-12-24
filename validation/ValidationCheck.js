
const { validationResult } = require("express-validator");
const { errorFormat } = require("./ValidationRules");

const ValidationCheck = validationResult.withDefaults({ formatter: errorFormat });

module.exports = ValidationCheck;

