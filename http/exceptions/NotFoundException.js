const { StatusCodes } = require("http-status-codes");
const HTTPException = require("./HTTPException");

module.exports = class NotFoundException extends HTTPException {
  status = StatusCodes.NOT_FOUND;
  message = '_error._not_found';
}
