const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const StoreRepository = require("../../repository/StoreRepository");

module.exports = async (req, res, next)=> {
  try {
    const store = await StoreRepository.get(req.params.id);
    if (store) {
      req.data = { store };
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

