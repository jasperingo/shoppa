const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const StringGenerator = require("../http/StringGenerator");
const TransactionRepository = require("../repository/TransactionRepository");

module.exports = class TransactionController {

  async verifyByWebhook(req, res, next) {
    
    try {

      if (req.body.event === 'charge.success') {
        
        await TransactionRepository.updatePaymentVerifed(req.body.data.reference, StringGenerator.transactionReference);

      } else if (req.body.event === 'transfer.success') {

      }
      
      res.status(StatusCodes.OK).send({ reference: req.body.data.reference });

    } catch(error) {
      console.error(error)
      next(new InternalServerException(error));
    }
  }

  async createWithdrawal(req, res, next) {
    res.send({ tap: 899 });
  }

}

