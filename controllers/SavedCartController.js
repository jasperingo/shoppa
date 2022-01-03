const { StatusCodes } = require("http-status-codes");
const randomstring = require("randomstring");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Pagination = require("../http/Pagination");
const Response = require("../http/Response");
const SavedCartRepository = require("../repository/SavedCartRepository");


module.exports = class SavedCartController {

  async create(req, res, next) {

    try {

      let code, count = 0;

      do {

        code = randomstring.generate({
          length: 5,
          capitalization: 'uppercase'
        });

        count++;

      } while(count < 3 && await SavedCartRepository.codeExists(code));

      if (code === undefined) {
        throw { reason: 'Code not generated' };
      }

      const _savedCart = await SavedCartRepository.create(req.body, code);

      const savedCart = await SavedCartRepository.get(_savedCart.id);

      const response = new Response(Response.SUCCESS, req.__('_created._saved_cart'), savedCart);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async delete(req, res, next) {
    
    try {

      await SavedCartRepository.delete(req.data.savedCart);

      const response = new Response(Response.SUCCESS, req.__('_deleted._saved_cart'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._saved_cart'), req.data.savedCart);

    res.status(StatusCodes.OK).send(response);
  }

  async getList(req, user, pager) {

    const { count, rows } = await SavedCartRepository.getListByUser(user, pager.page_offset, pager.page_limit);

    const pagination = new Pagination(req, pager.page, pager.page_limit, count);

    return new Response(Response.SUCCESS, req.__('_list_fetched._saved_cart'), rows, pagination);
  }

  getListByCustomer = async (req, res, next)=> {
    
    try {

      const { pager, customer: { user } } = req.data;

      const response = await this.getList(req, user, pager);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  getListByStore = async (req, res, next)=> {
    
    try {

      const { pager, store: { user } } = req.data;

      const response = await this.getList(req, user, pager);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

}

