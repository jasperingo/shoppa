const { Op } = require("sequelize");
const Address = require("../models/Address");
const AddressHistory = require("../models/AddressHistory");
const Customer = require("../models/Customer");
const CustomerHistory = require("../models/CustomerHistory");
const DeliveryFirm = require("../models/DeliveryFirm");
const Message = require("../models/Message");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const ProductHistory = require("../models/ProductHistory");
const ProductVariant = require("../models/ProductVariant");
const ProductVariantHistory = require("../models/ProductVariantHistory");
const Store = require("../models/Store");
const StoreHistory = require("../models/StoreHistory");
const User = require("../models/User");
const UserHistory = require("../models/UserHistory");
const { notificationSender } = require("../websocket");
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
    return sequelize.transaction(async (transaction)=> {
      const order = await Order.findOne({
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
        ],
        transaction
      });

      if (order !== null) {

        const orderDate = (new Date(order.created_at)).getTime();

        const customerUpdatedDate = (new Date(order.customer.updated_at)).getTime();

        const customerUserUpdatedDate = (new Date(order.customer.user.updated_at)).getTime();

        const storeUpdatedDate = (new Date(order.store.updated_at)).getTime();

        const storeUserUpdatedDate = (new Date(order.store.user.updated_at)).getTime();

        const storeAddressUpdatedDate = (new Date(order.store.user.addresses[0].updated_at)).getTime();

        if (customerUpdatedDate > orderDate) {
          const customerHistory = await CustomerHistory.findOne({
            where: {
              customer_id: order.customer.id,
              created_at: { [Op.gt]: order.created_at }
            },
            order: [['created_at', 'ASC']],
            transaction
          });

          if (customerHistory !== null) {
            order.customer.first_name = customerHistory.first_name;
            order.customer.last_name = customerHistory.last_name;
          }
        }

        if (customerUserUpdatedDate > orderDate) {
          const customerUserHistory = await UserHistory.findOne({
            where: {
              user_id: order.customer.user.id,
              created_at: { [Op.gt]: order.created_at }
            },
            order: [['created_at', 'ASC']],
            transaction
          });

          if (customerUserHistory !== null) {
            order.customer.user.name = customerUserHistory.name;
            order.customer.user.email = customerUserHistory.email;
            order.customer.user.phone_number = customerUserHistory.phone_number;
            order.customer.user.photo = customerUserHistory.photo;
          }
        }

        if (storeUpdatedDate > orderDate) {
          const storeHistory = await StoreHistory.findOne({
            where: {
              store_id: order.store.id,
              created_at: { [Op.gt]: order.created_at }
            },
            order: [['created_at', 'ASC']],
            transaction
          });

          if (storeHistory !== null)
            order.store.sub_category_id = storeHistory.sub_category_id;
        }
        
        if (storeUserUpdatedDate > orderDate) {
          const storeUserHistory = await UserHistory.findOne({
            where: {
              user_id: order.store.user.id,
              created_at: { [Op.gt]: order.created_at }
            },
            order: [['created_at', 'ASC']],
            transaction
          });

          if (storeUserHistory !== null) {
            order.store.user.name = storeUserHistory.name;
            order.store.user.email = storeUserHistory.email;
            order.store.user.phone_number = storeUserHistory.phone_number;
            order.store.user.photo = storeUserHistory.photo;
          }
        }

        if (storeAddressUpdatedDate > orderDate) {
          const storeAddressHistory = await AddressHistory.findOne({
            where: {
              address_id: order.store.user.addresses[0].id,
              created_at: { [Op.gt]: order.created_at }
            },
            order: [['created_at', 'ASC']],
            transaction
          });

          if (storeAddressHistory !== null) {
            order.store.user.addresses[0].city = storeAddressHistory.city;
            order.store.user.addresses[0].street = storeAddressHistory.street;
            order.store.user.addresses[0].state = storeAddressHistory.state;
          }
        }

        if (order.address !== null) {

          const addressUpdatedDate = (new Date(order.address.updated_at)).getTime();

          if (addressUpdatedDate > orderDate) {
            const addressHistory = await AddressHistory.findOne({
              where: {
                address_id: order.address.id,
                created_at: { [Op.gt]: order.created_at }
              },
              order: [['created_at', 'ASC']],
              transaction
            });
            
            if (addressHistory !== null) {
              order.address.city = addressHistory.city;
              order.address.street = addressHistory.street;
              order.address.state = addressHistory.state;
              order.address.title = addressHistory.title;
              order.address.type = addressHistory.type;
            }
          }
        }

        if (order.delivery_firm !== null) {

          const deliveryUserUpdatedDate = (new Date(order.delivery_firm.user.updated_at)).getTime();

          if (deliveryUserUpdatedDate > orderDate) {
            const deliveryUserHistory = await UserHistory.findOne({
              where: {
                user_id: order.delivery_firm.user.id,
                created_at: { [Op.gt]: order.created_at }
              },
              order: [['created_at', 'ASC']],
              transaction
            });
            
            if (deliveryUserHistory !== null) {
              order.delivery_firm.user.name = deliveryUserHistory.name;
              order.delivery_firm.user.email = deliveryUserHistory.email;
              order.delivery_firm.user.phone_number = deliveryUserHistory.phone_number;
              order.delivery_firm.user.photo = deliveryUserHistory.photo;
            }
          }
        }

        for (let item of order.order_items) {

          const productUpdatedDate = (new Date(item.product_variant.product.updated_at)).getTime();

          const productVariantUpdatedDate = (new Date(item.product_variant.updated_at)).getTime();

          if (productVariantUpdatedDate > orderDate) {
            const productVariantHistory = await ProductVariantHistory.findOne({
              where: {
                product_variant_id: item.product_variant.id,
                created_at: { [Op.gt]: order.created_at }
              },
              order: [['created_at', 'ASC']],
              transaction
            });
            
            if (productVariantHistory !== null) {
              item.product_variant.name = productVariantHistory.name;
              item.product_variant.price = productVariantHistory.price;
              item.product_variant.quantity = productVariantHistory.quantity;
              item.product_variant.weight = productVariantHistory.weight;
              item.product_variant.available = productVariantHistory.available;
            }
          }

          if (productUpdatedDate > orderDate) {
            const productHistory = await ProductHistory.findOne({
              where: {
                product_id: item.product_variant.product.id,
                created_at: { [Op.gt]: order.created_at }
              },
              order: [['created_at', 'ASC']],
              transaction
            });
            
            if (productHistory !== null) {
              item.product_variant.product.title = productHistory.title;
              item.product_variant.product.code = productHistory.code;
              item.product_variant.product.photo = productHistory.photo;
            }
          }

        }

      }
      
      return order;
    });
  },

  getList(offset, limit, options) { 
    return Order.findAndCountAll({
      where: options ?? undefined,
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },

  getCount() {
    return Order.count();
  },
  
  getListByCustomer(customer, offset, limit, options) {
    return Order.findAndCountAll({
      where: { customer_id: customer.id, ...options },
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },

  getListByStore(store, offset, limit, options) {
    return Order.findAndCountAll({
      where: { store_id: store.id, ...options },
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },

  getListByDeliveryFirm(deliveryFirm, offset, limit, options) {
    return Order.findAndCountAll({
      where: { delivery_firm_id: deliveryFirm.id, ...options },
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

      const customer = await Customer.findByPk(customer_id, { 
        attributes: ['user_id'], 
        transaction 
      });

      const store = await Store.findByPk(store_id, { 
        attributes: ['user_id'], 
        transaction 
      });

      const message = await notificationSender(
        store.user_id,
        { 
            order_id: order.id, 
            user_id: customer.user_id,
            notification: Message.NOTIFICATION_ORDER_CREATED,
            delivery_status: Message.DELIVERY_STATUS_SENT
        },
        transaction
      );
      
      const messages = [message];

      if (delivery_method === Order.DELIVERY_METHOD_DOOR) {

        const deliveryFirm = await DeliveryFirm.findByPk(delivery_firm_id, { 
          attributes: ['user_id'], transaction 
        });

        const message2 = await notificationSender(
          deliveryFirm.user_id,
          { 
            order_id: order.id, 
            user_id: customer.user_id,
            notification: Message.NOTIFICATION_ORDER_CREATED,
            delivery_status: Message.DELIVERY_STATUS_SENT
          },
          transaction
        );

        messages.push(message2);
      }

      return { order, messages };
    });
  },
  
  updateStatusToCancel(order) {
    return sequelize.transaction(async (transaction)=> {

      const orderUpdate = await Order.update(
        { status: Order.STATUS_CANCELLED }, 
        { where: { id: order.id }, transaction }
      );

      const message = await notificationSender(
        order.store.user.id,
        { 
          order_id: order.id, 
          user_id: order.customer.user.id,
          notification: Message.NOTIFICATION_ORDER_CANCELLED,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        transaction
      );
      
      const messages = [message];
      
      if (order.delivery_method === Order.DELIVERY_METHOD_DOOR) {

        const message2 = await notificationSender(
          order.delivery_firm.user.id,
          { 
            order_id: order.id, 
            user_id: order.customer.user.id,
            notification: Message.NOTIFICATION_ORDER_CANCELLED,
            delivery_status: Message.DELIVERY_STATUS_SENT
          },
          transaction
        );

        messages.push(message2);
      }

      return { orderUpdate, messages };
    });
  },

  updateStoreStatusToAccepted(order) {
    return sequelize.transaction(async (transaction)=> {

      const deliveryDone = order.delivery_firm_id === null || order.delivery_firm_status === Order.DELIVERY_FIRM_STATUS_ACCEPTED;

      const values = { store_status: Order.STORE_STATUS_ACCEPTED };

      if (deliveryDone) 
        values.status = Order.STATUS_PROCESSING;
      
      const orderUpdate = await Order.update(values, { 
        where: { id: order.id }, 
        transaction 
      });

      if (deliveryDone)
        await this.reduceOrderItemProductQuantity(order, transaction);
        
      const message = await notificationSender(
        order.customer.user.id,
        { 
          order_id: order.id, 
          user_id: order.store.user.id,
          notification: Message.NOTIFICATION_ORDER_ACCEPTED,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        transaction
      );

      return { orderUpdate, message };
    });
  },

  updateStoreStatusToDeclined(order) {
    return sequelize.transaction(async (transaction)=> {

      const orderUpdate = await Order.update(
        { store_status: Order.STORE_STATUS_DECLINED, status: Order.STATUS_DECLINED }, 
        { 
          where: { id: order.id }, 
          transaction 
        }
      );
  
      const message = await notificationSender(
        order.customer.user.id,
        { 
          order_id: order.id, 
          user_id: order.store.user.id,
          notification: Message.NOTIFICATION_ORDER_DECLINED,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        transaction
      );

      return { orderUpdate, message };
    });
  },

  updateDeliveryFirmStatusToAccepted(order) {
    return sequelize.transaction(async (transaction)=> {

      const value = { delivery_firm_status: Order.DELIVERY_FIRM_STATUS_ACCEPTED };

      if (order.store_status === Order.STORE_STATUS_ACCEPTED)
        value.status = Order.STATUS_PROCESSING;
        
      const orderUpdate = await Order.update(value, { 
        where: { id: order.id }, 
        transaction 
      });
      
      if (order.store_status === Order.STORE_STATUS_ACCEPTED)
        await this.reduceOrderItemProductQuantity(order, transaction);

      const message = await notificationSender(
        order.customer.user.id,
        { 
          order_id: order.id, 
          user_id: order.delivery_firm.user.id,
          notification: Message.NOTIFICATION_ORDER_ACCEPTED,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        transaction
      );

      return { orderUpdate, message };
    });
  },

  updateDeliveryFirmStatusToDeclined(order) {
    return sequelize.transaction(async (transaction)=> {    

      const orderUpdate = await Order.update(
        { delivery_firm_status: Order.DELIVERY_FIRM_STATUS_DECLINED, status: Order.STATUS_DECLINED }, 
        { where: { id: order.id }, transaction }
      );

      const message = await notificationSender(
        order.customer.user.id,
        { 
          order_id: order.id, 
          user_id: order.delivery_firm.user.id,
          notification: Message.NOTIFICATION_ORDER_DECLINED,
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        transaction
      );

      return { orderUpdate, message };
    });
  },

  async reduceOrderItemProductQuantity(order, transaction) {
    for (let item of order.order_items) {

      await ProductVariant.decrement(
        { quantity: item.quantity }, 
        { where: { id: item.product_variant_id }, transaction }
      );
    }
  }
  
};

