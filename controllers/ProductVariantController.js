const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");
const ResponseDTO = require("../utils/ResponseDTO");
const ProductVariantRepository = require("../repository/ProductVariantRepository");

module.exports = class ProductVariantController {

  async create(req, res, next) {

    try {

      const result = await ProductVariantRepository.create(req.body);

      const productVariant = await ProductVariantRepository.get(result.id);

      const response = ResponseDTO.success(req.__('_created._product_variant'), productVariant);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async update(req, res, next) {

    try {

      await ProductVariantRepository.update(req.data.productVariant, req.body);

      const productVariant = await ProductVariantRepository.get(req.params.id);

      const response = ResponseDTO.success(req.__('_updated._product_variant'), productVariant);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async delete(req, res, next) {

    try {

      await ProductVariantRepository.delete(req.data.productVariant);

      const response = ResponseDTO.success(req.__('_deleted._product_variant'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  get(req, res) {
      
    const response = ResponseDTO.success(req.__('_fetched._product_variant'), req.data.productVariant);

    res.status(StatusCodes.OK).send(response);
  }

}
