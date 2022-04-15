const createHttpError = require("http-errors");
const RouteRepository = require("../../repository/RouteRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  name: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await RouteRepository.existsByNameAndDeliveryFirmId(value, req.auth.deliveryFirmId))
            return Promise.reject(req.__('_error._form._name_exists'));
        } catch (err) {
          return Promise.reject(createHttpError.InternalServerError(err));
        }
      }
    },
  },

  door_delivery: {
    notEmpty: ValidationRules.notEmpty,
    isBoolean: ValidationRules.isBoolean
  }
  
};
