const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const SavedCartRepository = require("../../repository/SavedCartRepository");

module.exports = async (req, res, next)=> {
  try {
    const savedCart = await SavedCartRepository.getByCode(req.params.id);
    if (savedCart) {
      req.data = { savedCart };
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

