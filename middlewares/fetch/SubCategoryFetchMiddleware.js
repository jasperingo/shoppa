const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const SubCategoryRepository = require("../../repository/SubCategoryRepository");

module.exports = async (req, res, next)=> {
  try {
    const subCategory = await SubCategoryRepository.get(req.params.id);
    if (subCategory) {
      req.data = { subCategory };
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

