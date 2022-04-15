const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");
const Pagination = require("../utils/Pagination");
const ResponseDTO = require("../utils/ResponseDTO");
const StringGenerator = require("../utils/StringGenerator");
const SavedCartRepository = require("../repository/SavedCartRepository");

module.exports = class SavedCartController {

  async create(req, res, next) {

    try {

      const code = await StringGenerator.savedCartCode();

      const _savedCart = await SavedCartRepository.create(req.body, code, req.auth.userId);

      const savedCart = await SavedCartRepository.get(_savedCart.id);

      const response = ResponseDTO.success(req.__('_created._saved_cart'), savedCart);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async delete(req, res, next) {
    
    try {

      await SavedCartRepository.delete(req.data.savedCart);

      const response = ResponseDTO.success(req.__('_deleted._saved_cart'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  get(req, res) {

    const response = ResponseDTO.success(req.__('_fetched._saved_cart'), req.data.savedCart);

    res.status(StatusCodes.OK).send(response);
  }

  async getList(req, user, pager) {

    const { count, rows } = await SavedCartRepository.getListByUser(user, pager.page_offset, pager.page_limit);

    const pagination = new Pagination(req, pager.page, pager.page_limit, count);

    return ResponseDTO.success(req.__('_list_fetched._saved_cart'), rows, pagination);
  }

  getListByCustomer = async (req, res, next)=> {
    
    try {

      const { pager, customer: { user } } = req.data;

      const response = await this.getList(req, user, pager);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  getListByStore = async (req, res, next)=> {
    
    try {

      const { pager, store: { user } } = req.data;

      const response = await this.getList(req, user, pager);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
