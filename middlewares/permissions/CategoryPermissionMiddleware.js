const createHttpError = require("http-errors");
const JWT = require("../../security/JWT");

module.exports = function(req, res, next) {
  if (req.auth.authType === JWT.AUTH_APP_ADMIN) {
    next();
  } else {
    next(createHttpError.Forbidden());
  }
};
