const { body } = require("express-validator");

module.exports = {

  minimiumIsValid(req) {
    return req.body.minimium < req.body.maximium;
  },

  minimiumInvalid(req) {
    return body('minimium').custom((value, { req })=> { throw req.__('_error._form._minimium_is_gte'); }).run(req);
  },

  cityAndStateExists(req) {
    return Promise.all([
      body('state').custom((value, { req })=> { throw req.__('_error._form._route_exists'); }).run(req),
      body('city').custom((value, { req })=> { throw req.__('_error._form._route_exists'); }).run(req),
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

