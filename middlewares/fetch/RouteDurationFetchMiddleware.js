const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const RouteDurationRepository = require("../../repository/RouteDurationRepository");

module.exports = async (req, res, next)=> {
  try {
    const routeDuration = await RouteDurationRepository.get(req.params.id);
    if (routeDuration) {
      req.data = { routeDuration };
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

