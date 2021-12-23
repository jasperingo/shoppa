
module.exports = class Response {
  
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

}

