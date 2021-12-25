const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const AdministratorRepository = require("../../repository/AdministratorRepository");

module.exports = async (req, res, next)=> {
  try {
    const administrator = await AdministratorRepository.get(req.params.id);
    if (administrator) {
      req.data = { administrator };
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

