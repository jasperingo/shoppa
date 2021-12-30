const InternalServerException = require("../../http/exceptions/InternalServerException");
const ValidationRules = require("../ValidationRules");


module.exports = {

  location_1_state: ValidationRules.getStateValid(),

  location_2_state: ValidationRules.getStateValid(),

  location_1_city: ValidationRules.getCityValid('location_1_state'),

  location_2_city: ValidationRules.getCityValid('location_2_state'),

  route_weights: ValidationRules.isValidArray,

  route_durations: ValidationRules.isValidArray,


  'route_weights.*.minimium': {
    notEmpty: ValidationRules.notEmpty,
  },

  'route_weights.*.maximium': {
    notEmpty: ValidationRules.notEmpty,
  },

  'route_weights.*.price': {
    notEmpty: ValidationRules.notEmpty,
  },


  'route_durations.*.name': {
    notEmpty: ValidationRules.notEmpty,
  },

  'route_durations.*.minimium': {
    notEmpty: ValidationRules.notEmpty,
  },

  'route_durations.*.maximium': {
    notEmpty: ValidationRules.notEmpty,
  },

  'route_durations.*.fee': {
    notEmpty: ValidationRules.notEmpty,
  },

  'route_durations.*.unit': {
    notEmpty: ValidationRules.notEmpty,
  },
  
};

