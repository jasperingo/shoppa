const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const TransactionRepository = require("../../repository/TransactionRepository");

module.exports = async (req, res, next)=> {
  try {
    const transaction = await TransactionRepository.get(req.params.id);
    if (transaction) {
      req.data = { transaction };
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

