const InternalServerException = require("../../http/exceptions/InternalServerException");
const Discount = require("../../models/Discount");
const DiscountRepository = require("../../repository/DiscountRepository");
const ValidationRules = require("../ValidationRules");


module.exports = {

  title: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await DiscountRepository.updateTitleExists(value, req.data.discount))
            return Promise.reject(req.__('_error._form._title_exists'));
        } catch (err) {
          return Promise.reject(InternalServerException.TAG);
        }
      }
    }
  },

  type: {
    notEmpty: ValidationRules.notEmpty,
    isIn: {
      options: [Discount.getTypes()],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  },

  value: {
    notEmpty: ValidationRules.notEmpty,
    isFloat: {
      options: { gt: 0 },
      bail: true,
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  },

  minimium_required_amount: {
    optional: { options: { nullable: true } },
    isFloat: {
      options: { gt: 0 },
      bail: true,
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  },
  
  minimium_required_quantity: {
    optional: { options: { nullable: true } },
    isFloat: {
      options: { gt: 0 },
      bail: true,
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  },

  start_date: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: (value, { req })=> {

        const date = new Date(value);

        if (isNaN(date.getTime()) || (date.getTime() < new Date(req.data.discount.created_at).getTime())) 
          throw req.__('_error._form._field_invalid');

        req.data.startDate = true;

        return true;
      }
    }
  },

  end_date: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: (value, { req })=> {

        const date = new Date(value);

        if (isNaN(date.getTime()) || 
          req.data === undefined || 
          req.data.startDate !== true || 
          (date.getTime() <= (new Date(req.body.start_date)).getTime()))
          throw req.__('_error._form._field_invalid');

        return true;
      }
    }
  },

  discount_products: {
    isArray: ValidationRules.isArray,
    custom: {
      options: async (value, { req })=> {

        const err = [];

        ValidationRules.discountProductsCheck(
          value,
          err,
          req.data.discount.store_id,
          req.__('_error._form._field_invalid'),
          true,
          req.__('_error._form._id_invalid')
        );
        
        if (err.length > 0) throw err;

        ValidationRules.discountProductsAreUnique(
          value,
          err,
          req.__('_error._form._field_duplicated')
        );
        
        if (err.length > 0) throw err;

        return true;
      }
    }
  }

};
