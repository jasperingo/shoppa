const InternalServerException = require("../../http/exceptions/InternalServerException");
const Discount = require("../../models/Discount");
const DiscountRepository = require("../../repository/DiscountRepository");
const ProductRepository = require("../../repository/ProductRepository");
const ValidationRules = require("../ValidationRules");


module.exports = {

  title: {
    notEmpty: ValidationRules.notEmpty,
    custom: {
      options: async (value, { req })=> {
        try {
          if (await DiscountRepository.titleExists(value, req.body.store_id))
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

        if (isNaN(date.getTime()) || (date.getTime() < Date.now())) 
          throw req.__('_error._form._field_invalid');

        req.data = { startDate: true };

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

        req.data = { startDate: true };

        return true;
      }
    }
  },

  discount_products: {
    isArray: ValidationRules.isArray,
    custom: {
      options: async (value, { req })=> {

        const err = [];

        const invalidMessage = req.__('_error._form._field_invalid');

        for (let [i, product] of value.entries()) {

          if (typeof product === 'object' && product !== null) {

            if (isNaN(parseInt(product.product_id)) || 
              ! (await ProductRepository.idExistsForStore(product.product_id, req.body.store_id)) ||
              (await DiscountRepository.productOnDiscount(product.product_id))) {
              err.push({ name: 'poduct_id', message: invalidMessage, index: i });
            }

          } else {
            err.push({ message: invalidMessage, index: i });
          }
        }

        if (err.length > 0) throw err;

        const errIndex = [];

        const duplicateMessage = req.__('_error._form._field_duplicated');

        for (let i = 0; i < value.length; i++) {
          for (let j = i; j < value.length-1; j++) {
            let v1 = value[i];
            let v2 = value[j+1];
            if (v1.product_id === v2.product_id) {
              
              if (!errIndex.includes(i)) {
                errIndex.push(i);
                err.push({ message: duplicateMessage, index: i });
              }
      
              if (!errIndex.includes(j+1)) {
                errIndex.push(j+1);
                err.push({ message: duplicateMessage, index: j+1 });
              }
            }
          }
        }

        if (err.length > 0) throw err;

        return true;
      }
    }
  }

};

