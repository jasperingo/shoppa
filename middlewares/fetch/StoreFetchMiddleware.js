const createHttpError = require("http-errors");
const StoreRepository = require("../../repository/StoreRepository");

module.exports = async function(req, res, next) {
  try {
    const store = await StoreRepository.get(req.params.id);
    if (store) {
      req.data = { store };
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
