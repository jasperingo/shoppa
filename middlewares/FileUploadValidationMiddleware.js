
const BadRequestException = require("../http/exceptions/BadRequestException");
const { errorFormat } = require("../validation/ValidationRules");

module.exports = (req, res, next)=> {
  if (req.file === undefined) {
    next(new BadRequestException([errorFormat({
      param: 'file',
      msg: req.__('_error._form._field_required')
    })]));
  } else {
    next();
  }
};

