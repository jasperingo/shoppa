const createHttpError = require("http-errors");
const AdministratorRepository = require("../../repository/AdministratorRepository");

module.exports = async function(req, res, next) {
  try {
    const administrator = await AdministratorRepository.get(req.params.id);
    if (administrator) {
      req.data = { administrator };
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
