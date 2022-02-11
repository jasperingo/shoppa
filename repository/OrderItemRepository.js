const { Op } = require("sequelize");
const Customer = require("../models/Customer");
const DeliveryFirm = require("../models/DeliveryFirm");
const Message = require("../models/Message");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Store = require("../models/Store");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  get(id) {
    return OrderItem.findOne({
      where: { id },
      include: [
        {
          model: Order,
          include: [
            {
              model: Customer,
              attributes: Customer.GET_ATTR,
              include: {
                model: User,
                attributes: User.GET_ATTR
              }
            },
            {
              model: Store,
              include: {
                model: User,
                attributes: User.GET_ATTR
              }
            },
            {
              model: DeliveryFirm,
              include: {
                model: User,
                attributes: User.GET_ATTR
              }
            }
          ]
        },
        {
          model: ProductVariant,
          include: {
            model: Product,
            attributes: Product.GET_ATTR
          }
        }
      ]
    });
  },

  updateProcessedAt(orderItem) {
    return sequelize.transaction(async (transaction)=> {

      const update = await OrderItem.update(
        { processed_at: Date.now() }, 
        { where: { id: orderItem.id }, transaction }
      );

      const message = await Message.create(
        { 
          order_item_id: orderItem.id, 
          sender_id: orderItem.order.store.user.id,
          receiver_id: orderItem.order.customer.user.id,
          notification: Message.NOTIFICATION_ORDER_ITEM_PROCESSING,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        { transaction }
      );

      const messages = [message];
      
      if (orderItem.order.delivery_method === Order.DELIVERY_METHOD_DOOR) {

        const message2 = await Message.create(
          { 
            order_item_id: orderItem.id, 
            sender_id: orderItem.order.store.user.id,
            receiver_id: orderItem.order.delivery_firm.user.id,
            notification: Message.NOTIFICATION_ORDER_ITEM_PROCESSING,
            delivery_status: Message.DELIVERY_STATUS_SENT
          },
          { transaction }
        );

        messages.push(message2);
      }

      return { update, messages };
    });
  },

  updateTransportedAt(orderItem) {
    return sequelize.transaction(async (transaction)=> {

      const update = await OrderItem.update(
        { transported_at: Date.now() }, 
        { where: { id: orderItem.id }, transaction }
      );

      const messages = [
        await Message.create(
          { 
            order_item_id: orderItem.id, 
            sender_id: orderItem.order.delivery_firm.user.id,
            receiver_id: orderItem.order.store.user.id,
            notification: Message.NOTIFICATION_ORDER_ITEM_TRANSPORTED,
            delivery_status: Message.DELIVERY_STATUS_SENT
          },
          { transaction }
        ),

        await Message.create(
          { 
            order_item_id: orderItem.id, 
            sender_id: orderItem.order.delivery_firm.user.id,
            receiver_id: orderItem.order.customer.user.id,
            notification: Message.NOTIFICATION_ORDER_ITEM_TRANSPORTED,
            delivery_status: Message.DELIVERY_STATUS_SENT
          },
          { transaction }
        )
      ];

      return { update, messages };
    });
  },

  updateDeliveredAt(orderItem) {
    return sequelize.transaction(async (transaction)=> {
      const update = await OrderItem.update(
        { delivered_at: Date.now() }, 
        { where: { id: orderItem.id }, transaction }
      );
      
      const notDeliveredItem = await OrderItem.findOne({ 
        attributes: ['id'],
        where: { 
          order_id: orderItem.order_id, 
          delivered_at: { [Op.is]: null } 
        },
        transaction
      });

      if (notDeliveredItem === null) {
        await Order.update(
          { status: Order.STATUS_FULFILLED }, 
          { where: { id: orderItem.order_id }, transaction }
        );
      }

      const message = await Message.create(
        { 
          order_item_id: orderItem.id, 
          sender_id: orderItem.order.customer.user.id,
          receiver_id: orderItem.order.store.user.id,
          notification: Message.NOTIFICATION_ORDER_ITEM_DELIVERED,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        { transaction }
      );

      const messages = [message];
      
      if (orderItem.order.delivery_method === Order.DELIVERY_METHOD_DOOR) {

        messages.push(
          await Message.create(
            { 
              order_item_id: orderItem.id, 
              sender_id: orderItem.order.customer.user.id,
              receiver_id: orderItem.order.delivery_firm.user.id,
              notification: Message.NOTIFICATION_ORDER_ITEM_DELIVERED,
              delivery_status: Message.DELIVERY_STATUS_SENT
            },
            { transaction }
          )
        );
      }
      
      return { update, messages };
    });
  }

};

