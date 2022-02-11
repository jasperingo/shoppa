const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Pagination = require("../http/Pagination");
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

        await TransactionRepository.updateTransferVerifed(req.body.data.reference);

      } else if (req.body.event === 'transfer.failed') {

        await TransactionRepository.updateTransferFailed(req.body.data.reference);

      }

      //send message...
      
      res.status(StatusCodes.OK).send({ reference: req.body.data.reference });

    } catch(error) {
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
    
    try {
      
      switch (req.body.status) {
        case Transaction.STATUS_CANCELLED:
          await TransactionRepository.updateStatusToCancelled(req.data.transaction, req.body.status);
          break;
        case Transaction.STATUS_DECLINED:
          await TransactionRepository.updateStatusToDeclined(req.data.transaction, req.body.status);
          break;
        case Transaction.STATUS_PROCESSING:
          await TransactionRepository.updateStatusToProcessing(req.data.transaction); //send to paystack
          break;
      }
      
      const transaction = await TransactionRepository.get(req.data.transaction.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._transaction'), transaction);

      res.status(StatusCodes.OK).send(response);
      
    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._transaction'), req.data.transaction);

    res.status(StatusCodes.OK).send(response);
  }

  async getList(req, res, next) {

    try {

      const { pager, transactionFilter } = req.data;

      const { count, rows } = await TransactionRepository.getList(pager.page_offset, pager.page_limit, transactionFilter);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._transaction'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  getListByCustomer = async (req, res, next)=> {
    
    try {

      const { pager, customer } = req.data;

      const { count, rows } = await TransactionRepository.getListByUser(customer.user_id, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._transaction'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  getListByStore = async (req, res, next)=> {
    
    try {

      const { pager, store } = req.data;

      const { count, rows } = await TransactionRepository.getListByUser(store.user_id, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._transaction'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }
  
  getBalanceByStore = async (req, res, next)=> {
    
    try {

      const { store } = req.data;

      const balance = await TransactionRepository.getBalance(store.user_id);

      const response = new Response(Response.SUCCESS, req.__('_fetched._transaction'), { balance });

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }
  
  getListByDeliveryFirm = async (req, res, next)=> {
    
    try {

      const { pager, deliveryFirm } = req.data;

      const { count, rows } = await TransactionRepository.getListByUser(deliveryFirm.user_id, pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._transaction'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  getBalanceByDeliveryFirm = async (req, res, next)=> {
    
    try {

      const { deliveryFirm } = req.data;

      const balance = await TransactionRepository.getBalance(deliveryFirm.user_id);

      const response = new Response(Response.SUCCESS, req.__('_fetched._transaction'), { balance });

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  getListByAdministrator = async (req, res, next)=> {
    
    try {

      const { pager } = req.data;

      const { count, rows } = await TransactionRepository.getListByAdministrator(pager.page_offset, pager.page_limit);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._transaction'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  getBalanceByAdministrator = async (req, res, next)=> {
    
    try {

      const balance = await TransactionRepository.getBalanceByAdministrator();

      const response = new Response(Response.SUCCESS, req.__('_fetched._transaction'), { balance });

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}

