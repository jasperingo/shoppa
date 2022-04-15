const { StatusCodes } = require("http-status-codes");
const ResponseDTO = require("../utils/ResponseDTO");
const CategoryRepository = require("../repository/CategoryRepository");
const createHttpError = require("http-errors");

module.exports = class CategoryController {

  async add(req, res, next) {
    
    try {

      const _category = await CategoryRepository.add(req.body);

      const category = await CategoryRepository.get(_category.id);

      const response = ResponseDTO.success(req.__('_created._category'), category);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async update(req, res, next) {

    try {

      const _category = req.data.category;
      
      await CategoryRepository.update(_category, req.body);

      const category = await CategoryRepository.get(_category.id);
      
      const response = ResponseDTO.success(req.__('_updated._category'), category);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async updatePhoto(req, res, next) {

    try {

      const _category = req.data.category;

      await CategoryRepository.updatePhoto(_category, req.file.filename);

      const category = await CategoryRepository.get(_category.id);

      const response = ResponseDTO.success(req.__('_updated._photo'), category);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  get(req, res) {

    const response = ResponseDTO.success(req.__('_fetched._category'), req.data.category);

    res.status(StatusCodes.OK).send(response);
  }

  async getRandomList(req, res, next) {

    try {

      const { pager } = req.data;

      const categories = await CategoryRepository.getRandomList(pager.page_limit);

      const response = ResponseDTO.success(req.__('_list_fetched._category'), categories);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListByStore(req, res, next) {

    try {

      const categories = await CategoryRepository.getListStore();

      const response = ResponseDTO.success(req.__('_list_fetched._category'), categories);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListByProduct(req, res, next) {

    try {

      const categories = await CategoryRepository.getListByProduct();

      const response = ResponseDTO.success(req.__('_list_fetched._category'), categories);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getListByProductInStore(req, res, next) {

    try {

      const { store } = req.data;

      const categories = await CategoryRepository.getListByProductInStore(store);

      const response = ResponseDTO.success(req.__('_list_fetched._category'), categories);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
