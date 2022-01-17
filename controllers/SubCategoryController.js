const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const SubCategoryRepository = require("../repository/SubCategoryRepository");
const Response = require("../http/Response");

module.exports = class SubCategoryController {

  async add(req, res, next) {

    try {

      const _subCategory = await SubCategoryRepository.add(req.body);

      const subCategory = await SubCategoryRepository.get(_subCategory.id);

      const response = new Response(Response.SUCCESS, req.__('_created._sub_category'), subCategory);

      res.status(StatusCodes.CREATED).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  async update(req, res, next) {

    try {

      const _subCategory = req.data.subCategory;
      
      await SubCategoryRepository.update(_subCategory, req.body);

      const subCategory = SubCategoryRepository.get(_subCategory.id);
      
      const response = new Response(Response.SUCCESS, req.__('_updated._sub_category'), subCategory);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePhoto(req, res, next) {

    try {

      const _subCategory = req.data.subCategory;

      await SubCategoryRepository.updatePhoto(_subCategory, req.file.filename);

      const subCategory = SubCategoryRepository.get(_subCategory.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._photo'), subCategory);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }
  
  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._sub_category'), req.data.subCategory);

    res.status(StatusCodes.OK).send(response);
  }

}

