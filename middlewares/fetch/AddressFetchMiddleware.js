const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const AddressRepository = require("../../repository/AddressRepository");

module.exports = async (req, res, next)=> {
  try {
    const address = await AddressRepository.get(req.params.id);
    if (address) {
      req.data = { address };
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

