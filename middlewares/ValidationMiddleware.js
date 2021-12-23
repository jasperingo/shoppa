const BadRequestException = require("../http/exceptions/BadRequestException");
const InternalServerException = require("../http/exceptions/InternalServerException");
const ValidationCheck = require("../validation/ValidationCheck");
const { validationHasServerError } = require("../validation/ValidationRules");

module.exports = (exception = BadRequestException)=> {
  
  return (req, res, next)=> {

    const errors = ValidationCheck(req);

    if (validationHasServerError(errors)) {
      next(new InternalServerException());
    } else if (!errors.isEmpty()) {
      next(new exception(errors.array()));
    } else {
      next();
    }
  };
};
