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
            attributes: User.GET_ATTR
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

  getWithTransactions(id) {
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
            attributes: User.GET_ATTR
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
        },
        {
          model: Transaction
        }
      ]
    });
  },

  create({ 
    store_id, 
    customer_id, 
    customer_address_id, 
    delivery_firm_id, route_id, 
    number, delivery_method, 
    payment_method, 
    note, 
    sub_total, 
    delivery_total,
    discount_total,
    order_items, 
    transaction_reference 
  }) {
    return sequelize.transaction(async (transaction)=> {

      const order = await Order.create({
        store_id, 
        customer_id, 
        customer_address_id, 
        delivery_firm_id, 
        route_id, 
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
        payment_status: Order.PAYMENT_STATUS_PENDING
      }, 
      { transaction }
      );

      for (let { 
        product_variant_id, 
        route_weight_id, 
        route_duration_id, 
        discount_product_id, 
        quantity, 
        amount, 
        weight, 
        discount_amount, 
        delivery_duration_fee, 
        delivery_weight_fee 
      } of order_items) {
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

      const customer = await Customer.findOne({
        attributes: ['user_id'],
        where: { id: customer_id },
        transaction
      });

      await Transaction.create(
        { 
          application: false, 
          order_id: order.id,
          user_id: customer.user_id, 
          reference: transaction_reference,
          amount: -order.total,
          status: Transaction.STATUS_PENDING,
          type: Transaction.TYPE_PAYMENT
        }, 
        { transaction }
      );

      return order;
    });
  },
  
  updateStatusToCancel(order, referenceGenerator) {
    return sequelize.transaction(async (transaction)=> {

      const orderUpdate = await Order.update(
        { status: Order.STATUS_CANCELLED }, 
        { where: { id: order.id }, transaction }
      );

      if (order.payment_status === Order.PAYMENT_STATUS_APPROVED) {
        await Transaction.create(await Transaction.issueOrderRefund(order, referenceGenerator), { transaction });  
      }

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

  updateStoreStatusToDeclined(order, referenceGenerator) {
    return sequelize.transaction(async (transaction)=> {

      const orderUpdate = await Order.update(
        { store_status: Order.STORE_STATUS_DECLINED, status: Order.STATUS_DECLINED }, 
        { where: { id: order.id }, transaction }
      );
      
      if (order.payment_status === Order.PAYMENT_STATUS_APPROVED) {
        await Transaction.create(await Transaction.issueOrderRefund(order, referenceGenerator), { transaction });
      }
      
      return orderUpdate;
    });
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
          { delivery_firm_status: Order.DELIVERY_FIRM_STATUS_ACCEPTED, }, 
          { where: { id: order.id }, transaction }
        );
      }

      return orderUpdate;
    });
  },

  updateDeliveryFirmStatusToDeclined(order, referenceGenerator) {
    return sequelize.transaction(async (transaction)=> {

      const orderUpdate = await Order.update(
        { delivery_firm_status: Order.DELIVERY_FIRM_STATUS_DECLINED, status: Order.STATUS_DECLINED }, 
        { where: { id: order.id }, transaction }
      );
      
      if (order.payment_status === Order.PAYMENT_STATUS_APPROVED) {
        await Transaction.create(await Transaction.issueOrderRefund(order, referenceGenerator), { transaction });
      }
      
      return orderUpdate;
    });
  },


};
