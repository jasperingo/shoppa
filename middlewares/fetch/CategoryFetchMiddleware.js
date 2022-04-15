const createHttpError = require("http-errors");
const CategoryRepository = require("../../repository/CategoryRepository");

module.exports = async function(req, res, next) {
  try {
    const category = await CategoryRepository.get(req.params.id);
    if (category) {
      req.data = { category };
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
