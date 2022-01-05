const { body } = require("express-validator");

module.exports = {

  minimiumIsValid(req) {
    return req.body.minimium < req.body.maximium;
  },

  minimiumInvalid(req) {
    return body('minimium').custom((value, { req })=> { throw req.__('_error._form._minimium_is_gte'); }).run(req);
  },

  cityIsValid(req) {
    const city1 = req.body.location_1_city !== undefined && req.body.location_1_city !== null;
    const city2 = req.body.location_2_city !== undefined && req.body.location_2_city !== null;
    return city1 && city2 || !city2 && !city1;
  },

  cityInvalid(req) {
    return Promise.all([
      body('location_1_city').custom((value, { req })=> { throw req.__('_error._form._field_pair', { pair: 'location_2_city' }); }).run(req),
      body('location_2_city').custom((value, { req })=> { throw req.__('_error._form._field_pair',  { pair: 'location_1_city' }); }).run(req)
    ]);
  },

  cityAndStateExists(req) {
    return Promise.all([
      body('location_1_state').custom((value, { req })=> { throw req.__('_error._form._route_exists'); }).run(req),
      body('location_2_state').custom((value, { req })=> { throw req.__('_error._form._route_exists'); }).run(req),
      body('location_1_city').custom((value, { req })=> { throw req.__('_error._form._route_exists'); }).run(req),
      body('location_2_city').custom((value, { req })=> { throw req.__('_error._form._route_exists'); }).run(req)
    ]);
  },

  weightExists(req) {
    return Promise.all([
      body('minimium').custom((value, { req })=> { throw req.__('_error._form._route_weight_exists'); }).run(req),
      body('maximium').custom((value, { req })=> { throw req.__('_error._form._route_weight_exists'); }).run(req)
    ]);
  },

  durationExists(req) {
    return Promise.all([
      body('minimium').custom((value, { req })=> { throw req.__('_error._form._route_duration_exists'); }).run(req),
      body('maximium').custom((value, { req })=> { throw req.__('_error._form._route_duration_exists'); }).run(req),
      body('unit').custom((value, { req })=> { throw req.__('_error._form._route_duration_exists'); }).run(req)
    ]);
  },
  
};

