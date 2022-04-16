const createHttpError = require("http-errors");
const Transaction = require("../../../models/Transaction");
const UserRepository = require("../../../repository/UserRepository");
const JWT = require("../../../security/JWT");

module.exports = async function(req, res, next) {

  try {
    
    if (
      [Transaction.TYPE_WITHDRAWAL, Transaction.TYPE_REFUND].includes(req.data.transaction.type) && 
      (
        (
          req.auth.authType === JWT.AUTH_APP_ADMIN &&
          [Transaction.STATUS_PROCESSING, Transaction.STATUS_PENDING].includes(req.data.transaction.status)
        )
        ||
        (
          req.data.transaction.user_id === req.auth.userId && 
          Transaction.STATUS_PENDING === req.data.transaction.status &&
          await UserRepository.statusIsActive(req.auth.userId)
        )
      )
    ) {
      next();
    } else {
      next(createHttpError.Forbidden());
    }
  } catch (error) {
    next(createHttpError.InternalServerError(error))
  }
}
