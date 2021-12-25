const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const CustomerRepository = require("../../repository/CustomerRepository");

module.exports = async (req, res, next)=> {
  try {
    const customer = await CustomerRepository.get(req.params.id);
    if (customer) {
      req.data = { customer };
      next();
    } else {
      next(new NotFoundException({
        path: `${req.baseUrl}/${req.params.id}`,
        param: parseInt(req.params.id)
      }));
    }
  } catch(error) {
    next(new InternalServerException(error));
  }
}

