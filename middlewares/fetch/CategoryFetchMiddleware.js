const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const CategoryRepository = require("../../repository/CategoryRepository");

module.exports = async (req, res, next)=> {
  try {
    const category = await CategoryRepository.get(req.params.id);
    if (category) {
      req.data = { category };
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

