const createHttpError = require("http-errors");
const ReviewRepository = require("../../repository/ReviewRepository");

module.exports = async function(req, res, next) {
  try {
    const review = await ReviewRepository.get(req.params.id);
    if (review) {
      req.data = { review };
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
