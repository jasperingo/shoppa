const { Op } = require("sequelize");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const sequelize = require("./DB");

module.exports = {

  get(id) {
    return OrderItem.findOne({
      where: { id },
      include: [
        {
          model: Order
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
    return OrderItem.update({ processed_at: Date.now() }, { where: { id: orderItem.id } });
  },

  updateTransportedAt(orderItem) {
    return OrderItem.update({ transported_at: Date.now() }, { where: { id: orderItem.id } });
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
      
      return update;
    });
  }

};

