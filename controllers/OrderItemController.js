const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const StringGenerator = require("../http/StringGenerator");
const OrderItemRepository = require("../repository/OrderItemRepository");
const { messageSender } = require("../websocket");


module.exports = class OrderItemController {

  async updateProcessedAt(req, res, next) {
    
    try {
      
      const result = await OrderItemRepository.updateProcessedAt(req.data.orderItem);

      result.messages.forEach(async (chat)=> await messageSender(req.auth.userId, chat));

      const orderItem = await OrderItemRepository.get(req.data.orderItem.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._order_item'), orderItem);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updateTransportedAt(req, res, next) {
    
    try {
      
      const result = await OrderItemRepository.updateTransportedAt(req.data.orderItem);

      result.messages.forEach(async (chat)=> await messageSender(req.auth.userId, chat));

      const orderItem = await OrderItemRepository.get(req.data.orderItem.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._order_item'), orderItem);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updateDeliveredAt(req, res, next) {
    
    try {
      
      const result = await OrderItemRepository.updateDeliveredAt(req.data.orderItem, StringGenerator.transactionReference);

      result.messages.forEach(async (chat)=> await messageSender(req.auth.userId, chat));

      const orderItem = await OrderItemRepository.get(req.data.orderItem.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._order_item'), orderItem);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

}

