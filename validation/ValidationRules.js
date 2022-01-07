
const InternalServerException = require("../http/exceptions/InternalServerException");
const Address = require("../models/Address");
const Category = require("../models/Category");
const CustomerRepository = require("../repository/CustomerRepository");
const LocationRepository = require('../repository/LocationRepository');
const Hash = require("../security/Hash");

module.exports = {

  errorFormat: err=> ({
    name: err.param,
    value: err.value,
    message: err.msg,
    errors: err.nestedErrors
  }),
  
  validationHasServerError(errors) {
    
    const errs = errors.array();
    //TODO
    // for (let i of errs) {
    // TODO: check if message is an array
    //   if (i.message === InternalServerException.TAG) 
    //     return true;
    // }

    return false;
  },

  isPasswordLength: {
    options: { 
      max : 20,
      min: 6
    },
    bail: true,
    errorMessage: (value, { req })=> req.__('_error._form._password_length', { min: 6, max: 20 })
  },

  isPhoneNumberLength: {
    options: { 
      max : 11,
      min: 11
    },
    bail: true,
    errorMessage: (value, { req })=> req.__('_error._form._phone_number_invalid')
  },
  
  isOptional: { options: { nullable: true } },

  notEmpty: {
    bail: true,
    errorMessage: (value, { req })=> req.__('_error._form._field_required')
  },

  isBoolean: {
    bail: true,
    errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
  },

  isInt: {
    bail: true,
    errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
  },

  isEmail: {
    bail: true,
    errorMessage: (value, { req })=> req.__('_error._form._email_invalid')
  },

  isArray: {
    bail: true,
    options: { min: 1 },
    errorMessage: (value, { req })=> req.__('_error._form._field_required')
  },

  addressTypeIsIn: {
    options: [[Address.TYPE_DEFAULT, Address.TYPE_SUB, Address.TYPE_PICK_UP]],
    errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
  },

  categoryTypeIsIn: {
    options: [[Category.TYPE_STORE, Category.TYPE_PRODUCT]],
    errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
  },

  isFloatWithZeroMin: {
    options: { min: 0 },
    bail: true,
    errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
  },
  
  isFloatGTEZero: {
    options: { min: 0 },
    bail: true,
    errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
  },

  isFloatGTZero: {
    options: { gt: 0 },
    bail: true,
    errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
  },

  isValidArray: {
    isArray: {
      bail: true,
      errorMessage: (value, { req })=> req.__('_error._form._field_required')
    },
    custom: {
      options: (value, { req })=> {
        if (value.length === 0)
          throw req.__('_error._form._field_invalid');
        else 
          return true;
      }
    }
  },

  getStateValid() {
    return {
      notEmpty: this.notEmpty,
      custom: {
        options: (value, { req })=> {
          if (!LocationRepository.getStates().includes(value)) {
            throw req.__('_error._form._field_invalid');
          } else {
            return true;
          }
        }
      }
    };
  },

  getCityValid(state = 'state') {
    return {
      notEmpty: this.notEmpty,
      custom: {
        options: (value, { req })=> {
          if (!LocationRepository.getCities(req.body[state]).includes(value)) {
            throw req.__('_error._form._field_invalid');
          } else {
            return true;
          }
        }
      }
    };
  },

  getOptionalCityValid(state = 'state') {
    return {
      optional: { options: { nullable: true } },
      custom: {
        options: (value, { req })=> {
          if (!LocationRepository.getCities(req.body[state]).includes(value)) {
            throw req.__('_error._form._field_invalid');
          } else {
            return true;
          }
        }
      }
    };
  },

  getAuthPasswordValid(user) {
    return {
      isLength: this.isPasswordLength, 
      custom: {
        options: async (value, { req })=> {
          try {
            if (!req.data || !req.data[user] || ! (await Hash.comparePassword(value, req.data[user].password)) )
              return Promise.reject(req.__('_error._form._password_invalid'));
          } catch (err) {
            return Promise.reject(InternalServerException.TAG);
          }
        }
      }
    };
  },
  
  getCustomerEmailValid() {
    return {
      notEmpty: this.notEmpty,
      isEmail: this.isEmail,
      custom: {
        options: async (value, { req })=> {
          try {
            const customer = await CustomerRepository.getByEmail(value)
            if (customer === null)
              return Promise.reject(req.__('_error._form._email_invalid'));
            else 
              req.data = { customer };
          } catch (err) {
            return Promise.reject(InternalServerException.TAG);
          }
        }
      }
    }
  },

  getPasswordConfirmation(pwd = 'password') {
    return {
      isLength: this.isPasswordLength,
      custom: {
        options: (value, { req })=> value === req.body[pwd],
        errorMessage: (value, { req })=> req.__('_error._form._password_confirmation_not_match')
      }
    }
  },
  
  orderItemProductVariantDuplicate(value, err, duplicateMessage) {

    const errIndex = [];

    for (let i = 0; i < value.length; i++) {
      for (let j = i; j < value.length-1; j++) {
        let v1 = value[i];
        let v2 = value[j+1];
        if (v1.product_variant_id === v2.product_variant_id) {
          
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
  }

};

