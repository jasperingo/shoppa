const InternalServerException = require("../../http/exceptions/InternalServerException");
const FavoriteRepository = require("../../repository/FavoriteRepository");
const ProductRepository = require("../../repository/ProductRepository");
const ValidationRules = require("../ValidationRules");


module.exports = {

  product_id: {
    notEmpty: ValidationRules.notEmpty,
    isInt: ValidationRules.isInt,
    custom: {
      options: async (value, { req })=> {
        try {
          if (! (await ProductRepository.idExists(value)))
            return Promise.reject(req.__('_error._form._id_invalid'));

          if (await FavoriteRepository.exists(value, req.body.customer_id))
            return Promise.reject(req.__('_error._form._favorite_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

};

