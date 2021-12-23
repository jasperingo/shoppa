const { StatusCodes } = require("http-status-codes");

module.exports = class InternalServerException {
  static TAG = 'INTERNAL_SERVER_ERROR';
  status = StatusCodes.INTERNAL_SERVER_ERROR;
  message = '_error._server';
  data;
  constructor(data) {
    this.data = data;
  }
}
