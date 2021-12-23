const { StatusCodes } = require("http-status-codes");

module.exports = class UnauthorizedException {
  status = StatusCodes.UNAUTHORIZED;
  message = '_error._unauthorized';
  data;
  constructor(data) {
    this.data = data;
  }
}
