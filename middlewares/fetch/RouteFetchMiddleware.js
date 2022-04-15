const createHttpError = require("http-errors");
const RouteRepository = require("../../repository/RouteRepository");

module.exports = async function(req, res, next) {
  try {
    const route = await RouteRepository.get(req.params.id);
    if (route) {
      req.data = { route };
      next();
    } else {
      next(createHttpError.NotFound({
        data: {
          path: `${req.baseUrl}/${req.params.id}`,
          param: parseInt(req.params.id)
        }
      }));
    }
  } catch(error) {
    next(createHttpError.InternalServerError(error));
  }
}
