const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const CustomerRepository = require("../repository/CustomerRepository");
const DeliveryFirmRepository = require("../repository/DeliveryFirmRepository");
const StoreRepository = require("../repository/StoreRepository");
const WithdrawalAccountRepository = require("../repository/WithdrawalAccountRepository");


module.exports = class WithdrawalAccountController {

  async updateCustomerWithdrawalAccount(req, res, next) {
    
    try {

      const { customer: { user } } = req.data;

      await WithdrawalAccountRepository.addOrUpdate(user, req.body);
      
      const customer = await CustomerRepository.get(req.data.customer.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._withdrawal_account'), customer);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      console.log(error)
      next(new InternalServerException(error));
    }
  }

  async updateStoreWithdrawalAccount(req, res, next) {
    
    try {

      const { store: { user } } = req.data;

      await WithdrawalAccountRepository.addOrUpdate(user, req.body);
      
      const store = await StoreRepository.get(req.data.store.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._withdrawal_account'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updateDeliveryFirmWithdrawalAccount(req, res, next) {
    
    try {

      const { deliveryFirm: { user } } = req.data;

      await WithdrawalAccountRepository.addOrUpdate(user, req.body);
      
      const deliveryFirm = await DeliveryFirmRepository.get(req.data.deliveryFirm.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._withdrawal_account'), deliveryFirm);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

};

