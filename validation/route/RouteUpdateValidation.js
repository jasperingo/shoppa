
const ValidationRules = require("../ValidationRules");

module.exports = {

  location_1_state: ValidationRules.getStateValid(),

  location_2_state: ValidationRules.getStateValid(),

  location_1_city: ValidationRules.getOptionalCityValid('location_1_state'),

  location_2_city: ValidationRules.getOptionalCityValid('location_2_state'),

  route_weights: {
    isArray: ValidationRules.isArray,
    custom: {
      options: (value, { req })=> {

        const err = [];

        ValidationRules.routeWeightCheck(
          value, 
          err,
          req.__('_error._form._field_invalid'), 
          req.__('_error._form._minimium_is_gte'), 
          req.data.route.route_weights.map(i=> i.id),
          req.__('_error._form._id_invalid')
        );

        if (err.length > 0) throw err;

        ValidationRules.routeWeightAndDurationIsUnique(value, err, req.__('_error._form._field_duplicated'), false);

        if (err.length > 0) throw err;

        return true;
      }
    }
  },

  route_durations: {
    isArray: ValidationRules.isArray,
    custom: {
      options: (value, { req })=> {

        const err = [];

        ValidationRules.routeDurationCheck(
          value,
          err,
          req.__('_error._form._field_invalid'),
          req.__('_error._form._minimium_is_gte'),
          req.data.route.route_durations.map(i=> i.id),
          req.__('_error._form._id_invalid')
        );

        if (err.length > 0) throw err;

        ValidationRules.routeWeightAndDurationIsUnique(value, err, req.__('_error._form._field_duplicated'), true);

        if (err.length > 0) throw err;

        return true;
      }
    }
  }

};


