const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const DeliveryFirmRepository = require("../repository/DeliveryFirmRepository");
const StoreRepository = require("../repository/StoreRepository");
const WorkingHourRepository = require("../repository/WorkingHourRepository");

module.exports = class WorkingHour {

  async updateStoreWorkingHours(req, res, next) {

    try {

      const { store: { user } } = req.data;

      await WorkingHourRepository.addOrUpdate(user, req.body.working_hours);
      
      const store = await StoreRepository.get(req.data.store.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._working_hours'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updateDeliveryFirmWorkingHours(req, res, next) {

    try {

      const { deliveryFirm: { user } } = req.data;

      await WorkingHourRepository.addOrUpdate(user, req.body.working_hours);
      
      const deliveryFirm = await DeliveryFirmRepository.get(req.data.deliveryFirm.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._working_hours'), deliveryFirm);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

}

