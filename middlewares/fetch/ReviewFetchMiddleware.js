const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const ReviewRepository = require("../../repository/ReviewRepository");

module.exports = async (req, res, next)=> {
  try {
    const review = await ReviewRepository.get(req.params.id);
    if (review) {
      req.data = { review };
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

