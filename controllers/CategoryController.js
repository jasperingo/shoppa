const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const CategoryRepository = require("../repository/CategoryRepository");


module.exports = class CategoryController {

  async add(req, res, next) {
    
    try {

      const _category = await CategoryRepository.add(req.body);

      const category = await CategoryRepository.get(_category.id);

      const response = new Response(Response.SUCCESS, req.__('_created._category'), category);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async update(req, res, next) {

    try {

      const _category = req.data.category;
      
      await CategoryRepository.update(_category, req.body);

      const category = await CategoryRepository.get(_category.id);
      
      const response = new Response(Response.SUCCESS, req.__('_updated._category'), category);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updatePhoto(req, res, next) {

    try {

      const _category = req.data.category;

      await CategoryRepository.updatePhoto(_category, req.file.filename);

      const category = await CategoryRepository.get(_category.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._photo'), category);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._category'), req.data.category);

    res.status(StatusCodes.OK).send(response);
  }

  async getRandomList(req, res, next) {

    try {

      const { pager } = req.data;

      const categories = await CategoryRepository.getRandomList(pager.page_limit);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._category'), categories);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  async getListByStore(req, res, next) {

    try {

      const categories = await CategoryRepository.getListStore();

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._category'), categories);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  async getListByProduct(req, res, next) {

    try {

      const categories = await CategoryRepository.getListByProduct();

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._category'), categories);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}

