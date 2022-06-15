const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");
const EmailService = require("../emailService");
const ResponseDTO = require("../utils/ResponseDTO");
const StringGenerator = require("../utils/StringGenerator");
const Order = require("../models/Order");
const OrderItemRepository = require("../repository/OrderItemRepository");
const { messageSender } = require("../websocket");

module.exports = class OrderItemController {

  async updateProcessedAt(req, res, next) {
    
    try {
      
      const result = await OrderItemRepository.updateProcessedAt(req.data.orderItem);

      await Promise.all(result.messages.map(chat=> messageSender(req.auth.userId, chat)));

      const orderItem = await OrderItemRepository.get(req.data.orderItem.id);

      const response = ResponseDTO.success(req.__('_updated._order_item'), orderItem);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async updateTransportedAt(req, res, next) {
    
    try {
      
      const result = await OrderItemRepository.updateTransportedAt(req.data.orderItem);

      await Promise.all(result.messages.map(chat=> messageSender(req.auth.userId, chat)));

      const orderItem = await OrderItemRepository.get(req.data.orderItem.id);

      const response = ResponseDTO.success(req.__('_updated._order_item'), orderItem);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async updateDeliveredAt(req, res, next) {
    
    try {
      
      const result = await OrderItemRepository.updateDeliveredAt(req.data.orderItem, StringGenerator.transactionReference);

      await Promise.all(result.messages.map(chat=> messageSender(req.auth.userId, chat)));

      const orderItem = await OrderItemRepository.get(req.data.orderItem.id);

      if (orderItem.order.status === Order.STATUS_FULFILLED)
        await EmailService.send(orderItem.order.customer.user.email, EmailService.ORDER_FULFILLED, { id: orderItem.order.id });

      const response = ResponseDTO.success(req.__('_updated._order_item'), orderItem);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
