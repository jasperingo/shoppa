const { StatusCodes } = require("http-status-codes");
const HTTPException = require("./HTTPException");

module.exports = class InternalServerException extends HTTPException {
  static TAG = 'INTERNAL_SERVER_ERROR';
  status = StatusCodes.INTERNAL_SERVER_ERROR;
  message = '_error._server';
}
