const createHttpError = require("http-errors");
const SavedCartRepository = require("../../repository/SavedCartRepository");

module.exports = async function(req, res, next) {
  try {
    const savedCart = await SavedCartRepository.get(req.params.id);
    if (savedCart) {
      req.data = { savedCart };
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
