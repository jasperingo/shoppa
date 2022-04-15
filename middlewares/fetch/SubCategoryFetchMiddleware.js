const createHttpError = require("http-errors");
const SubCategoryRepository = require("../../repository/SubCategoryRepository");

module.exports = async function(req, res, next) {
  try {
    const subCategory = await SubCategoryRepository.get(req.params.id);
    if (subCategory) {
      req.data = { subCategory };
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
