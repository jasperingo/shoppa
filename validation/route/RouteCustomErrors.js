const { body } = require("express-validator");

module.exports = {

  minimiumIsValid(req) {
    return req.body.minimium < req.body.maximium;
  },

  minimiumInvalid(req) {
    return body('minimium').custom((value, { req })=> { throw req.__('_error._form._minimium_is_gte'); }).run(req);
  },
  
  cityAndStateInvalid(req, txt = '_route_exists') {
    return Promise.all([
      body('state').custom((value, { req })=> { throw req.__(`_error._form.${txt}`); }).run(req),
      body('city').custom((value, { req })=> { throw req.__(`_error._form.${txt}`); }).run(req),
    ]);
  },
  
  linkInvalid(req, txt = '_route_exists') {
    return Promise.all([
      body('origin_route_id').custom((value, { req })=> { throw req.__(`_error._form.${txt}`); }).run(req),
      body('destination_route_id').custom((value, { req })=> { throw req.__(`_error._form.${txt}`); }).run(req)
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

