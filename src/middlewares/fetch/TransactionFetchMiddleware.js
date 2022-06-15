const createHttpError = require("http-errors");
const TransactionRepository = require("../../repository/TransactionRepository");

module.exports = async function(req, res, next) {
  try {
    const transaction = await TransactionRepository.get(req.params.id);
    if (transaction) {
      req.data = { transaction };
      next();
    } else {
      next(createHttpError.NotFound({
        data: {
          path: `${req.baseUrl}/${req.params.id}`,
          param: parseInt(req.params.id)
        }
      }));
    }
  } catch(error) {
    next(createHttpError.InternalServerError(error));
  }
}
