const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const DiscountRepository = require("../../repository/DiscountRepository");

module.exports = async (req, res, next)=> {
  try {
    const discount = await DiscountRepository.get(req.params.id);
    if (discount) {
      req.data = { discount };
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

