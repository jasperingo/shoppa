const createHttpError = require("http-errors");
const RouteWeightRepository = require("../../repository/RouteWeightRepository");

module.exports = async function(req, res, next) {
  try {
    const routeWeight = await RouteWeightRepository.get(req.params.id);
    if (routeWeight) {
      req.data = { routeWeight };
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
