const createHttpError = require("http-errors");
const RouteRepository = require("../../repository/RouteRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  delivery_route_id: {
    notEmpty: ValidationRules.notEmpty,
    isInt: ValidationRules.isInt,
    custom: {
      options: async (value, { req })=> {
        try {
          if (!await RouteRepository.existsByIdAndDeliveryFirmId(value, req.auth.deliveryFirmId))
            return Promise.reject(req.__('_error._form._id_invalid'));
        } catch (err) {
          return Promise.reject(createHttpError.InternalServerError(err));
        }
      }
    }
  },

  fee: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTZero
  },

  minimium: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTZero
  },

  maximium: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: ValidationRules.isFloatGTZero
  }

};
