const InternalServerException = require("../../http/exceptions/InternalServerException");
const NotFoundException = require("../../http/exceptions/NotFoundException");
const FavoriteRepository = require("../../repository/FavoriteRepository");

module.exports = async (req, res, next)=> {
  try {
    const favorite = await FavoriteRepository.get(req.params.id);
    if (favorite) {
      req.data = { favorite };
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

