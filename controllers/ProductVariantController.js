const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const ProductVariantRepository = require("../repository/ProductVariantRepository");


module.exports = class ProductVariantController {

  async create(req, res, next) {

    try {

      const _productVariant = await ProductVariantRepository.create(req.body);

      const productVariant = await ProductVariantRepository.get(_productVariant.id);

      const response = new Response(Response.SUCCESS, req.__('_created._product_variant'), productVariant);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async update(req, res, next) {

    try {

      await ProductVariantRepository.update(req.data.productVariant, req.body);

      const productVariant = await ProductVariantRepository.get(req.params.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._product_variant'), productVariant);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async delete(req, res, next) {

    try {

      await ProductVariantRepository.delete(req.data.productVariant);

      const response = new Response(Response.SUCCESS, req.__('_deleted._product_variant'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._product_variant'), req.data.productVariant);

    res.status(StatusCodes.OK).send(response);
  }

}

