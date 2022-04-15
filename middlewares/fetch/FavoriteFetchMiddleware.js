const createHttpError = require("http-errors");
const FavoriteRepository = require("../../repository/FavoriteRepository");

module.exports = async function(req, res, next) {
  try {
    const favorite = await FavoriteRepository.get(req.params.id);
    if (favorite) {
      req.data = { favorite };
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
