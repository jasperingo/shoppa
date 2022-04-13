const { StatusCodes } = require("http-status-codes");
const HTTPException = require("./HTTPException");

module.exports = class ForbiddenException extends HTTPException {
  status = StatusCodes.FORBIDDEN;
  constructor(message = '_error._forbidden', data) {
    super(data);
    this.message = message;
  }
}
