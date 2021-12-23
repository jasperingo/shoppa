const { StatusCodes } = require("http-status-codes");

module.exports = class BadRequestException {
  status = StatusCodes.BAD_REQUEST;
  message = '_error._bad_request';
  data;
  constructor(data) {
    this.data = data;
  }
}
