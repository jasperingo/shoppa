const createHttpError = require("http-errors");
const RouteLocationRepository = require("../../repository/RouteLocationRepository");

module.exports = async function(req, res, next) {
  try {
    const routeLocation = await RouteLocationRepository.get(req.params.id);
    if (routeLocation) {
      req.data = { routeLocation };
      next();
    } else {
      next(createHttpError.NotFound({
        data: {
          path: `${req.baseUrl}/${req.params.id}`,
          param: Number(req.params.id)
        }
      }));
    }
  } catch(error) {
    next(createHttpError.InternalServerError(error));
  }
}
