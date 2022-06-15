const createHttpError = require("http-errors");
const AddressRepository = require("../../repository/AddressRepository");

module.exports = async function(req, res, next) {
  try {
    const address = await AddressRepository.get(req.params.id);
    if (address) {
      req.data = { address };
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
