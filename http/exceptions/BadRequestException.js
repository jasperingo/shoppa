const { StatusCodes } = require("http-status-codes");
const HTTPException = require("./HTTPException");

module.exports = class BadRequestException extends HTTPException {
  status = StatusCodes.BAD_REQUEST;
  message = '_error._bad_request';
}
