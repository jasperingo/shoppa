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
          return Promise.reject(err);
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
    isFloat: ValidationRules.isFloatGTZero,
    custom: {
      options: (value, { req })=> {
        if (req.body.type === Discount.TYPE_PERCENTAGE && value > 99.99) {
          throw req.__('_error._form._field_invalid');
        } 

        return true;
      }
    }
  },

  minimium_required_amount: {
    optional: { options: { nullable: true } },
    isFloat: ValidationRules.isFloatGTZero
  },
  
  minimium_required_quantity: {
    optional: { options: { nullable: true } },
    isFloat: ValidationRules.isFloatGTZero
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
};
