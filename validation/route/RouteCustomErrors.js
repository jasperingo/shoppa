const { body } = require("express-validator");

module.exports = {

  cityInvalid(req) {
    const city1 = req.body.location_1_city !== undefined && req.body.location_1_city !== null;
    const city2 = req.body.location_2_city !== undefined && req.body.location_2_city !== null;
    return city1 && !city2 || city2 && !city1;
  },

  city(req) {
    return Promise.all([
      body('location_1_city').custom((value, { req })=> { throw req.__('_error._form._field_pair', { pair: 'location_2_city' }); }).run(req),
      body('location_2_city').custom((value, { req })=> { throw req.__('_error._form._field_pair',  { pair: 'location_1_city' }); }).run(req)
    ]);
  },

  cityAndState(req) {
    return Promise.all([
      body('location_1_state').custom((value, { req })=> { throw req.__('_error._form._route_exists'); }).run(req),
      body('location_2_state').custom((value, { req })=> { throw req.__('_error._form._route_exists'); }).run(req),
      body('location_1_city').custom((value, { req })=> { throw req.__('_error._form._route_exists'); }).run(req),
      body('location_2_city').custom((value, { req })=> { throw req.__('_error._form._route_exists'); }).run(req)
    ]);
  }


};

