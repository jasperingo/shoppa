const createHttpError = require("http-errors");
const { errorFormat } = require("../validation/ValidationRules");

module.exports = function(name = 'photo') {
  return function(req, res, next) {
    if (req.file === undefined) {
      next(createHttpError.BadRequest({
        data: [
          errorFormat({
            param: name,
            msg: req.__('_error._form._field_required')
          })
        ]
      }));
    } else {
      next();
    }
  };
};
