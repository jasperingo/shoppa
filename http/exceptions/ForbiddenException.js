const { StatusCodes } = require("http-status-codes");

module.exports = class ForbiddenException {
  status = StatusCodes.FORBIDDEN;
  message = '_error._forbidden';
  data;
  constructor(data) {
    this.data = data;
  }
}
