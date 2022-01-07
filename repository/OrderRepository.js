const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const sequelize = require("./DB");

module.exports = {

  async numberExists(number) {
    const order = await Order.findOne({ attributes: ['id'], where: { number } });
    return order !== null;
  },

  get(id) {
    return Order.findOne({
      where: { id },
      include: {
        model: OrderItem,
        include: {
          model: ProductVariant,
          include: {
            model: Product,
            attributes: Product.GET_ATTR
          }
        }
      }
    });
  },

  create({ store_id, customer_id, customer_address_id, delivery_firm_id, route_id, number, delivery_method, payment_method, note, order_items }) {
    return sequelize.transaction(async (transaction)=> {

      const order = await Order.create({
        store_id, customer_id, customer_address_id, delivery_firm_id, route_id, number, delivery_method, payment_method, note,
        status: Order.STATUS_PENDING,
        store_status: Order.STORE_STATUS_PENDING,
        delivery_firm_status: (delivery_method === Order.DELIVERY_METHOD_DOOR ? Order.DELIVERY_FIRM_STATUS_PENDING : undefined),
        payment_status: Order.PAYMENT_STATUS_PENDING
      }, 
      { transaction }
      );

      for (let { product_variant_id, route_weight_id, route_duration_id, discount_product_id, quantity, amount, weight, discount_amount, delivery_duration_fee, delivery_weight_fee } of order_items) {
        await OrderItem.create(
          { 
            order_id: order.id, 
            product_variant_id, 
            quantity, 
            amount, 
            weight,
            route_weight_id: route_weight_id ?? undefined,
            route_duration_id: route_duration_id ?? undefined,
            discount_product_id: discount_product_id ?? undefined,
            discount_amount: discount_amount ?? undefined,
            delivery_duration_fee: delivery_duration_fee ?? undefined,
            delivery_weight_fee: delivery_weight_fee ?? undefined
          },
          { transaction }
        );
      }

      return order;
    });
  }


};
