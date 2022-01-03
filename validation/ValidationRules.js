
const InternalServerException = require("../http/exceptions/InternalServerException");
const Address = require("../models/Address");
const Category = require("../models/Category");
const RouteDuration = require("../models/RouteDuration");
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

  notEmpty: {
    bail: true,
    errorMessage: (value, { req })=> req.__('_error._form._field_required')
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
    options: {
      min: 0
    },
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


  routeWeightCheck(value, err, invalidMessage, miniMessage, weightIDs, invalidIDMessage) {
    for (let [i, weight] of value.entries()) {

      if (typeof weight === 'object' && weight !== null) {
        
        if (weight.price === undefined || isNaN(parseFloat(weight.price)) || weight.price < 0.00) 
          err.push({ name: 'price', message: invalidMessage, index: i });
        
        const max = weight.maximium === undefined || isNaN(parseFloat(weight.maximium));
        
        if (max) 
          err.push({ name: 'maximium', message: invalidMessage, index: i });
        
        const min = weight.minimium === undefined || isNaN(parseFloat(weight.minimium));
        
        if (min) 
          err.push({ name: 'minimium', message: invalidMessage, index: i });

        if (!max && !min && weight.minimium >= weight.maximium)
          err.push({ name: 'minimium', message: miniMessage, index: i });
        
        if (weightIDs !== null && weight.id !== undefined && !weightIDs.includes(weight.id)) 
          err.push({ name: 'id', message: invalidIDMessage, index: i });

      } else {
        err.push({ message: invalidMessage, index: i });
      }
    }
  },

  routeDurationCheck(value, err, invalidMessage, miniMessage, durationIDs, invalidIDMessage) {
    for (let [i, duration] of value.entries()) {

      if (typeof duration === 'object' && duration !== null) {

        if (duration.unit === undefined || !RouteDuration.getUnits().includes(duration.unit))
          err.push({ name: 'unit', message: invalidMessage, index: i });
        
        if (duration.fee === undefined || isNaN(parseFloat(duration.fee)) || duration.fee < 0.00) 
          err.push({ name: 'fee', message: invalidMessage, index: i });
      
        const max = duration.maximium === undefined || isNaN(parseFloat(duration.maximium));
        
        if (max) 
          err.push({ name: 'maximium', message: invalidMessage, index: i });
        
        const min = duration.minimium === undefined || isNaN(parseFloat(duration.minimium));
        
        if (min) 
          err.push({ name: 'minimium', message: invalidMessage, index: i });

        if (!max && !min && duration.minimium >= duration.maximium)
          err.push({ name: 'minimium', message: miniMessage, index: i });

        if (durationIDs !== null && duration.id !== undefined && !durationIDs.includes(duration.id))
          err.push({ name: 'id', message: invalidIDMessage, index: i });
      
      } else {
        err.push({ message: invalidMessage, index: i });
      }
    }
  },

  routeWeightAndDurationIsUnique(value, err, duplicateMessage, hasUnit) {
    
    const errIndex = [];

    for (let i = 0; i < value.length; i++) {
      for (let j = i; j < value.length-1; j++) {
        let v1 = value[i];
        let v2 = value[j+1];
        if (v1.minimium === v2.minimium && v1.maximium === v2.maximium && (hasUnit ? v1.unit === v2.unit : true)) {
          
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
  },

  productVarientCheck(value, err, invalidMessage, variantIDs, invalidIDMessage) {
    for (let [i, varient] of value.entries()) {

      if (typeof varient === 'object' && varient !== null) {

        if (varient.name === undefined || varient.name === '') 
          err.push({ name: 'name', message: invalidMessage, index: i });

        if (varient.price === undefined || isNaN(parseFloat(varient.price)) || varient.price < 0.00) 
          err.push({ name: 'price', message: invalidMessage, index: i });

        if (varient.quantity === undefined || isNaN(parseFloat(varient.quantity)) || varient.quantity < 0.00) 
          err.push({ name: 'quantity', message: invalidMessage, index: i });
        
        if (varient.weight === undefined || isNaN(parseFloat(varient.weight)) || varient.weight < 0.00) 
          err.push({ name: 'weight', message: invalidMessage, index: i });

        if (varient.available === undefined || ![true, false].includes(varient.available)) 
          err.push({ name: 'price', message: invalidMessage, index: i });

        if (variantIDs !== null && varient.id !== undefined && !variantIDs.includes(varient.id))
          err.push({ name: 'id', message: invalidIDMessage, index: i });

      } else {
        err.push({ message: invalidMessage, index: i });
      }
    }
  },

  productVariantIsUnique(value, err, duplicateMessage) {
    
    const errIndex = [];

    for (let i = 0; i < value.length; i++) {
      for (let j = i; j < value.length-1; j++) {
        let v1 = value[i];
        let v2 = value[j+1];
        if (v1.name === v2.name) {
          
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

