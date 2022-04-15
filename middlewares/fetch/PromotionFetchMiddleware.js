const createHttpError = require("http-errors");
const PromotionRepository = require("../../repository/PromotionRepository");

module.exports = async function(req, res, next) {
  try {
    const promotion = await PromotionRepository.get(req.params.id);
    if (promotion) {
      req.data = { promotion };
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
