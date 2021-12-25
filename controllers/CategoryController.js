const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const CategoryRepository = require("../repository/CategoryRepository");


module.exports = class CategoryController {

  async add(req, res, next) {
    
    try {

      const category = await CategoryRepository.add(req.body);

      const response = new Response(Response.SUCCESS, req.__('_created._category'), category);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async update(req, res, next) {

    try {

      const { category } = req.data;
      
      await CategoryRepository.update(category, req.body);
      
      const response = new Response(Response.SUCCESS, req.__('_updated._category'), category);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePhoto(req, res, next) {

    try {

      const { category } = req.data;

      await CategoryRepository.updatePhoto(category, req.file.filename);

      const response = new Response(Response.SUCCESS, req.__('_updated._photo'), category);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._category'), req.data.category);

    res.status(StatusCodes.OK).send(response);
  }

  async getList(req, res, next) {

    try {

      const categories = await CategoryRepository.getList();

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._category'), categories);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}

