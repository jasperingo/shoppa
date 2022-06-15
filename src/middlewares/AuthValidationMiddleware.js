const createHttpError = require("http-errors");
const ValidationCheck = require("../validation/ValidationCheck");
const { validationHasServerError } = require("../validation/ValidationRules");

module.exports = function(req, res, next) {

  const errors = ValidationCheck(req);

  if (validationHasServerError(errors)) {
    next(createHttpError.InternalServerError());
  } else if (!errors.isEmpty()) {
    next(createHttpError.Unauthorized({ message: '_error._unauthorized_credential' }));
  } else {
    next();
  }
};
