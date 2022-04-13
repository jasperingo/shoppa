const { StatusCodes } = require("http-status-codes");
const HTTPException = require("./HTTPException");

module.exports = class UnauthorizedException extends HTTPException {
  status = StatusCodes.UNAUTHORIZED;
  constructor(message = '_error._unauthorized', data) {
    super(data);
    this.message = message;
  }
}
