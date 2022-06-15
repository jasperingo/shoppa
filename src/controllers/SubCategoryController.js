const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");
const ResponseDTO = require("../utils/ResponseDTO");
const SubCategoryRepository = require("../repository/SubCategoryRepository");

module.exports = class SubCategoryController {

  async add(req, res, next) {

    try {

      const _subCategory = await SubCategoryRepository.add(req.body);

      const subCategory = await SubCategoryRepository.get(_subCategory.id);

      const response = ResponseDTO.success(req.__('_created._sub_category'), subCategory);

      res.status(StatusCodes.CREATED).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async update(req, res, next) {

    try {

      const _subCategory = req.data.subCategory;
      
      await SubCategoryRepository.update(_subCategory, req.body);

      const subCategory = await SubCategoryRepository.get(_subCategory.id);
      
      const response = ResponseDTO.success(req.__('_updated._sub_category'), subCategory);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async updatePhoto(req, res, next) {

    try {

      const _subCategory = req.data.subCategory;

      await SubCategoryRepository.updatePhoto(_subCategory, req.file.filename);

      const subCategory = await SubCategoryRepository.get(_subCategory.id);

      const response = ResponseDTO.success(req.__('_updated._photo'), subCategory);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }
  
  get(req, res) {

    const response = ResponseDTO.success(req.__('_fetched._sub_category'), req.data.subCategory);

    res.status(StatusCodes.OK).send(response);
  }

}

