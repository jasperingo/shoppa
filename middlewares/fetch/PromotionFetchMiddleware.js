const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const PromotionRepository = require("../../repository/PromotionRepository");

module.exports = async (req, res, next)=> {
  try {
    const promotion = await PromotionRepository.get(req.params.id);
    if (promotion) {
      req.data = { promotion };
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
