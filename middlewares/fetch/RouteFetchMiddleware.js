const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const RouteRepository = require("../../repository/RouteRepository");

module.exports = async (req, res, next)=> {
  try {
    const route = await RouteRepository.get(req.params.id);
    if (route) {
      req.data = { route };
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

