const createHttpError = require("http-errors");
const ValidationCheck = require("../validation/ValidationCheck");
const { validationHasServerError } = require("../validation/ValidationRules");

module.exports = function(req, res, next) {

  const errors = ValidationCheck(req);

  const serverError = validationHasServerError(errors);

  if (serverError !== null) {
    next(createHttpError.InternalServerError(serverError));
  } else if (!errors.isEmpty()) {
    next(createHttpError.BadRequest({ data: errors.array() }));
  } else {
    next();
  }
}
