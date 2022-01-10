const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const OrderItemRepository = require("../repository/OrderItemRepository");


module.exports = class OrderItemController {

  async updateProcessedAt(req, res, next) {
    
    try {
      
      await OrderItemRepository.updateProcessedAt(req.data.orderItem);

      const orderItem = await OrderItemRepository.get(req.data.orderItem.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._order_item_processing_date'), orderItem);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updateTransportedAt(req, res, next) {
    
    try {
      
      await OrderItemRepository.updateTransportedAt(req.data.orderItem);

      const orderItem = await OrderItemRepository.get(req.data.orderItem.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._order_item_transporting_date'), orderItem);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updateDeliveredAt(req, res, next) {
    
    try {
      
      await OrderItemRepository.updateDeliveredAt(req.data.orderItem);

      const orderItem = await OrderItemRepository.get(req.data.orderItem.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._order_item_delivery_date'), orderItem);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

}

