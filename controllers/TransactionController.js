const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const StringGenerator = require("../http/StringGenerator");
const Transaction = require("../models/Transaction");
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
  
  async createPayment(req, res, next) {
    
    try {

      const reference = await StringGenerator.transactionReference();

      const _transaction = await TransactionRepository.createPayment(req.data.order, reference);

      const transaction = await TransactionRepository.get(_transaction.id);

      const response = new Response(Response.SUCCESS, req.__('_created._transaction'), transaction);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async createWithdrawal(req, res, next) {
    
    try {

      const reference = await StringGenerator.transactionReference();

      const _transaction = await TransactionRepository.createWithdrawal(req.body, reference, req.auth.userId);

      const transaction = await TransactionRepository.get(_transaction.id);

      const response = new Response(Response.SUCCESS, req.__('_created._transaction'), transaction);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async createRefund(req, res, next) {
    
    try {

      const reference = await StringGenerator.transactionReference();

      const _transaction = await TransactionRepository.createRefund(req.data.order, reference);

      const transaction = await TransactionRepository.get(_transaction.id);

      const response = new Response(Response.SUCCESS, req.__('_created._transaction'), transaction);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updateStatus(req, res, next) {
    return res.send({ hat:77 });
    try {
      
      switch (req.body.status) {
        case Transaction.STATUS_CANCELLED:
        case Transaction.STATUS_DECLINED:
          await TransactionRepository.updateStatusToDeclinedOrCancelled(req.data.transaction, req.body.status);
          break;
        case Transaction.STATUS_PROCESSING:
          await TransactionRepository.updateStatusToProcessing(req.data.transaction);
          break;
      }
      
      const transaction = await TransactionRepository.get(req.data.transaction.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._transaction_status'), transaction);

      res.status(StatusCodes.OK).send(response);
      
    } catch (error) {
      next(new InternalServerException(error));
    }
  }

}

