const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const RouteWeightRepository = require("../../repository/RouteWeightRepository");

module.exports = async (req, res, next)=> {
  try {
    const routeWeight = await RouteWeightRepository.get(req.params.id);
    if (routeWeight) {
      req.data = { routeWeight };
      next();
    } else {
      next(new NotFoundException({
        path: `${req.baseUrl}/${req.params.id}`,
        param: parseInt(req.params.id)
      }));
    }
  } catch(error) {
    next(new InternalServerException(error));
  }
}

