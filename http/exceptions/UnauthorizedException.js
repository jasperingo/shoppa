const { StatusCodes } = require("http-status-codes");
const HTTPException = require("./HTTPException");

module.exports = class UnauthorizedException extends HTTPException {
  status = StatusCodes.UNAUTHORIZED;
  message = '_error._unauthorized';
}
