const { StatusCodes } = require("http-status-codes");

module.exports = class NotFoundException {
  status = StatusCodes.NOT_FOUND;
  message = '_error._not_found';
}
