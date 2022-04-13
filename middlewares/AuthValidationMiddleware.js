const UnauthorizedException = require("../http/exceptions/UnauthorizedException");
const InternalServerException = require("../http/exceptions/InternalServerException");
const ValidationCheck = require("../validation/ValidationCheck");
const { validationHasServerError } = require("../validation/ValidationRules");

module.exports = (req, res, next)=> {

  const errors = ValidationCheck(req);

  if (validationHasServerError(errors)) {
    next(new InternalServerException());
  } else if (!errors.isEmpty()) {
    next(new UnauthorizedException('_error._unauthorized_credential'));
  } else {
    next();
  }
};
