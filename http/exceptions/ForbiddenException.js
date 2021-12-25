const { StatusCodes } = require("http-status-codes");
const HTTPException = require("./HTTPException");

module.exports = class ForbiddenException extends HTTPException {
  status = StatusCodes.FORBIDDEN;
  message = '_error._forbidden';
}
