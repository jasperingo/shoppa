const { Op } = require("sequelize");
const Address = require("../models/Address");
const Customer = require("../models/Customer");
const DeliveryFirm = require("../models/DeliveryFirm");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Store = require("../models/Store");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  async numberExists(number) {
    const order = await Order.findOne({ attributes: ['id'], where: { number } });
    return order !== null;
  },

  async idExistsForCustomer(id, customer_id) {
    const order = await Order.findOne({ 
      attributes: ['id'],
      where: { id, customer_id }
    });
    return order !== null;
  },

  async idExistsForStore(id, store_id) {
    const order = await Order.findOne({ 
      attributes: ['id'],
      where: { id, store_id }
    });
    return order !== null;
  },

  async idExistsForDeliveryFirm(id, delivery_firm_id) {
    const order = await Order.findOne({ 
      attributes: ['id'],
      where: { id, delivery_firm_id }
    });
    return order !== null;
  },
  
  get(id) {
    return Order.findOne({
      where: { id },
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
            attributes: User.GET_ATTR,
            include: {
              model: Address,
              attributes: Address.GET_ATTR
            }
          }
        },
        {
          model: DeliveryFirm,
          include: {
            model: User,
            attributes: User.GET_ATTR
          }
        },
        {
          model: Address,
        },
        {
          model: OrderItem,
          include: {
            model: ProductVariant,
            include: {
              model: Product,
              attributes: Product.GET_ATTR
            }
          }
        }
      ]
    });
  },

  getListByCustomer(customer, offset, limit) {
    return Order.findAndCountAll({
      where: { customer_id: customer.id },
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },

  getListByStore(store, offset, limit) {
    return Order.findAndCountAll({
      where: { store_id: store.id },
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },

  getListByDeliveryFirm(deliveryFirm, offset, limit) {
    return Order.findAndCountAll({
      where: { delivery_firm_id: deliveryFirm.id },
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },

  create({ 
    store_id, 
    customer_id, 
    customer_address_id, 
    delivery_firm_id, 
    delivery_route_id, 
    number, 
    delivery_method, 
    payment_method, 
    note, 
    sub_total, 
    delivery_total,
    discount_total,
    order_items
  }) {
    return sequelize.transaction(async (transaction)=> {

      const order = await Order.create({
        store_id, 
        customer_id, 
        customer_address_id, 
        delivery_firm_id, 
        delivery_route_id, 
        number, 
        delivery_method, 
        payment_method, 
        sub_total, 
        delivery_total,
        discount_total,
        note,
        status: Order.STATUS_PENDING,
        store_status: Order.STORE_STATUS_PENDING,
        delivery_firm_status: (delivery_method === Order.DELIVERY_METHOD_DOOR ? Order.DELIVERY_FIRM_STATUS_PENDING : undefined),
      }, 
      { transaction }
      );

      for (let { 
        product_variant_id, 
        delivery_weight_id, 
        delivery_duration_id, 
        discount_product_id, 
        quantity, 
        amount, 
        weight, 
        discount_amount, 
        delivery_fee, 
      } of order_items) {
        await OrderItem.create(
          { 
            order_id: order.id, 
            product_variant_id, 
            quantity, 
            amount, 
            weight,
            delivery_fee: delivery_fee ?? 0,
            discount_amount: discount_amount ?? 0,
            delivery_weight_id: delivery_weight_id ?? undefined,
            delivery_duration_id: delivery_duration_id ?? undefined,
            discount_product_id: discount_product_id ?? undefined,
          },
          { transaction }
        );
      }

      return order;
    });
  },
  
  updateStatusToCancel(order) {
    return sequelize.transaction(async (transaction)=> {

      const orderUpdate = await Order.update(
        { status: Order.STATUS_CANCELLED }, 
        { where: { id: order.id }, transaction }
      );

      return orderUpdate;
    });
  },

  updateStoreStatusToAccepted(order, referenceGenerator) {
    return sequelize.transaction(async (transaction)=> {

      let orderUpdate;

      if (order.delivery_firm_id === null || order.delivery_firm_status === Order.DELIVERY_FIRM_STATUS_ACCEPTED) {
        orderUpdate = await Order.update(
          { store_status: Order.STORE_STATUS_ACCEPTED, status: Order.STATUS_PROCESSING }, 
          { where: { id: order.id }, transaction }
        );
        
        if (order.payment_status === Order.PAYMENT_STATUS_APPROVED) {
          await Transaction.bulkCreate(await Transaction.distributeOrderPayment(order, referenceGenerator), { transaction });
        }
      } else {

        orderUpdate = await Order.update(
          { store_status: Order.STORE_STATUS_ACCEPTED }, 
          { where: { id: order.id }, transaction }
        );
      }

      return orderUpdate;
    });
  },

  updateStoreStatusToDeclined(order) {
    return Order.update(
      { store_status: Order.STORE_STATUS_DECLINED, status: Order.STATUS_DECLINED }, 
      { where: { id: order.id } }
    );
  },

  updateDeliveryFirmStatusToAccepted(order, referenceGenerator) {
    return sequelize.transaction(async (transaction)=> {

      let orderUpdate;

      if (order.store_status === Order.STORE_STATUS_ACCEPTED) {
        orderUpdate = await Order.update(
          { delivery_firm_status: Order.DELIVERY_FIRM_STATUS_ACCEPTED, status: Order.STATUS_PROCESSING }, 
          { where: { id: order.id }, transaction }
        );
        
        if (order.payment_status === Order.PAYMENT_STATUS_APPROVED) {
          await Transaction.bulkCreate(await Transaction.distributeOrderPayment(order, referenceGenerator), { transaction });
        }
      } else {

        orderUpdate = await Order.update(
          { delivery_firm_status: Order.DELIVERY_FIRM_STATUS_ACCEPTED }, 
          { where: { id: order.id }, transaction }
        );
      }

      return orderUpdate;
    });
  },

  updateDeliveryFirmStatusToDeclined(order) {
    return Order.update(
      { delivery_firm_status: Order.DELIVERY_FIRM_STATUS_DECLINED, status: Order.STATUS_DECLINED }, 
      { where: { id: order.id } }
    );
  },
  
};
