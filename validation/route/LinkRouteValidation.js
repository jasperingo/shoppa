
const InternalServerException = require("../../http/exceptions/InternalServerException");
const RouteRepository = require("../../repository/RouteRepository");
const ValidationRules = require("../ValidationRules");

module.exports = {

  origin_route_id: {
    notEmpty: ValidationRules.notEmpty,
    isInt: ValidationRules.isInt,
    custom: {
      options: async (value, { req })=> {
        try {
          if (! (await RouteRepository.idExistsForDeliveryFirm(value, req.auth.deliveryFirmId)))
            return Promise.reject(req.__('_error._form._id_invalid'));

          if (await RouteRepository.idExistsForLink(value)) 
            return Promise.reject(req.__('_error._form._id_invalid'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  destination_route_id: {
    notEmpty: ValidationRules.notEmpty,
    isInt: ValidationRules.isInt,
    custom: {
      options: async (value, { req })=> {
        try {
          if (! (await RouteRepository.idExistsForDeliveryFirm(value, req.auth.deliveryFirmId)))
            return Promise.reject(req.__('_error._form._id_invalid'));
            
          if (await RouteRepository.idExistsForLink(value)) 
            return Promise.reject(req.__('_error._form._id_invalid'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },
  
};

