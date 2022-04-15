
module.exports = class ResponseDTO {
  
  static ERROR = 'error';
  static SUCCESS = 'success';

  status;
  message;
  data;
  pagination;

  constructor(status, message, data, pagination) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.pagination = pagination;
  }

  static error(message, data, pagination) {
    return new ResponseDTO(ResponseDTO.ERROR, message, data, pagination);
  }

  static success(message, data, pagination) {
    return new ResponseDTO(ResponseDTO.SUCCESS, message, data, pagination);
  }

}
