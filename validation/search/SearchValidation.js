const { query } = require("express-validator");
const createHttpError = require("http-errors");

module.exports = async function(req, res, next) {

  try {

    if (!req.query.q && !req.query.sub_category) {
      await Promise.all([
        query('q').custom((value, { req })=> { throw req.__('_error._form._search_params_required'); }).run(req),
        query('sub_category').custom((value, { req })=> { throw req.__('_error._form._search_params_required'); }).run(req),
      ]);
    }
    
    next();

  } catch (error) {
    next(createHttpError.InternalServerError(error));
  }
}
