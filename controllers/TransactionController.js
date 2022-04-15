const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");
const EmailService = require("../emailService");
const Pagination = require("../utils/Pagination");
const ResponseDTO = require("../utils/ResponseDTO");
const StringGenerator = require("../utils/StringGenerator");
const Transaction = require("../models/Transaction");
const TransactionRepository = require("../repository/TransactionRepository");
const { AUTH_APP_ADMIN } = require("../security/JWT");
const { messageSender } = require("../websocket");

module.exports = class TransactionController {

  async verifyByWebhook(req, res, next) {
    
    try {

      if (req.body.event === 'charge.success') {
        
        const result = await TransactionRepository.updatePaymentVerifed(req.body.data.reference, StringGenerator.transactionReference);

        messageSender(result.senderId, result.message);

      }

      res.status(StatusCodes.OK).send({ reference: req.body.data.reference });

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }
  
  async createPayment(req, res, next) {
    
    try {

      const reference = await StringGenerator.transactionReference();

      const result = await TransactionRepository.createPayment(req.data.order, reference);

      const transaction = await TransactionRepository.get(result.id);

      const response =ResponseDTO.success(req.__('_created._transaction'), transaction);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async createWithdrawal(req, res, next) {
    
    try {

      const reference = await StringGenerator.transactionReference();

      const result = await TransactionRepository.createWithdrawal(req.body, reference, req.auth.userId);

      await messageSender(req.auth.userId, result.message);

      const transaction = await TransactionRepository.get(result.transaction.id);

      await EmailService.send(
        transaction.user.email,
        EmailService.TRANSACTION_CREATED, 
        { 
          type: transaction.type,
          id: transaction.id
        }
      );
      
      const response = ResponseDTO.success(req.__('_created._transaction'), transaction);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async createRefund(req, res, next) {
    
    try {

      const reference = await StringGenerator.transactionReference();

      const result = await TransactionRepository.createRefund(req.data.order, reference);

      await messageSender(req.auth.userId, result.message);

      const transaction = await TransactionRepository.get(result.transaction.id);

      await EmailService.send(
        transaction.user.email,
        EmailService.TRANSACTION_CREATED, 
        { 
          type: transaction.type,
          id: transaction.id
        }
      );

      const response = ResponseDTO.success(req.__('_created._transaction'), transaction);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async updateStatus(req, res, next) {
    
    try {

      let result, emailType;

      const tx = req.data.transaction;
      
      switch (req.body.status) {
        case Transaction.STATUS_CANCELLED:
          emailType = EmailService.TRANSACTION_CANCELLED;
          result = await TransactionRepository.updateStatusToCancelled(tx, req.body.status);
          break;
        case Transaction.STATUS_DECLINED:
          emailType = EmailService.TRANSACTION_DECLINED;
          result = await TransactionRepository.updateStatusToDeclined(tx, req.auth.userId, req.body.status);
          break;
        case Transaction.STATUS_PROCESSING:
          emailType = EmailService.TRANSACTION_PROCESSING;
          result = await TransactionRepository.updateStatusToProcessing(tx, req.auth.userId);
          break;
        case Transaction.STATUS_APPROVED:
          emailType = EmailService.TRANSACTION_APPROVED;
          result = await TransactionRepository.updateStatusToApproved(tx, req.auth.userId);
          break;
        case Transaction.STATUS_FAILED:
          emailType = EmailService.TRANSACTION_FAILED;
          result = await TransactionRepository.updateStatusToFailed(tx, req.auth.userId);
          break;
      }
      
      if (result !== undefined) 
        await messageSender(req.auth.userId, result.message);
      
      const transaction = await TransactionRepository.get(tx.id);

      await EmailService.send(transaction.user.email, emailType, { type: transaction.type, id: transaction.id });
      
      const response = ResponseDTO.success(req.__('_updated._transaction'), transaction);

      res.status(StatusCodes.OK).send(response);
      
    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  get(req, res) {
    
    const { transaction } = req.data;

    if (req.auth.authType !== AUTH_APP_ADMIN)
      transaction.user.setDataValue('withdrawal_account', undefined);

    const response = ResponseDTO.success(req.__('_fetched._transaction'), transaction);

    res.status(StatusCodes.OK).send(response);
  }

  async getList(req, res, next) {

    try {

      const { pager, transactionFilter } = req.data;

      const { count, rows } = await TransactionRepository.getList(pager.page_offset, pager.page_limit, transactionFilter);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._transaction'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getPendingOrderPayment(req, res, next) {
    
    try {

      const transaction = await TransactionRepository.getPendingOrderTransaction(req.data.order.id, Transaction.TYPE_PAYMENT);

      const response = ResponseDTO.success(req.__('_fetched._transaction'), transaction);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getPendingOrderRefund(req, res, next) {
    
    try {

      const transaction = await TransactionRepository.getPendingOrderTransaction(req.data.order.id, Transaction.TYPE_REFUND);

      const response = ResponseDTO.success(req.__('_fetched._transaction'), transaction);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListByCustomer(req, res, next) {
    
    try {

      const { pager, customer } = req.data;

      const { count, rows } = await TransactionRepository.getListByUser(customer.user_id, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response =ResponseDTO.success(req.__('_list_fetched._transaction'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListByStore(req, res, next) {
    
    try {

      const { pager, store } = req.data;

      const { count, rows } = await TransactionRepository.getListByUser(store.user_id, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response =ResponseDTO.success(req.__('_list_fetched._transaction'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }
  
  async getBalanceByStore(req, res, next) {
    
    try {

      const { store } = req.data;

      const balance = await TransactionRepository.getBalance(store.user_id);

      const response = ResponseDTO.success(req.__('_fetched._transaction'), { balance });

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }
  
  async getListByDeliveryFirm(req, res, next) {
    
    try {

      const { pager, deliveryFirm } = req.data;

      const { count, rows } = await TransactionRepository.getListByUser(deliveryFirm.user_id, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._transaction'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getBalanceByDeliveryFirm(req, res, next) {
    
    try {

      const { deliveryFirm } = req.data;

      const balance = await TransactionRepository.getBalance(deliveryFirm.user_id);

      const response = ResponseDTO.success(req.__('_fetched._transaction'), { balance });

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListByAdministrator(req, res, next) {
    
    try {

      const { pager } = req.data;

      const { count, rows } = await TransactionRepository.getListByUser(req.auth.userId, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._transaction'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getBalanceByAdministrator(req, res, next) {
    
    try {

      const balance = await TransactionRepository.getBalance(req.auth.userId);

      const response = ResponseDTO.success(req.__('_fetched._transaction'), { balance });

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
