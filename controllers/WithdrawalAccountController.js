const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const StoreRepository = require("../repository/StoreRepository");
const WithdrawalAccountRepository = require("../repository/WithdrawalAccountRepository");


module.exports = class WithdrawalAccountController {

  async updateStoreWithdrawalAccount(req, res, next) {
    
    try {

      const { store: { user } } = req.data;

      await WithdrawalAccountRepository.addOrUpdate(user, req.body);
      
      const store = await StoreRepository.getWithWithdrawalAccount(req.data.store.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._withdrawal_account'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
    
  }

};

