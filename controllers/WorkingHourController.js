const { StatusCodes } = require("http-status-codes");
const ResponseDTO = require("../utils/ResponseDTO");
const DeliveryFirmRepository = require("../repository/DeliveryFirmRepository");
const StoreRepository = require("../repository/StoreRepository");
const WorkingHourRepository = require("../repository/WorkingHourRepository");
const createHttpError = require("http-errors");

module.exports = class WorkingHour {

  async updateStoreWorkingHours(req, res, next) {

    try {

      const { store: { user } } = req.data;

      await WorkingHourRepository.addOrUpdate(user, req.body.working_hours);
      
      const store = await StoreRepository.get(req.data.store.id);

      const response = ResponseDTO.success(req.__('_updated._working_hours'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async updateDeliveryFirmWorkingHours(req, res, next) {

    try {

      const { deliveryFirm: { user } } = req.data;

      await WorkingHourRepository.addOrUpdate(user, req.body.working_hours);
      
      const deliveryFirm = await DeliveryFirmRepository.get(req.data.deliveryFirm.id);

      const response = ResponseDTO.success(req.__('_updated._working_hours'), deliveryFirm);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
